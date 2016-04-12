'use strict';

<<<<<<< Updated upstream
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
=======
angular.module('core').controller('CategoriesController', ['$scope', '$stateParams', 'Authentication', 'Recipes', 'Categories',
  function ($scope, $stateParams, Authentication, Recipes, Categories) {
    // This provides Authentication context.
    $scope.authentication = Authentication;
    //For categories and filtering by category
    $scope.filter = '';
    $scope.categories = [];

    $scope.initializeCategories = function() {
      $scope.categories = [
      { name: 'All', tag: '' },
      { name: 'Gluten Free', tag: 'gluten' },
      { name: 'Lactose Free', tag: 'lactose' },
      { name: 'Low Carb', tag: 'carb' },
      { name: 'Low Fat', tag: 'fat' }];
    }
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


    // Create new Categorie
>>>>>>> Stashed changes
    $scope.create = function (isValid) {
      $scope.error = null;

      if (!isValid) {
<<<<<<< Updated upstream
        $scope.$broadcast('show-errors-check-validity', 'categoryForm');
=======
        $scope.$broadcast('show-errors-check-validity', 'categorieForm');
>>>>>>> Stashed changes

        return false;
      }

<<<<<<< Updated upstream
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
=======
      // Create new Categorie object
      var categorie = new Categories({
        title: this.title,
        content: this.content
      });

      // Redirect after save
      categorie.$save(function (response) {
        $location.path('categories/' + response._id);

        // Clear form fields
        $scope.title = '';
        $scope.content = '';
>>>>>>> Stashed changes
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

<<<<<<< Updated upstream
    // Remove existing Category
    $scope.remove = function (category) {
      console.log(category);
      if (category) {
        category.$remove();

        for (var i in $scope.categories) {
          if ($scope.categories[i] === category) {
=======
    // Remove existing Categorie
    $scope.remove = function (categorie) {
      if (categorie) {
        categorie.$remove();

        for (var i in $scope.categories) {
          if ($scope.categories[i] === categorie) {
>>>>>>> Stashed changes
            $scope.categories.splice(i, 1);
          }
        }
      } else {
<<<<<<< Updated upstream
        $scope.category.$remove(function () {
          $location.path('');
=======
        $scope.categorie.$remove(function () {
          $location.path('categories');
>>>>>>> Stashed changes
        });
      }
    };

<<<<<<< Updated upstream
    // Update existing Category
=======
    // Update existing Categorie
>>>>>>> Stashed changes
    $scope.update = function (isValid) {
      $scope.error = null;

      if (!isValid) {
<<<<<<< Updated upstream
        $scope.$broadcast('show-errors-check-validity', 'categoryForm');
=======
        $scope.$broadcast('show-errors-check-validity', 'categorieForm');
>>>>>>> Stashed changes

        return false;
      }

<<<<<<< Updated upstream
      var category = $scope.category;

      category.$update(function () {
        $location.path('categories');
=======
      var categorie = $scope.categorie;

      categorie.$update(function () {
        $location.path('categories/' + categorie._id);
>>>>>>> Stashed changes
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find a list of Categories
    $scope.find = function () {
      $scope.categories = Categories.query();
    };

<<<<<<< Updated upstream
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
=======
    // Find existing Categorie
    $scope.findOne = function () {
      $scope.categorie = Categories.get({
        categorieId: $stateParams.categorieId
      });
    };
>>>>>>> Stashed changes
  }
]);
