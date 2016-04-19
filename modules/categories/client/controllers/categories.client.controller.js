'use strict';

angular.module('core').controller('CategoriesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Recipes', 'Categories',
  function ($scope, $stateParams, $location, Authentication, Recipes, Categories) {
    // This provides Authentication context.
    $scope.authentication = Authentication;

    //For categories and filtering by category
    $scope.name = 'All';
    $scope.tag = 'all';
    $scope.img_path = 'modules/core/client/img/brand/ccb.png';
    $scope.t_type = 'allergy';
    $scope.recipes = [];
    //$scope.category = {};

    // Create new Category
    $scope.create = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'categoryForm');
        return false;
      }

      // Create new Category object
      var category = new Categories({
        name: $scope.name,
        tag: $scope.tag, 
        img_path: 'modules/core/client/img/brand/' + $scope.img_path,
        t_type: $scope.t_type
      });

      // Redirect after save
      category.$save(function (response) {
        $location.path('categories');

        // Clear form fields
        $scope.name = 'All';
        $scope.tag = 'all';
        $scope.img_path = 'modules/core/client/img/brand/ccb.png';
        $scope.t_type = 'allergy';
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Remove existing Category
    $scope.remove = function (category) {
      if (category) {
        category.$remove();

        for (var i in $scope.categories) {
          if ($scope.categories[i] === category) {
            $scope.categories.splice(i, 1);
          }
        }
      } else {
        $scope.category.$remove(function () {
          $location.path('categories');
        });
      }
    };

    // Update existing Category
    $scope.update = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'categoryForm');
        return false;
      }

      var category = $scope.category;

      category.$update(function () {
        $location.path('categories');
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find a list of Categories
    $scope.find = function () {
      $scope.categories = Categories.query();
    };

    // Find existing Category
    $scope.findOne = function () {
      $scope.category = Categories.get({
        categoryId: $stateParams.categoryId
      });
    };

    $scope.findRecipes = function() {
      $scope.allRecipes = Recipes.query();
      $scope.recipes = [];
      $scope.category.$promise.then(function() {
        $scope.allRecipes.$promise.then(function() {
          if ($scope.category.tag === 'all') {
            $scope.recipes = $scope.allRecipes;
            console.log('All tag');
          } else {
            var current;
            for (var i = $scope.allRecipes.length - 1; i >= 0; i--) {
              current = $scope.allRecipes[i];
              //if allergy type, check for allergies
              if ($scope.category.t_type === 'allergy') {
                //if it contains an allergy, skip it
                if (current.tags.allergies.indexOf($scope.category.tag) > -1) {
                  console.log(current.title + ' contains ' + $scope.category.tag);
                  continue;
                } else $scope.recipes.push(current);
              } else if ($scope.category.t_type === 'health'){
                if (current.tags.health_concerns.indexOf($scope.category.tag === -1)) {
                  console.log(current.title + ' is not ' + $scope.category.name);
                  continue;
                } else $scope.recipes.push(current);
              } else {
                $scope.recipes.push(current);
              }
            }
          }
        });
      });    
    };
  }
]);
