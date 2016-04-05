'use strict';

angular.module('core').controller('CategoriesController', ['$scope', '$stateParams', 'Authentication', 'Recipes',
  function ($scope, $stateParams, Authentication, Recipes) {
    // This provides Authentication context.
    $scope.authentication = Authentication;
    $scope.filter = '';
    //Adjusts the current filter
    $scope.adjustFilter = function(newTag) {
      $scope.filter = newTag.tag;
      console.log('Adjusting tag to ' + newTag.tag);
    };
    //Call this method to obtain the list of recipes fitting the filter
    $scope.contains = function(index) {
      var filteredRecipes = [];
      for (var i = Recipes.length - 1; i >= 0; i--) {
        if (!Recipes[i].tags.allergies.contains($scope.categories[index].tag) && !Recipes[i].tags.health_concerns.contains($scope.categories[index].tag)) {
          filteredRecipes.push(Recipes[i]);
        }
      }
      return filteredRecipes;
    };
    //All categories supported
    $scope.categories = [
    	{ name: 'All', tag: '' },
      { name: 'Gluten Free', tag: 'gluten' },
      { name: 'Lactose Free', tag: 'lactose' },
      { name: 'Low Carb', tag: 'carb' },
      { name: 'Low Fat', tag: 'fat' }
    ];

    // Find a list of recipes
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
