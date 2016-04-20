'use strict';
//var nutrify = require('nutrify.js');

// Recipes controller
angular.module('recipes').controller('RecipesController', ['$http','$scope', '$stateParams', '$timeout', '$location', '$window', 'Authentication', 'FileUploader', 'Recipes','Usda',
  function ($http,$scope, $stateParams, $timeout, $location, $window, Authentication, FileUploader, Recipes,Usda) {
    $scope.authentication = Authentication;
    //$scope.imageURL = $scope.recipe.recipeImgURL;..
    $scope.user = Authentication.user;
    // Create file uploader instance
    $scope.uploader = new FileUploader({
      url: 'api/users/picture',
      alias: 'newProfilePicture'
    });

     // Set file uploader image filter
    $scope.uploader.filters.push({
      name: 'imageFilter',
      fn: function (item, options) {
        var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
        return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
      }
    });

    //ingredients array for pushing ingredients during creation
    $scope.original_ingredients = [];
    //Bool to check if assests loaded from promises for the loading gif 
    $scope.assestsLoaded = false;
    //index for pushed ingredients
    $scope.ingredientNumber = 0;
    //error checking for api calls
    $scope.apiError = false;
    //initialize healthify stuff
    //array for min check on each item in the orig_ing list on healthify page
    $scope.min_check = [];
    //nutrient id's for usda database
    $scope.init_parameters = [
    { _id: 255, value: 'water' }, 
    { _id: 208, value: 'energy' },
    { _id: 203, value: 'protein' }, 
    { _id: 204, value: 'total lipids (fat)' }, 
    { _id: 205, value: 'carbohydrates' }, 
    { _id: 291, value: 'fiber' }, 
    { _id: 269, value: 'sugar' }, 
    { _id: 301, value: 'calcium' }, 
    { _id: 303, value: 'iron' }, 
    { _id: 306, value: 'potassium' }, 
    { _id: 307, value: 'sodium' }, 
    { _id: 606, value: 'saturated fats' }
    ];
    //parameter drop down
    $scope.parameters = [];
    //array for healthify ingredients to be pushed to
    $scope.healthify_ingredients = [];
    
    /*Allergy Initializations */
    $scope.nuts = false;
    $scope.eggs = false;
    $scope.fish = false;
    $scope.dairy = false;
    $scope.wheat = false;
    $scope.soy = false;

    $scope.ingredients = {
      item: '',
      quantity: 0,
      unit: '',
      food_item: {
        name: '',
        ndbno: '',
        group: '',
        manu: '',
        nutrients: []
      }
    };

    $scope.init_ing = false;

    //initialize healthy_ing array
    function initializeIngredients() {
      for (var i in $scope.recipe.orig_ing) {
        $scope.recipe.healthy_ing.push($scope.recipe.orig_ing[i].food_item);
      }
      $scope.init_ing = true;
    }

    //Clears the modal info for failed api request on button press
    $scope.clearResults = function(){
      $scope.apiError = false;
      $scope.assestsLoaded = false;
      $scope.usdaList = [];
    };
    //Selected ingredient from list in create recipe modal
    $scope.confirmIngredient = function(index){
      $scope.confirmed = $scope.usdaList.item[index];
      console.log($scope.confirmed);
    };
    //Selected ingredient from list in healthify modal
    $scope.confirmHealthify = function(index){
      //this confirms undefined for now should work with an array
      $scope.healthyIngredient = $scope.healthify_ingredients[index];
      console.log(index + ' ' + $scope.healthyIngredient);
    };

    //pushing the ingredient into the ingredient array
    $scope.addIngredientLine = function () {
      
      
      console.log('Adding Ingredient Line');
      //promises Promises PROMISES
      //ensduring the ndbno is set before running the get request using it
      var promise = new Promise(function(resolve,reject){
        
        $scope.ingredients.food_item.name = $scope.confirmed.name;
        $scope.ingredients.food_item.ndbno = $scope.confirmed.ndbno;
        $scope.ingredients.food_item.group = $scope.confirmed.group;
        $scope.original_ingredients.push($scope.ingredients);
        $scope.ingredients = {
          item: '',
          quantity: 0,
          unit: '',
          food_item: {
            name: '',
            ndbno: '',
            group: '',
            manu: '',
            nutrients: []
          }
        };
        resolve();
      });
      //running the promise then the findFood report THEN setting the result and resetting error info
      promise.then(function(){
        findFoodReport().then(function(result){
          console.log(' addIngredientLine log ' + JSON.stringify(result));
          //error checking 
          if(result){
            $scope.original_ingredients[$scope.ingredientNumber].food_item.nutrients = result.nutrients;
              //reset the input values
            $scope.ingredientNumber = $scope.ingredientNumber + 1;
            $scope.usdaList = [];
            $scope.assestsLoaded = false;
            $scope.apiError = false;
            console.log($scope.original_ingredients);
          }else{
            $scope.apiError = true;
          }
        });
      });
    };

    $scope.addIngredient = function () {
      console.log('Adding Ingredient Line');
      var promise = new Promise(function(resolve,reject){
        
        $scope.ingredients.food_item.name = $scope.confirmed.name;
        $scope.ingredients.food_item.ndbno = $scope.confirmed.ndbno;
        $scope.ingredients.food_item.group = $scope.confirmed.group;
        $scope.recipe.orig_ing.push($scope.ingredients);
        $scope.ingredients = {
          item: '',
          quantity: 0,
          unit: '',
          food_item: {
            name: '',
            ndbno: '',
            group: '',
            manu: '',
            nutrients: []
          }
        };
        resolve();
      });
      promise.then(function(){
        findFoodReport().then(function(result){
          console.log(' addIngredient log ' + JSON.stringify(result));
          if(result){
            $scope.recipe.orig_ing[$scope.ingredientNumber].food_item.nutrients = result.nutrients;
              //reset the input values
            $scope.ingredientNumber = $scope.ingredientNumber + 1;
            $scope.usdaList = [];
            $scope.assestsLoaded = false;
            $scope.apiError = false;
            console.log($scope.recipe.orig_ing);
          }else{
            $scope.apiError = true;
          }
        });
      });
      
    };

    //deletes for create recipe page
    $scope.deleteIngredientLine = function(ingredient) {
      for (var i in $scope.original_ingredients) {
        if ($scope.original_ingredients[i] === ingredient) {
          $scope.original_ingredients.splice(i,1);
        }
      }
    };

    //deletes for edit recipe page
    $scope.deleteIngredient = function(ingredient) {
      for (var i in $scope.recipe.orig_ing) {
        if ($scope.recipe.orig_ing[i] === ingredient) {
          $scope.recipe.orig_ing.splice(i,1);
          if($scope.recipe.healthy_ing) {
            $scope.recipe.healthy_ing.splice(i,1);
          }
        }
      }
    };

    // Create new Recipe
    $scope.create = function (isValid) {

      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'recipeForm');

        return false;
      }

      // Create new Recipe object
      var recipe = new Recipes({
        title: this.title,
        orig_ing: [],//fill in array here
        instructions: this.instructions,
        servings: this.servings,
        cook_time: this.cook_time,
        imgURL: '5',
        tags: {
          allergies: {
            nuts: $scope.nuts,
            eggs: $scope.eggs,
            fish: $scope.fish,
            dairy: $scope.dairy,
            wheat: $scope.wheat,
            soy: $scope.soy
          },
          health_concerns: []
        }
      });
      console.log($scope.original_ingredients);
      console.log(recipe);
      for(var i=0;i < $scope.original_ingredients.length; i++){

        recipe.orig_ing.push($scope.original_ingredients[i]);
        
      }

      //console.log
      //this is where ill check to see the file size
      var sizegood = true;
      var imgsize = $scope.imageURL.length * (3/4);
      console.log(imgsize);

      if(imgsize > 1000000){
        sizegood = false;
        alert('Image size can\'t be greater than 1MB!');
      }


      if(sizegood){
      // Redirect after save
        recipe.$save(function (response) {
            // Clear form fields
          $scope.title = '';
          $scope.directions = '';
          console.log(recipe._id);
          console.log(recipe.imageURL);
          $scope.edUploadRecipePic(recipe).then(function(){
            console.log(recipe.imageURL);
            $location.path('recipes/' + response._id);
          });
          
            //setTimeout(function(){ }, 10000);
          /*
          promise.then(function(){
            console.log('upload promise then');
            
          });*/
          // Clear form fields
          /*$scope.title = '';
          $scope.directions = '';
          console.log(recipe._id);
          console.log(recipe.imageURL);
          $scope.edUploadRecipePic(recipe);
          console.log(recipe.imageURL);*/
        }, function (errorResponse) {
          console.log('error response function called anyways');
          $scope.error = errorResponse.data.message;
        });
      }
    };

    // Remove existing Recipe
    $scope.remove = function (recipe) {
      if (recipe) {
        recipe.$remove();

        for (var i in $scope.recipes) {
          if ($scope.recipes[i] === recipe) {
            $scope.recipes.splice(i, 1);
          }
        }
      } else {
        $scope.recipe.$remove(function () {
          $location.path('recipes');
        });
      }
    };

    // Update existing Recipe
    $scope.update = function (isValid) {
      //console.log("calling the update in client.");
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'recipeForm');

        return false;
      }

      var recipe = $scope.recipe;

      recipe.$update(function () {
        $location.path('recipes/' + recipe._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find a list of Recipes
    $scope.find = function () {
      $scope.recipes = Recipes.query();
    };

    // Find existing Recipe
    $scope.findOne = function () {
      console.log($stateParams.recipeId);
      $scope.recipe = Recipes.get({
        recipeId: $stateParams.recipeId
      });
      //$scope.init_ing = true;
    };
    //copy pasted mean generate picture upload. May break picture preview may not, not enough to test thoroughly
    // Called after the user selected a new picture file
    $scope.uploader.onAfterAddingFile = function (fileItem) {
      if ($window.FileReader) {
        var fileReader = new FileReader();
        fileReader.readAsDataURL(fileItem._file);

        fileReader.onload = function (fileReaderEvent) {
          $timeout(function () {
            $scope.imageURL = fileReaderEvent.target.result;

          }, 0);
        };
      }
    };

    // Called after the user has successfully uploaded a new picture
    $scope.uploader.onSuccessItem = function (fileItem, response, status, headers) {
      // Show success message
      $scope.success = true;

      // Populate user object
      $scope.user = Authentication.user = response;

      // Clear upload buttons
      $scope.cancelUpload();
    };

    // Called after the user has failed to uploaded a new picture
    $scope.uploader.onErrorItem = function (fileItem, response, status, headers) {
      // Clear upload buttons
      $scope.cancelUpload();

      // Show error message
      $scope.error = response.message;
    };

    // Change recipe picture
    $scope.uploadRecipePicture = function () {
      // Clear messages
      $scope.success = $scope.error = null;

      // Start upload
      $scope.uploader.uploadAll();
    };


    $scope.myFilter = function (item) { 
      return item.user.displayName === $scope.user.displayName; 
    };
    //end copy pasted code

    //amazon pic upload, Works sometimes?
    $scope.edUploadRecipePic = function (passedRecipe){
      console.log('first half runs');

     // console.log(passedRecipe._id);
      //console.log($scope.recipe.recipeImgURL);
      //console.log($scope.imageURL);
      return new Promise(function(resolve,reject){
        console.log('promise happens in client side');
        resolve($http.post('/api/recipes/'+passedRecipe._id,{ _id: passedRecipe._id, pic: $scope.imageURL }).then(function(){
          var recipe = passedRecipe;
          console.log('then function runs');
          recipe.imgURL = 'https://s3.amazonaws.com/finalrecipepictures/'+passedRecipe._id+'.jpg';

          recipe.$update(function () {
            //$location.path('recipes/' + recipe._id);
          }, function (errorResponse) {
            console.log('screwed');
            $scope.error = errorResponse.data.message;
          });
        }));
      });
    };

    // Cancel the upload process
    $scope.cancelUpload = function () {
      $scope.uploader.clearQueue();
      $scope.imageURL = $scope.recipe.recipeImgURL;
    };

    //call nutrify findfoodreport and return promise object holding foodreport object
    function findFoodReport() {
      
      return new Promise(function(resolve,reject){
        resolve($http.get('/api/usda/foodReport/' + $scope.confirmed.ndbno).then(function(response){return response.data;}));
        
      });
    }
    //used in healthify to get alternative ingredients
    $scope.findAlternatives = function(index, ingredient) {
      console.log($scope.parameters[index]);
      var param_val = $scope.parameters[index];
      var param_id = 205;
      $scope.ingredientNumber = index;
      for (var i in $scope.init_parameters) {
        if ($scope.init_parameters[i].value === param_val) {
          param_id = $scope.init_parameters[i]._id;
          break;
        }
      }

      var ingredient_info = {
        query: ingredient.item,
        ndbno: ingredient.food_item.ndbno,
        nutId: param_id,
        minimize: $scope.min_check[index]
      };

      console.log(ingredient_info);
      //stringing object to pass through url
      var string_ingred_info =JSON.stringify(ingredient_info);

      console.log(string_ingred_info);
      //get request using string object. Suggest using base64 encoding package in the future to prevent string characters interfering in url data
      $http.get('/api/usda/healthify/' + string_ingred_info).then(function(response){
        console.log(response.data);
        //this should be an array coming from the data
        $scope.healthify_ingredients = response.data;
        console.log($scope.healthify_ingredients);
      });
      
    };

    $scope.addHealthyIngredients = function() {
      //console.log($scope.healthify_ingredients[0])
      if($scope.init_ing === false) {
        initializeIngredients();
      }
      
      console.log('Adding Ingredient Line');

      //add healthy ingredient to healthy_ing
      $scope.recipe.healthy_ing[$scope.ingredientNumber].food_item = $scope.healthyIngredient;
    

      //reset healthyIngredient to null
      $scope.healthyIngredient = {
        item: '',
        quantity: 0,
        unit: '',
        food_item: {
          name: '',
          ndbno: '',
          group: '',
          manu: '',
          nutrients: []
        }
      };
      //reset the healthify_ingredients from modal to empty
      $scope.healthify_ingredients = [];
      $scope.ingredientNumber = 0;
      
      console.log($scope.recipe);
    };


    $scope.findFoods = function(){
      //returns promise with food object
      return new Promise(function(resolve,reject){
        //get request that then does error checking based on result
        resolve($http.get('/api/usda/' + $scope.ingredients.item).then(function(response){
          if(response.data !== 404){
            $scope.usdaList = response.data;
            $scope.assestsLoaded = true;
            $scope.apiError = false;
            console.log('printing list ' + JSON.stringify(response));
          }else{
            $scope.usdaList = [];
            $scope.assestsLoaded = true;
            $scope.apiError = true;
            console.log('error recieving list' + JSON.stringify(response.data));
          }
        }));
      });
    };
   
  }
]);
