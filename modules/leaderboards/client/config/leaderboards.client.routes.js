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
      .state('leaderboards.view', {
        url: '/:leaderboardId',
        templateUrl: 'modules/leaderboards/client/views/view-leaderboard.client.view.html'
      });
  }
]);
