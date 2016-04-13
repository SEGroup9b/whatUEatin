'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  //User = mongoose.model('User'),
  //Recipe = mongoose.model('Recipe'),
  config = require('C:/Users/hammackb/Documents/GitHub/whatUEatin/config/env/local.js'),
  User = require('C:/Users/hammackb/Documents/GitHub/whatUEatin/modules/users/server/models/user.server.model'),
  Recipe = require('C:/Users/hammackb/Documents/GitHub/whatUEatin/modules/recipes/server/models/recipes.server.model'),
  Leaderboard = require('C:/Users/hammackb/Documents/GitHub/whatUEatin/modules/leaderboards/server/models/leaderboard.server.model.js'),
  express = require(path.resolve('./config/lib/express'));
  //express = require('C:/Users/hammackb/Documents/GitHub/whatUEatin/config/lib/express.js');
  
  
/**
 * Globals
 */
var app, agent, credentials, user, recipe;

/**
 * Recipe routes tests
 */
describe('Recipe CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);
    mongoose.connect(config.db.uri);

    done();
  });

  beforeEach(function (done) {
    this.timeout(5000);
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new recipe
    user.save(function () {
      recipe = {
        title: 'rtitle',
        instructions: 'instructions',
        servings: 'servings',
        cooktime: 'cooktime',
        votes: 0,
        tags: { allergies: { nuts: false, eggs: false, fish: false, dairy: false, wheat: false, soy: false }, health_concerns: [''] },
        orig_ing: [{ item: 'butter', quantity: 5, unit: 'tbsp', food_item: { name: 'Butter, Salted', ndbno: '01001', group: '', manu: '', nutrients: [{ }] } } ],
        user: user
      };

      done();
    });
  });

  it('should be able to save an recipe if logged in', function (done) {
    this.timeout(10000);
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new recipe
        agent.post('/api/recipes')
          .send(recipe)
          .expect(200)
          .end(function (recipeSaveErr, recipeSaveRes) {
            // Handle recipe save error
            if (recipeSaveErr) {
              return done(recipeSaveErr);
            }

            // Get a list of recipes
            agent.get('/api/recipes')
              .end(function (recipesGetErr, recipesGetRes) {
                // Handle recipe save error
                if (recipesGetErr) {
                  return done(recipesGetErr);
                }

                // Get recipes list
                var recipes = recipesGetRes.body;

                // Set assertions
                console.log(recipes[0]);
                
                (recipes[0].user._id).should.equal(userId);
                (recipes[0].title).should.match('rtitle');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an recipe if not logged in', function (done) {
    this.timeout(10000);
    agent.post('/api/recipes')
      .send(recipe)
      .expect(403)
      .end(function (recipeSaveErr, recipeSaveRes) {
        // Call the assertion callback
        done(recipeSaveErr);
      });
  });

  it('should not be able to save an recipe if no title is provided', function (done) {
    this.timeout(5000);
    // Invalidate title field
    recipe.title = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new recipe
        agent.post('/api/recipes')
          .send(recipe)
          .expect(400)
          .end(function (recipeSaveErr, recipeSaveRes) {
            // Set message assertion
            (recipeSaveRes.body.message).should.match('Path /`title/` is required.');

            // Handle recipe save error
            done(recipeSaveErr);
          });
      });
  });

  it('should be able to update an recipe if signed in', function (done) {
    this.timeout(5000);
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new recipe
        agent.post('/api/recipes')
          .send(recipe)
          .expect(200)
          .end(function (recipeSaveErr, recipeSaveRes) {
            // Handle recipe save error
            if (recipeSaveErr) {
              return done(recipeSaveErr);
            }

            // Update recipe title
            recipe.title = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing recipe
            agent.put('/api/recipes/' + recipeSaveRes.body._id)
              .send(recipe)
              .expect(200)
              .end(function (recipeUpdateErr, recipeUpdateRes) {
                // Handle recipe update error
                if (recipeUpdateErr) {
                  return done(recipeUpdateErr);
                }

                // Set assertions
                (recipeUpdateRes.body._id).should.equal(recipeSaveRes.body._id);
                (recipeUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of recipes if not signed in', function (done) {
    this.timeout(5000);
    // Create new recipe model instance
    var recipeObj = new Recipe(recipe);

    // Save the recipe
    recipeObj.save(function () {
      // Request recipes
      request(app).get('/api/recipes')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single recipe if not signed in', function (done) {
    this.timeout(5000);
    // Create new recipe model instance
    var recipeObj = new Recipe(recipe);

    // Save the recipe
    recipeObj.save(function () {
      request(app).get('/api/recipes/' + recipeObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', recipe.title);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single recipe with an invalid Id, if not signed in', function (done) {
    this.timeout(5000);
    // test is not a valid mongoose Id
    request(app).get('/api/recipes/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Recipe is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single recipe which doesnt exist, if not signed in', function (done) {
    this.timeout(5000);
    // This is a valid mongoose Id but a non-existent recipe
    request(app).get('/api/recipes/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No recipe with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an recipe if signed in', function (done) {
    this.timeout(5000);
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new recipe
        agent.post('/api/recipes')
          .send(recipe)
          .expect(200)
          .end(function (recipeSaveErr, recipeSaveRes) {
            // Handle recipe save error
            if (recipeSaveErr) {
              return done(recipeSaveErr);
            }

            // Delete an existing recipe
            agent.delete('/api/recipes/' + recipeSaveRes.body._id)
              .send(recipe)
              .expect(200)
              .end(function (recipeDeleteErr, recipeDeleteRes) {
                // Handle recipe error error
                if (recipeDeleteErr) {
                  return done(recipeDeleteErr);
                }

                // Set assertions
                (recipeDeleteRes.body._id).should.equal(recipeSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an recipe if not signed in', function (done) {
    this.timeout(5000);
    // Set recipe user
    recipe.user = user;

    // Create new recipe model instance
    var recipeObj = new Recipe(recipe);

    // Save the recipe
    recipeObj.save(function () {
      // Try deleting recipe
      request(app).delete('/api/recipes/' + recipeObj._id)
        .expect(403)
        .end(function (recipeDeleteErr, recipeDeleteRes) {
          // Set message assertion
          (recipeDeleteRes.body.message).should.match('User is not authorized');

          // Handle recipe error error
          done(recipeDeleteErr);
        });

    });
  });

  afterEach(function (done) {
    this.timeout(5000);
    User.remove().exec(function () {
      Recipe.remove().exec(done);
    });
  });
});
