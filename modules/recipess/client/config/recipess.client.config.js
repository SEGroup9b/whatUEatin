'use strict';

// Configuring the Recipess module
angular.module('recipess').run(['Menus',
  function (Menus) {
    // Add the recipess dropdown item
    Menus.addMenuItem('topbar', {
      title: 'Recipess',
      state: 'recipess',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'recipess', {
      title: 'List Recipess',
      state: 'recipess.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'recipess', {
      title: 'Create Recipess',
      state: 'recipess.create',
      roles: ['user']
    });
  }
]);
