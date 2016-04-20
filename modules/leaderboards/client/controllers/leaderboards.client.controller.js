'use strict';

// Leaderboards controller
angular.module('leaderboards').controller('LeaderboardsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Leaderboards', 'Recipes',
  function ($scope, $stateParams, $location, Authentication, Leaderboards, Recipes) {
    $scope.authentication = Authentication;
    $scope.shouldshow=false;
    /*Legacy module code
    // Create new Leaderboard
    $scope.create = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'leaderboardForm');

        return false;
      }

      // Create new Leaderboard object
      var leaderboard = new Leaderboards({
        title: this.title,
        content: this.content
      });

      // Redirect after save
      leaderboard.$save(function (response) {
        $location.path('leaderboards/' + response._id);

        // Clear form fields
        $scope.title = '';
        $scope.content = '';
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Remove existing Leaderboard
    $scope.remove = function (leaderboard) {
      if (leaderboard) {
        leaderboard.$remove();

        for (var i in $scope.leaderboards) {
          if ($scope.leaderboards[i] === leaderboard) {
            $scope.leaderboards.splice(i, 1);
          }
        }
      } else {
        $scope.leaderboard.$remove(function () {
          $location.path('leaderboards');
        });
      }
    };

    // Update existing Leaderboard
    $scope.update = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'leaderboardForm');

        return false;
      }

      var leaderboard = $scope.leaderboard;

      leaderboard.$update(function () {
        $location.path('leaderboards/' + leaderboard._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };
    */
    $scope.detailedInfo = undefined;

    $scope.showDetails = function(id){
      for(var i in $scope.recipes){
        if($scope.recipes[i]._id === id) {
          $scope.detailedInfo = $scope.recipes[i];
        }
      }
      $scope.shouldshow = true;
    };

    // Find a list of Leaderboards
    $scope.find = function () {
      $scope.recipes = Recipes.query();
    };

    // Find existing Leaderboard
    $scope.findOne = function () {
      $scope.recipes = Recipes.get({
        recipeId: $stateParams.recipeId
      });
    };
  }
]);
