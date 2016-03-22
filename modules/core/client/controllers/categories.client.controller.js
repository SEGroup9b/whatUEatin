'use strict';

angular.module('core').controller('CategoriesController', ['$scope', 'Authentication', 'Recipes',
  function ($scope, Authentication, Recipes) {
    // This provides Authentication context.
    $scope.authentication = Authentication;
    $scope.tag = 'gluten';
    $scope.adjustTag = function(newTag) {
      $scope.tag = newTag;
      console.log('Adjusting tag to ' + newTag);
    };
    // Find a list of recipes
    $scope.find = function () {
      $scope.recipes = Recipes.query();
    };

    // Find existing recipes
    $scope.findOne = function () {
      $scope.recipes = Recipes.get({
        recipeId: $stateParams.recipeId
      });
    };
  }
]);
