'use strict';

//Categories service used for communicating with the categories REST endpoints
angular.module('categories').factory('Categories', ['$resource',
  function ($resource) {
<<<<<<< Updated upstream
    return $resource('api/categories/:categoryId', {
      categoryId: '@_id'
=======
    return $resource('api/categories/:categorieId', {
      categorieId: '@_id'
>>>>>>> Stashed changes
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);
