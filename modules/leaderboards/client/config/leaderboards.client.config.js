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
      title: 'View Leaderboards',
      state: 'leaderboards.list'
    });

  }
]);
