'use strict';

angular.module('core').controller('CategoriesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Recipes', 'Categories',
  function ($scope, $stateParams, $location, Authentication, Recipes, Categories) {
    // This provides Authentication context.
    $scope.authentication = Authentication;
    //For categories and filtering by category
    $scope.filter = '';
    $scope.categories = [];

    //Adjusts the current filter
    $scope.adjustFilter = function(index) {
      console.log($scope.categories[index]);
      $scope.filter = $scope.categories[index];
      $scope.find();
      console.log('Adjusting tag to ' + $scope.filter.tag);

      if ($scope.filter.tag === '') {
        return;
      } else {
        var filteredRecipes = [];
        for (var i = $scope.recipes.length - 1; i >= 0; i--) {
          if ($scope.recipes[i].tags.allergies.indexOf($scope.filter.tag) > -1 && $scope.recipes[i].tags.health_concerns.indexOf($scope.filter.tag) > -1){
            filteredRecipes.push($scope.recipes[i]);
          }
        }
        $scope.recipes = filteredRecipes;
      }
    };
//     // Find a list of recipes and categories
//     $scope.find = function () {
//       $scope.recipes = Recipes.query();
//     };
//     // Find existing recipes
//     $scope.findOne = function () {
//       $scope.recipes = Recipes.get({
//         recipeId: $stateParams.recipeId
//       });
//     };
//   }
// ]);

    // Create new Category
    $scope.create = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'categorieForm');

        return false;
      }

      // Create new Category object
      var category = new Categories({
        title: this.title,
        content: this.content
      });

      // Redirect after save
      category.$save(function (response) {
        $location.path('categories/' + response._id);

        // Clear form fields
        $scope.title = '';
        $scope.content = '';
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
        $location.path('categories/' + category._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find a list of Categories
    $scope.find = function () {
      $scope.categories = Categories.query();
      $scope.recipes = Recipes.query();
    };

    // Find existing Category
    $scope.findOne = function () {
      $scope.category = Categories.get({
        categoryId: $stateParams.categoryId
      });
    };

    $scope.recipes = Recipes.get({
      recipeId: $stateParams.recipeId
    });
  }
]);
