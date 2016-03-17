'use strict';

// Recipes controller
angular.module('recipes').controller('PersonalPageController', ['$scope', '$stateParams', '$location', 'Authentication', 'Recipes',
  function ($scope, $stateParams, $location, Authentication, Recipes, Users, $state) {
    $scope.authentication = Authentication;
    $scope.user = Authentication.user;
    $scope.recipeName = '';
    $scope.instructions='';

    // Create new Recipe
    /*$scope.create = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'recipeForm');

        return false;
      }

      // Create new Recipe object
      var recipe = new Recipes({
        title: this.title,
        content: this.content
      });

      // Redirect after save
      recipe.$save(function (response) {
        $location.path('recipes/' + response._id);

        // Clear form fields
        $scope.title = '';
        $scope.content = '';
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
      }*/

    var recipe = $scope.recipe;

      /*recipe.$update(function () {
        $location.path('recipes/' + recipe._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };*/



    $scope.popupinfo = function(recipe){
      console.log(recipe);
      $scope.recipeName = recipe.title;
      $scope.instructions = recipe.original_ingredients;
    };

    // Find a list of Recipes
    $scope.find = function () {
      $scope.recipes = Recipes.query();
    };

    // Find existing Recipe
   /* $scope.findOne = function () {
      $scope.recipe = Recipes.get({
        recipeId: $stateParams.recipeId
      });
    };*/
  }
]);
