'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Recipes = mongoose.model('Recipes'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, recipes;

/**
 * Recipes routes tests
 */
describe('Recipes CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
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

    // Save a user to the test db and create new recipes
    user.save(function () {
      recipes = {
        title: 'Recipes Title',
        content: 'Recipes Content'
      };

      done();
    });
  });

  it('should be able to save an recipes if logged in', function (done) {
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

        // Save a new recipes
        agent.post('/api/recipess')
          .send(recipes)
          .expect(200)
          .end(function (recipesSaveErr, recipesSaveRes) {
            // Handle recipes save error
            if (recipesSaveErr) {
              return done(recipesSaveErr);
            }

            // Get a list of recipess
            agent.get('/api/recipess')
              .end(function (recipessGetErr, recipessGetRes) {
                // Handle recipes save error
                if (recipessGetErr) {
                  return done(recipessGetErr);
                }

                // Get recipess list
                var recipess = recipessGetRes.body;

                // Set assertions
                (recipess[0].user._id).should.equal(userId);
                (recipess[0].title).should.match('Recipes Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an recipes if not logged in', function (done) {
    agent.post('/api/recipess')
      .send(recipes)
      .expect(403)
      .end(function (recipesSaveErr, recipesSaveRes) {
        // Call the assertion callback
        done(recipesSaveErr);
      });
  });

  it('should not be able to save an recipes if no title is provided', function (done) {
    // Invalidate title field
    recipes.title = '';

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

        // Save a new recipes
        agent.post('/api/recipess')
          .send(recipes)
          .expect(400)
          .end(function (recipesSaveErr, recipesSaveRes) {
            // Set message assertion
            (recipesSaveRes.body.message).should.match('Title cannot be blank');

            // Handle recipes save error
            done(recipesSaveErr);
          });
      });
  });

  it('should be able to update an recipes if signed in', function (done) {
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

        // Save a new recipes
        agent.post('/api/recipess')
          .send(recipes)
          .expect(200)
          .end(function (recipesSaveErr, recipesSaveRes) {
            // Handle recipes save error
            if (recipesSaveErr) {
              return done(recipesSaveErr);
            }

            // Update recipes title
            recipes.title = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing recipes
            agent.put('/api/recipess/' + recipesSaveRes.body._id)
              .send(recipes)
              .expect(200)
              .end(function (recipesUpdateErr, recipesUpdateRes) {
                // Handle recipes update error
                if (recipesUpdateErr) {
                  return done(recipesUpdateErr);
                }

                // Set assertions
                (recipesUpdateRes.body._id).should.equal(recipesSaveRes.body._id);
                (recipesUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of recipess if not signed in', function (done) {
    // Create new recipes model instance
    var recipesObj = new Recipes(recipes);

    // Save the recipes
    recipesObj.save(function () {
      // Request recipess
      request(app).get('/api/recipess')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single recipes if not signed in', function (done) {
    // Create new recipes model instance
    var recipesObj = new Recipes(recipes);

    // Save the recipes
    recipesObj.save(function () {
      request(app).get('/api/recipess/' + recipesObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', recipes.title);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single recipes with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/recipess/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Recipes is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single recipes which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent recipes
    request(app).get('/api/recipess/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No recipes with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an recipes if signed in', function (done) {
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

        // Save a new recipes
        agent.post('/api/recipess')
          .send(recipes)
          .expect(200)
          .end(function (recipesSaveErr, recipesSaveRes) {
            // Handle recipes save error
            if (recipesSaveErr) {
              return done(recipesSaveErr);
            }

            // Delete an existing recipes
            agent.delete('/api/recipess/' + recipesSaveRes.body._id)
              .send(recipes)
              .expect(200)
              .end(function (recipesDeleteErr, recipesDeleteRes) {
                // Handle recipes error error
                if (recipesDeleteErr) {
                  return done(recipesDeleteErr);
                }

                // Set assertions
                (recipesDeleteRes.body._id).should.equal(recipesSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an recipes if not signed in', function (done) {
    // Set recipes user
    recipes.user = user;

    // Create new recipes model instance
    var recipesObj = new Recipes(recipes);

    // Save the recipes
    recipesObj.save(function () {
      // Try deleting recipes
      request(app).delete('/api/recipess/' + recipesObj._id)
        .expect(403)
        .end(function (recipesDeleteErr, recipesDeleteRes) {
          // Set message assertion
          (recipesDeleteRes.body.message).should.match('User is not authorized');

          // Handle recipes error error
          done(recipesDeleteErr);
        });

    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Recipes.remove().exec(done);
    });
  });
});
