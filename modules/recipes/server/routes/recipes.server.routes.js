'use strict';

/**
 * Module dependencies.
 */
var recipesPolicy = require('../policies/recipes.server.policy'),
  recipes = require('../controllers/recipes.server.controller');

module.exports = function (app) {
  // Recipes collection routes
  app.route('/api/recipes').all(recipesPolicy.isAllowed)
    .get(recipes.list)
    .post(recipes.create);

  // Single recipe routes
  app.route('/api/recipes/:recipeId').all(recipesPolicy.isAllowed)
    .get(recipes.read)
    .put(recipes.update)
    .delete(recipes.delete);
  app.route('/api/usda/:food').get(recipes.returnFoods);

  app.route('/api/usda/foodReport/:ndbno').get(recipes.returnFoodReport);

  app.route('/api/usda/healthify/:foodObject').get(recipes.returnAlternatives);

  // Finish by binding the recipe middleware
  app.param('recipeId', recipes.recipeByID);
  app.param('food',recipes.getName);
  app.param('ndbno', recipes.getFoodReport);
  app.param('foodObject',recipes.getAlternatives);
};
