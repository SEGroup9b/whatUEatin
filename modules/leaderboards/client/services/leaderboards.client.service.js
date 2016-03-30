'use strict';

//Leaderboards service used for communicating with the leaderboards REST endpoints
angular.module('leaderboards').factory('Leaderboards', ['$resource',
  function ($resource) {
    return $resource('api/leaderboards/:leaderboardId', {
      leaderboardId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);
