'use strict';

/**
 * Module dependencies.
 */

var should = require('should'),
  mongoose = require('mongoose'),
  path = require('path'),
  config = require('C:/Users/hammackb/Documents/GitHub/whatUEatin/config/env/local.js'),
  User = require('C:/Users/hammackb/Documents/GitHub/whatUEatin/modules/users/server/models/user.server.model'),
  Recipe = require('C:/Users/hammackb/Documents/GitHub/whatUEatin/modules/recipes/server/models/recipes.server.model');
  // Had to modify User schema (not the part stored in the db, but the module.exports at the end of the file).
  
  
/**
 * Globals
 */
var user, recipe;

/**
 * Unit tests
 */
describe('Recipe Model Unit Tests:', function () {

  before(function(done) {
    mongoose.connect(config.db.uri);
    done();
  });



  beforeEach(function (done) {
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    });

    user.save(function () {
      recipe = new Recipe({
        title: 'title',
        instructions: 'instructions',
        servings: 'servings',
        cooktime: 'cooktime',
        votes: 0,
        tags: { allergies: { nuts: false, eggs: false, fish: false, dairy: false, wheat: false, soy: false }, health_concerns: [''] },
        orig_ing: [{ item: 'butter', quantity: 5, unit: 'tbsp', food_item: { name: 'Butter, Salted', ndbno: '01001', group: '', manu: '', nutrients: [{ }] } } ],
        user: user
      });

      done();
    });
  });

  describe('Method Save', function () {
    it('should be able to save without problems', function (done) {
      this.timeout(10000);
      return recipe.save(function (err) {
        should.not.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without title', function (done) {
      recipe.title = '';

      return recipe.save(function (err) {
        should.exist(err);
        done();
      });
    });
  });

  afterEach(function (done) {
    Recipe.remove().exec(function () {
      User.remove().exec(done);
    });
  });
});
