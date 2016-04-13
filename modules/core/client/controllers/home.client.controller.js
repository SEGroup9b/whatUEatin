'use strict';

angular.module('core').controller('HomeController', ['$scope', 'Authentication', 'Recipes', 'Categories',
  function ($scope, Authentication, Recipes, Categories) {
    // This provides Authentication context.
    $scope.authentication = Authentication;
    $scope.detailedInfo = undefined;
    $scope.recipes = [];
    $scope.randomRecipe = '';

    // Find a list of Recipes
    $scope.find = function () {
      $scope.recipes = Recipes.query();
    };

    $scope.showDetails = function(index) {
      $scope.detailedInfo = $scope.recipes[index];
    };

    $scope.findCategories = function() {
      $scope.categories = Categories.query();
    };
  }
]);
