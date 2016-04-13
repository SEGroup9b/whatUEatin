'use strict';
//var nutrify = require('nutrify.js');

// Recipes controller
angular.module('recipes').controller('RecipesController', ['$http','$scope', '$stateParams', '$timeout', '$location', '$window', 'Authentication', 'FileUploader', 'Recipes','Usda',
  function ($http,$scope, $stateParams, $timeout, $location, $window, Authentication, FileUploader, Recipes,Usda) {
    $scope.authentication = Authentication;
    //$scope.imageURL = $scope.recipe.recipeImgURL;
    
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

    $scope.original_ingredients = [];
    $scope.assestsLoaded = false;
    $scope.ingredientNumber = 0;
    $scope.apiError = false;
    //initialize healthify stuff
    $scope.min_check = [];
    $scope.init_parameters = [
    { _id: 255, value: 'water' }, 
    { _id: 208, value: 'energy' },
    { _id: 203, value: 'protien' }, 
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
    $scope.parameters = [];
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

    $scope.clearResults = function(){
      $scope.apiError = false;
      $scope.assestsLoaded = false;
      $scope.usdaList = [];
    };

    $scope.confirmIngredient = function(index){
      $scope.confirmed = $scope.usdaList.item[index];
      console.log($scope.confirmed);
    };
    $scope.confirmHealthify = function(index){
      //this confirms undefined for now should work with an array
      $scope.healthyIngredient = $scope.healthify_ingredients[index];
      console.log(index + ' ' + $scope.healthyIngredient);
    };


    $scope.addIngredientLine = function () {
      
      console.log('Adding Ingredient Line');
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
      promise.then(function(){
        findFoodReport().then(function(result){
          console.log(' addIngredientLine log ' + JSON.stringify(result));
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

    $scope.deleteIngredientLine = function(ingredient) {
      for (var i in $scope.original_ingredients) {
        if ($scope.original_ingredients[i] === ingredient) {
          $scope.original_ingredients.splice(i,1);
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

      // Redirect after save
      recipe.$save(function (response) {
        var promise = new Promise(function(resolve,reject){
          // Clear form fields
          $scope.title = '';
          $scope.directions = '';
          console.log(recipe._id);
          console.log(recipe.imageURL);
          $scope.edUploadRecipePic(recipe);
          console.log(recipe.imageURL);
        });
        promise.then(function(){
          console.log('upload promise then');
          $location.path('recipes/' + response._id);
        });
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
        //this is when i'll do it
      });
    };

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

    $scope.edUploadRecipePic = function (passedRecipe){
      console.log('first half runs');

     // console.log(passedRecipe._id);
      //console.log($scope.recipe.recipeImgURL);
      //console.log($scope.imageURL);
      $http.post('/api/recipes/'+passedRecipe._id,{ _id: passedRecipe._id, pic: $scope.imageURL });

      var recipe = passedRecipe;

      recipe.imgURL = 'https://s3.amazonaws.com/finalrecipepictures/'+passedRecipe._id+'.jpg';

      recipe.$update(function () {
        $location.path('recipes/' + recipe._id);
      }, function (errorResponse) {
        console.log('screwed');
        $scope.error = errorResponse.data.message;
      });


    };

    // Cancel the upload process
    $scope.cancelUpload = function () {
      $scope.uploader.clearQueue();
      $scope.imageURL = $scope.recipe.recipeImgURL;
    };


    function findFoodReport() {
      
      return new Promise(function(resolve,reject){
        resolve($http.get('/api/usda/foodReport/' + $scope.confirmed.ndbno).then(function(response){return response.data;}));
        
      });
    }

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

      var string_ingred_info =JSON.stringify(ingredient_info);

      console.log(string_ingred_info);

      $http.get('/api/usda/healthify/' + string_ingred_info).then(function(response){
        console.log(response.data);
        //this should be an array coming from the data
        $scope.healthify_ingredients = response.data;
        console.log($scope.healthify_ingredients);
      });
      
    };

    $scope.addHealthyIngredients = function() {
      //console.log($scope.healthify_ingredients[0])
      
      console.log('Adding Ingredient Line');

      $scope.recipe.healthy_ing[$scope.ingredientNumber] = $scope.healthyIngredient;

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
      $scope.healthify_ingredients = [];
      $scope.ingredientNumber = 0;
      
      console.log($scope.recipe);
    };


    $scope.findFoods = function(){
      return new Promise(function(resolve,reject){
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
