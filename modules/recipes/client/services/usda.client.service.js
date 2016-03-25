'use strict';

//Recipes service used for communicating with the recipes REST endpoints
angular.module('recipes').service('Usda', ['$resource',
  function ($resource) {
    return $resource('api/usda/:food', {
      
    });
  }
]);