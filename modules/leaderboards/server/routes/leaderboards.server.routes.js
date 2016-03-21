'use strict';

/**
 * Module dependencies.
 */
var leaderboardsPolicy = require('../policies/leaderboards.server.policy'),
  leaderboards = require('../controllers/leaderboards.server.controller');

module.exports = function (app) {
  // Leaderboards collection routes
  app.route('/api/leaderboards').all(leaderboardsPolicy.isAllowed)
    .get(leaderboards.list)
    .post(leaderboards.create);

  // Single leaderboard routes
  app.route('/api/leaderboards/:leaderboardId').all(leaderboardsPolicy.isAllowed)
    .get(leaderboards.read)
    .put(leaderboards.update)
    .delete(leaderboards.delete);

  // Finish by binding the leaderboard middleware
  app.param('leaderboardId', leaderboards.leaderboardByID);
};
