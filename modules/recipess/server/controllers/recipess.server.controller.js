'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Recipes = mongoose.model('Recipes'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a recipes
 */
exports.create = function (req, res) {
  var recipes = new Recipes(req.body);
  recipes.user = req.user;

  recipes.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(recipes);
    }
  });
};

/**
 * Show the current recipes
 */
exports.read = function (req, res) {
  res.json(req.recipes);
};

/**
 * Update a recipes
 */
exports.update = function (req, res) {
  var recipes = req.recipes;

  recipes.title = req.body.title;
  recipes.content = req.body.content;

  recipes.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(recipes);
    }
  });
};

/**
 * Delete an recipes
 */
exports.delete = function (req, res) {
  var recipes = req.recipes;

  recipes.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(recipes);
    }
  });
};

/**
 * List of Recipess
 */
exports.list = function (req, res) {
  Recipes.find().sort('-created').populate('user', 'displayName').exec(function (err, recipess) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(recipess);
    }
  });
};

/**
 * Recipes middleware
 */
exports.recipesByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Recipes is invalid'
    });
  }

  Recipes.findById(id).populate('user', 'displayName').exec(function (err, recipes) {
    if (err) {
      return next(err);
    } else if (!recipes) {
      return res.status(404).send({
        message: 'No recipes with that identifier has been found'
      });
    }
    req.recipes = recipes;
    next();
  });
};
