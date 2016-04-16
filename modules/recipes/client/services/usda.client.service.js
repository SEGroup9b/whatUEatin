'use strict';

//Recipes service used for communicating with the recipes REST endpoints
angular.module('recipes').factory('Usda', function($http){
  var Usda = {
    food: function(food){
      	var promiseA = $http.get('/api/usda/' + food).then(function(response){
        console.log('promise in service ' + JSON.stringify(response));
        return response.data;
      });
      return promiseA;
    },//Not used for now, forced to used $http.get on client controller skipping this step
    ndbno: function(ndbno){
      var promiseB = $http.get('/api/usda/foodReport/' + ndbno).then(function(response){
        console.log(response);
        return response.data;
      });
      return promiseB;
    }
  };
  return Usda;
});