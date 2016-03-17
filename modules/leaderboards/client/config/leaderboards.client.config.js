'use strict';

// Configuring the Leaderboards module
angular.module('leaderboards').run(['Menus',
  function (Menus) {
    // Add the leaderboards dropdown item
    Menus.addMenuItem('topbar', {
      title: 'Leaderboards',
      state: 'leaderboards',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'leaderboards', {
      title: 'List Leaderboards',
      state: 'leaderboards.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'leaderboards', {
      title: 'Create Leaderboards',
      state: 'leaderboards.create',
      roles: ['user']
    });
  }
]);
