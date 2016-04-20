'use strict';

angular.module('core').controller('HomeController', ['$scope', 'Authentication', 'Recipes',
  function ($scope, Authentication, Recipes) {
    // This provides Authentication context.
    $scope.authentication = Authentication;
    $scope.recipes = [];
    $scope.randomRecipe = {};
    $scope.randomRecipeNutrientTotals = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    $scope.filter = 1;

    // Find a list of Recipes
    $scope.find = function () {
      $scope.recipes = Recipes.query();
    };

    $scope.findRandomRecipe = function() {
      $scope.recipes.$promise.then(function() {
        var rand = Math.floor(Math.random() * ($scope.recipes.length + 1));
        while ($scope.recipes[rand].imgURL === null || $scope.recipes[rand].imgURL === undefined || rand > $scope.recipes.length || rand < 0) {
          rand = Math.floor(Math.random() * ($scope.recipes.length + 1));
        }
        $scope.randomRecipe = $scope.recipes[rand];
        
        //TODO: This stuff should not be here, it should be calculated before recipes are uploaded and then saved for
        var recipe = $scope.randomRecipe;
        var nutrients;

        //for each ingredient
        for (var i = 0; i < recipe.orig_ing.length; i++) {
          nutrients = recipe.orig_ing[i].food_item.nutrients;
          for (var j = 0; j < nutrients.length; j++) {
            $scope.randomRecipeNutrientTotals[j] += nutrients[j].value;
          }
        }

        // for (var k = 0; k < 12; k++) {
        //   $scope.randomRecipeNutrientTotals[k] = $scope.randomRecipeNutrientTotals[k].toFixed(2);
        // }
      });
    };
  }
]);
