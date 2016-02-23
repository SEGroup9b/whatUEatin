'use strict';

/**
 * Module dependencies.
 */
var recipessPolicy = require('../policies/recipess.server.policy'),
  recipess = require('../controllers/recipess.server.controller');

module.exports = function (app) {
  // Recipess collection routes
  app.route('/api/recipess').all(recipessPolicy.isAllowed)
    .get(recipess.list)
    .post(recipess.create);

  // Single recipes routes
  app.route('/api/recipess/:recipesId').all(recipessPolicy.isAllowed)
    .get(recipess.read)
    .put(recipess.update)
    .delete(recipess.delete);

  // Finish by binding the recipes middleware
  app.param('recipesId', recipess.recipesByID);
};
