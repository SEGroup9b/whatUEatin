'use strict';

// Setting up route
angular.module('recipess').config(['$stateProvider',
  function ($stateProvider) {
    // Recipess state routing
    $stateProvider
      .state('recipess', {
        abstract: true,
        url: '/recipess',
        template: '<ui-view/>'
      })
      .state('recipess.list', {
        url: '',
        templateUrl: 'modules/recipess/client/views/list-recipess.client.view.html'
      })
      .state('recipess.create', {
        url: '/create',
        templateUrl: 'modules/recipess/client/views/create-recipes.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('recipess.view', {
        url: '/:recipesId',
        templateUrl: 'modules/recipess/client/views/view-recipes.client.view.html'
      })
      .state('recipess.edit', {
        url: '/:recipesId/edit',
        templateUrl: 'modules/recipess/client/views/edit-recipes.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      });
  }
]);
