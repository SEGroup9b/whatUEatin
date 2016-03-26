'use strict';
//var nutrify = require('nutrify.js');

// Recipes controller
angular.module('recipes').controller('RecipesController', ['$scope', '$stateParams', '$timeout', '$location', '$window', 'Authentication', 'FileUploader', 'Recipes',
  function ($scope, $stateParams, $timeout, $location, $window, Authentication, FileUploader, Recipes) {
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
    // $scope.ingredients = {
    //   quantity: null,
    //   unit: 'tbsp',
    //   item: ''
    // };

    $scope.addIngredientLine = function () {
      //maybe check if previous ingredient filled out
      console.log($scope.item,$scope.unit,$scope.quantity);
      $scope.original_ingredients.push({ item: $scope.item, unit: $scope.unit, quantity: $scope.quantity });
      //reset the input values
      $scope.quantity = null;
      $scope.unit = '';
      $scope.item = '';
      
      console.log($scope.original_ingredients);
    };

    // Create new Recipe
    $scope.create = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'recipeForm');

        return false;
      }
      //$scope.populateArr();

      // Create new Recipe object
      var recipe = new Recipes({
        title: this.title,
        orig_ing: [],//fill in array here
        instructions: this.instructions,
        servings: this.servings,
        cook_time: this.cook_time
      });
      console.log($scope.original_ingredients);
      console.log(recipe);
      for(var i=0;i < $scope.original_ingredients.length; i++){
      /*  
      var ingredient = {
          quantity: $scope.original_ingredients[i].quantity,
          unit: $scope.original_ingredients[i].unit,
          item: $scope.original_ingredients[i].item
        };*/
        //console.log(ingredient);
        recipe.orig_ing.push($scope.original_ingredients[i]);
        
      }
      console.log(recipe);

      // Redirect after save
      recipe.$save(function (response) {
        $location.path('recipes/' + response._id);

        // Clear form fields
        $scope.title = '';
        $scope.directions = '';
      }, function (errorResponse) {
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
      $scope.recipe = Recipes.get({
        recipeId: $stateParams.recipeId
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

    // Cancel the upload process
    $scope.cancelUpload = function () {
      $scope.uploader.clearQueue();
      $scope.imageURL = $scope.recipe.recipeImgURL;
    };
  }
]);
