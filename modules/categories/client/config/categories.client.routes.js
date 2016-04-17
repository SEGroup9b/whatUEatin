'use strict';

// Setting up route
angular.module('categories').config(['$stateProvider',
  function ($stateProvider) {
    // Categories state routing
    $stateProvider
      .state('categories', {
        abstract: true,
        url: '/categories',
        template: '<ui-view/>'
      })
      .state('categories.list', {
        url: '',
        templateUrl: 'modules/categories/client/views/list-categories.client.view.html'
      })
      .state('categories.create', {
        url: '/create',
        templateUrl: 'modules/categories/client/views/create-categorie.client.view.html',
        data: {
          roles: ['admin', 'user']
        }
      })
      .state('categories.view', {
        url: '/:categoryId',
        templateUrl: 'modules/categories/client/views/view-categorie.client.view.html',
        data: {
          roles: ['admin', 'user']
        }
      })
      .state('categories.edit', {
        url: '/:categoryId/edit',
        templateUrl: 'modules/categories/client/views/edit-categorie.client.view.html',
        data: {
          roles: ['admin', 'user']
        }
      });
  }
]);
