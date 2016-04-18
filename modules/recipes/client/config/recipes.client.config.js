'use strict';

// Configuring the Recipes module
angular.module('recipes').run(['Menus',
  function (Menus) {
    // Add the recipes dropdown item
    Menus.addMenuItem('topbar', {
      title: 'Recipes',
      state: 'recipes',
      type: 'dropdown',
      roles: ['*']
    });
    //Add my recipes list item
    Menus.addSubMenuItem('topbar', 'recipes', {
      title: 'My Recipes',
      state: 'recipes.mine'
    });
    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'recipes', {
      title: 'All Recipes',
      state: 'recipes.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'recipes', {
      title: 'Create Recipe',
      state: 'recipes.create',
      roles: ['user']
    });
  }
]);
