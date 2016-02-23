'use strict';

//Recipess service used for communicating with the recipess REST endpoints
angular.module('recipess').factory('Recipess', ['$resource',
  function ($resource) {
    return $resource('api/recipess/:recipesId', {
      recipesId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);
