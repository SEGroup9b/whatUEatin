'use strict';

// Recipes controller
angular.module('recipes').controller('RecipesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Recipes',
  function ($scope, $stateParams, $location, Authentication, Recipes) {
    $scope.authentication = Authentication;

    $scope.addIngredient = function (divName) {
      var newDiv = document.createElement('div');
      newDiv.innerHTML = "<div class='col-md-3'><!--quantity--><input name='quantity' ng-model='original_ingredients.quantity' placeholder='#'' class='form-control'></div><div class='col-md-3'><!--unit--><select class='form-control' name='unit'><option>tsp</option><option>tbsp</option><option>cup</option><option>stick</option><option>oz</option><option>grams</option><option>box</option><!--add more options here manually, OR database--></select></div><div class='col-md-6'><!--item--><input name='item' ng-modle='original_ingredients.item' placeholder='ingredient' class='form-control'></div>";
      document.getElementById(divName).appendChild(newDiv);
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
        original_ingredients: [{
          item: this.item,
          quantity: this.quantity,
          unit: this.unit
        }],
        directions: this.directions,
        servings: this.servings,
        cook_time: this.cook_time
      });

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
