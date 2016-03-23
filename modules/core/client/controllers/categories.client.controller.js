'use strict';

angular.module('core').controller('CategoriesController', ['$scope', '$stateParams', 'Authentication', 'Recipes',
  function ($scope, $stateParams, Authentication, Recipes) {
    // This provides Authentication context.
    $scope.authentication = Authentication;
    $scope.tag = 'gluten';
    $scope.adjustTag = function(newTag) {
      $scope.tag = newTag;
      console.log('Adjusting tag to ' + newTag);
    };
    $scope.categories = [
      'Gluten Free',
      'Low Carb',
      'Low Fat',
      'Test'
    ];
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
