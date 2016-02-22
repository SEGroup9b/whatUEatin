'use strict';

// Recipess controller
angular.module('recipess').controller('RecipessController', ['$scope', '$stateParams', '$location', 'Authentication', 'Recipess',
  function ($scope, $stateParams, $location, Authentication, Recipess) {
    $scope.authentication = Authentication;

    // Create new Recipes
    $scope.create = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'recipesForm');

        return false;
      }

      // Create new Recipes object
      var recipes = new Recipess({
        title: this.title,
        content: this.content
      });

      // Redirect after save
      recipes.$save(function (response) {
        $location.path('recipess/' + response._id);

        // Clear form fields
        $scope.title = '';
        $scope.content = '';
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Remove existing Recipes
    $scope.remove = function (recipes) {
      if (recipes) {
        recipes.$remove();

        for (var i in $scope.recipess) {
          if ($scope.recipess[i] === recipes) {
            $scope.recipess.splice(i, 1);
          }
        }
      } else {
        $scope.recipes.$remove(function () {
          $location.path('recipess');
        });
      }
    };

    // Update existing Recipes
    $scope.update = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'recipesForm');

        return false;
      }

      var recipes = $scope.recipes;

      recipes.$update(function () {
        $location.path('recipess/' + recipes._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find a list of Recipess
    $scope.find = function () {
      $scope.recipess = Recipess.query();
    };

    // Find existing Recipes
    $scope.findOne = function () {
      $scope.recipes = Recipess.get({
        recipesId: $stateParams.recipesId
      });
    };
  }
]);
