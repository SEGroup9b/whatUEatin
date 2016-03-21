'use strict';

// Recipes controller
angular.module('recipes').controller('RecipesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Recipes',
  function ($scope, $stateParams, $location, Authentication, Recipes) {
    $scope.authentication = Authentication;
    $scope.original_ingredients = [];
    $scope.ingredients = {
      quantity: null,
      unit: 'tbsp',
      item: ''
    };

    $scope.addIngredientLine = function () {
      //maybe check if previous ingredient filled out
      console.log($scope.ingredients.item,$scope.ingredients.unit,$scope.ingredients.quantity);
      $scope.original_ingredients.push($scope.ingredients);
      $scope.ingredients={};
      
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
        original_ingredients: [{}],//fill in array here
        directions: this.directions,
        servings: this.servings,
        cook_time: this.cook_time
      });
      console.log($scope.original_ingredients);
      console.log(recipe);
      for(var i=0;i <$scope.original_ingredients.length;i++){
      /*  
      var ingredient = {
          quantity: $scope.original_ingredients[i].quantity,
          unit: $scope.original_ingredients[i].unit,
          item: $scope.original_ingredients[i].item
        };*/
        //console.log(ingredient);
        recipe.original_ingredients.push($scope.original_ingredients[i]);
        console.log(recipe);
      }
      

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
  }
]);
