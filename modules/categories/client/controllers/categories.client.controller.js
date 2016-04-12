'use strict';

angular.module('core').controller('CategoriesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Recipes', 'Categories',
  function ($scope, $stateParams, $location, Authentication, Recipes, Categories) {
    // This provides Authentication context.
    $scope.authentication = Authentication;
    //For categories and filtering by category
    $scope.currentCategory = {
      name: 'All',
      tag: 'all'
    };
    $scope.recipes = [];

    //Adjusts the current filter
    $scope.adjustFilter = function(index) {
      $scope.currentCategory = $scope.categories[index];
      console.log('Adjusting tag to ' + $scope.currentCategory.tag);

      if ($scope.currentCategory.tag === 'all') {
        $scope.recipes = $scope.allRecipes;
        return;
      } else {
        for (var i = $scope.recipes.length - 1; i >= 0; i--) {
          if ($scope.allRecipes[i].tags.allergies.indexOf($scope.currentCategory.tag) > -1 || $scope.allRecipes[i].tags.health_concerns.indexOf($scope.currentCategory.tag) > -1){
            $scope.recipes.push($scope.allRecipes[i]);
          }
        }
      }
    };

    // Create new Category
    $scope.create = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'categoryForm');
        return false;
      }

      // Create new Category object
      var category = new Categories({
        name: this.name,
        tag: this.tag
      });

      // Redirect after save
      category.$save(function (response) {
        $location.path('categories');

        // Clear form fields
        $scope.name = '';
        $scope.tag = '';
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Remove existing Category
    $scope.remove = function (category) {
      console.log(category);
      if (category) {
        category.$remove();

        for (var i in $scope.categories) {
          if ($scope.categories[i] === category) {
            $scope.categories.splice(i, 1);
          }
        }
      } else {
        $scope.category.$remove(function () {
          $location.path('');
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
      $scope.recipes = $scope.allRecipes;
    };
  }
]);
