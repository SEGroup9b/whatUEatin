'use strict';

/**
 * Module dependencies.
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Categories Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/categories',
      permissions: '*'
    }, {
<<<<<<< Updated upstream
      resources: '/api/categories/:categoryId',
=======
      resources: '/api/categories/:categorieId',
>>>>>>> Stashed changes
      permissions: '*'
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/categories',
      permissions: ['get', 'post']
    }, {
<<<<<<< Updated upstream
      resources: '/api/categories/:categoryId',
=======
      resources: '/api/categories/:categorieId',
>>>>>>> Stashed changes
      permissions: ['get']
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/categories',
      permissions: ['get']
    }, {
<<<<<<< Updated upstream
      resources: '/api/categories/:categoryId',
=======
      resources: '/api/categories/:categorieId',
>>>>>>> Stashed changes
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If Categories Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

<<<<<<< Updated upstream
  // If an category is being processed and the current user created it then allow any manipulation
  if (req.category && req.user && req.category.user.id === req.user.id) {
=======
  // If an categorie is being processed and the current user created it then allow any manipulation
  if (req.categorie && req.user && req.categorie.user.id === req.user.id) {
>>>>>>> Stashed changes
    return next();
  }

  // Check for user roles
  acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), function (err, isAllowed) {
    if (err) {
      // An authorization error occurred.
      return res.status(500).send('Unexpected authorization error');
    } else {
      if (isAllowed) {
        // Access granted! Invoke next middleware
        return next();
      } else {
        return res.status(403).json({
          message: 'User is not authorized'
        });
      }
    }
  });
};
