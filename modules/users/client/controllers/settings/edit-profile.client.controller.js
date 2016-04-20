'use strict';

angular.module('users').controller('EditProfileController', ['$scope', '$http', '$location', 'Users', 'Authentication', 
  function ($scope, $http, $location, Users, Authentication) {
    $scope.user = Authentication.user;

    //add to allergy array
    $scope.addAllergy = function(){
      $scope.user.allergies.push($scope.allergy);
      $scope.allergy = '';
    };
    //renove from allergy array
    $scope.removeAllergy = function(index){
      $scope.user.allergies.splice(index,1);
    };
    // Update a user profile
    $scope.updateUserProfile = function (isValid) {
      $scope.success = $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'userForm');

        return false;
      }

      var user = new Users($scope.user);

      user.$update(function (response) {
        $scope.$broadcast('show-errors-reset', 'userForm');

        $scope.success = true;
        Authentication.user = response;
      }, function (response) {
        $scope.error = response.data.message;
      });
    };
  }
]);
