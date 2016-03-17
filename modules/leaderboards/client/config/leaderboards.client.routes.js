'use strict';

// Setting up route
angular.module('leaderboards').config(['$stateProvider',
  function ($stateProvider) {
    // Leaderboards state routing
    $stateProvider
      .state('leaderboards', {
        abstract: true,
        url: '/leaderboards',
        template: '<ui-view/>'
      })
      .state('leaderboards.list', {
        url: '',
        templateUrl: 'modules/leaderboards/client/views/list-leaderboards.client.view.html'
      })
      .state('leaderboards.create', {
        url: '/create',
        templateUrl: 'modules/leaderboards/client/views/create-leaderboard.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('leaderboards.view', {
        url: '/:leaderboardId',
        templateUrl: 'modules/leaderboards/client/views/view-leaderboard.client.view.html'
      })
      .state('leaderboards.edit', {
        url: '/:leaderboardId/edit',
        templateUrl: 'modules/leaderboards/client/views/edit-leaderboard.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      });
  }
]);
