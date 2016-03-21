'use strict';

angular.module('core').controller('HomeController', ['$scope', 'Authentication', 'Recipes',
  function ($scope, Authentication, Recipes) {
    // This provides Authentication context.
    $scope.authentication = Authentication;

    // Find a list of Recipes
    $scope.find = function () {
      $scope.recipes = Recipes.query();
    };
  }
]);
