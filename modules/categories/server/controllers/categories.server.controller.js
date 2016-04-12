'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
<<<<<<< Updated upstream
  Category = mongoose.model('Category'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a category
 */
exports.create = function (req, res) {
  var category = new Category(req.body);
  category.user = req.user;

  category.save(function (err) {
=======
  Categorie = mongoose.model('Categorie'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a categorie
 */
exports.create = function (req, res) {
  var categorie = new Categorie(req.body);
  categorie.user = req.user;

  categorie.save(function (err) {
>>>>>>> Stashed changes
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
<<<<<<< Updated upstream
      res.json(category);
=======
      res.json(categorie);
>>>>>>> Stashed changes
    }
  });
};

/**
<<<<<<< Updated upstream
 * Show the current category
 */
exports.read = function (req, res) {
  res.json(req.category);
};

/**
 * Update a category
 */
exports.update = function (req, res) {
  var category = req.category;

  category.title = req.body.title;
  category.content = req.body.content;

  category.save(function (err) {
=======
 * Show the current categorie
 */
exports.read = function (req, res) {
  res.json(req.categorie);
};

/**
 * Update a categorie
 */
exports.update = function (req, res) {
  var categorie = req.categorie;

  categorie.title = req.body.title;
  categorie.content = req.body.content;

  categorie.save(function (err) {
>>>>>>> Stashed changes
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
<<<<<<< Updated upstream
      res.json(category);
=======
      res.json(categorie);
>>>>>>> Stashed changes
    }
  });
};

/**
<<<<<<< Updated upstream
 * Delete an category
 */
exports.delete = function (req, res) {
  var category = req.category;

  category.remove(function (err) {
=======
 * Delete an categorie
 */
exports.delete = function (req, res) {
  var categorie = req.categorie;

  categorie.remove(function (err) {
>>>>>>> Stashed changes
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
<<<<<<< Updated upstream
      res.json(category);
=======
      res.json(categorie);
>>>>>>> Stashed changes
    }
  });
};

/**
 * List of Categories
 */
exports.list = function (req, res) {
<<<<<<< Updated upstream
  Category.find().sort('-created').populate('user', 'displayName').exec(function (err, categories) {
=======
  Categorie.find().sort('-created').populate('user', 'displayName').exec(function (err, categories) {
>>>>>>> Stashed changes
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(categories);
    }
  });
};

/**
<<<<<<< Updated upstream
 * Category middleware
 */
exports.categoryByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Category is invalid'
    });
  }

  Category.findById(id).populate('user', 'displayName').exec(function (err, category) {
    if (err) {
      return next(err);
    } else if (!category) {
      return res.status(404).send({
        message: 'No category with that identifier has been found'
      });
    }
    req.category = category;
=======
 * Categorie middleware
 */
exports.categorieByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Categorie is invalid'
    });
  }

  Categorie.findById(id).populate('user', 'displayName').exec(function (err, categorie) {
    if (err) {
      return next(err);
    } else if (!categorie) {
      return res.status(404).send({
        message: 'No categorie with that identifier has been found'
      });
    }
    req.categorie = categorie;
>>>>>>> Stashed changes
    next();
  });
};
