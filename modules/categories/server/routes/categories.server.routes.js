'use strict';

/**
 * Module dependencies.
 */
var categoriesPolicy = require('../policies/categories.server.policy'),
  categories = require('../controllers/categories.server.controller');

module.exports = function (app) {
  // Categories collection routes
  app.route('/api/categories').all(categoriesPolicy.isAllowed)
    .get(categories.list)
<<<<<<< Updated upstream
    .post(categories.create)
    .delete(categories.delete);

  // Single category routes
  app.route('/api/categories/:categoryId').all(categoriesPolicy.isAllowed)
=======
    .post(categories.create);

  // Single categorie routes
  app.route('/api/categories/:categorieId').all(categoriesPolicy.isAllowed)
>>>>>>> Stashed changes
    .get(categories.read)
    .put(categories.update)
    .delete(categories.delete);

<<<<<<< Updated upstream
  // Finish by binding the category middleware
  app.param('categoryId', categories.categoryByID);
=======
  // Finish by binding the categorie middleware
  app.param('categorieId', categories.categorieByID);
>>>>>>> Stashed changes
};
