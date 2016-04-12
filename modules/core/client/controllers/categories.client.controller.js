'use strict';

angular.module('core').controller('CategoriesController', ['$scope', '$stateParams', 'Authentication', 'Recipes',
  function ($scope, $stateParams, Authentication, Recipes) {
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
    // Find a list of recipes and categories
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
