'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Leaderboard = mongoose.model('Leaderboard'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a leaderboard
 */
exports.create = function (req, res) {
  var leaderboard = new Leaderboard(req.body);
  leaderboard.user = req.user;

  leaderboard.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(leaderboard);
    }
  });
};

/**
 * Show the current leaderboard
 */
exports.read = function (req, res) {
  res.json(req.leaderboard);
};

/**
 * Update a leaderboard
 */
exports.update = function (req, res) {
  var leaderboard = req.leaderboard;

  leaderboard.title = req.body.title;
  leaderboard.content = req.body.content;

  leaderboard.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(leaderboard);
    }
  });
};

/**
 * Delete an leaderboard
 */
exports.delete = function (req, res) {
  var leaderboard = req.leaderboard;

  leaderboard.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(leaderboard);
    }
  });
};

/**
 * List of Leaderboards
 */
exports.list = function (req, res) {
  Leaderboard.find().sort('-created').populate('user', 'displayName').exec(function (err, leaderboards) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(leaderboards);
    }
  });
};

/**
 * Leaderboard middleware
 */
exports.leaderboardByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Leaderboard is invalid'
    });
  }

  Leaderboard.findById(id).populate('user', 'displayName').exec(function (err, leaderboard) {
    if (err) {
      return next(err);
    } else if (!leaderboard) {
      return res.status(404).send({
        message: 'No leaderboard with that identifier has been found'
      });
    }
    req.leaderboard = leaderboard;
    next();
  });
};
