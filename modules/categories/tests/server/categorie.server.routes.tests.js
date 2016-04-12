'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Categorie = mongoose.model('Categorie'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, categorie;

/**
 * Categorie routes tests
 */
describe('Categorie CRUD tests', function () {

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

    // Save a user to the test db and create new categorie
    user.save(function () {
      categorie = {
        title: 'Categorie Title',
        content: 'Categorie Content'
      };

      done();
    });
  });

  it('should be able to save an categorie if logged in', function (done) {
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

        // Save a new categorie
        agent.post('/api/categories')
          .send(categorie)
          .expect(200)
          .end(function (categorieSaveErr, categorieSaveRes) {
            // Handle categorie save error
            if (categorieSaveErr) {
              return done(categorieSaveErr);
            }

            // Get a list of categories
            agent.get('/api/categories')
              .end(function (categoriesGetErr, categoriesGetRes) {
                // Handle categorie save error
                if (categoriesGetErr) {
                  return done(categoriesGetErr);
                }

                // Get categories list
                var categories = categoriesGetRes.body;

                // Set assertions
                (categories[0].user._id).should.equal(userId);
                (categories[0].title).should.match('Categorie Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an categorie if not logged in', function (done) {
    agent.post('/api/categories')
      .send(categorie)
      .expect(403)
      .end(function (categorieSaveErr, categorieSaveRes) {
        // Call the assertion callback
        done(categorieSaveErr);
      });
  });

  it('should not be able to save an categorie if no title is provided', function (done) {
    // Invalidate title field
    categorie.title = '';

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

        // Save a new categorie
        agent.post('/api/categories')
          .send(categorie)
          .expect(400)
          .end(function (categorieSaveErr, categorieSaveRes) {
            // Set message assertion
            (categorieSaveRes.body.message).should.match('Title cannot be blank');

            // Handle categorie save error
            done(categorieSaveErr);
          });
      });
  });

  it('should be able to update an categorie if signed in', function (done) {
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

        // Save a new categorie
        agent.post('/api/categories')
          .send(categorie)
          .expect(200)
          .end(function (categorieSaveErr, categorieSaveRes) {
            // Handle categorie save error
            if (categorieSaveErr) {
              return done(categorieSaveErr);
            }

            // Update categorie title
            categorie.title = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing categorie
            agent.put('/api/categories/' + categorieSaveRes.body._id)
              .send(categorie)
              .expect(200)
              .end(function (categorieUpdateErr, categorieUpdateRes) {
                // Handle categorie update error
                if (categorieUpdateErr) {
                  return done(categorieUpdateErr);
                }

                // Set assertions
                (categorieUpdateRes.body._id).should.equal(categorieSaveRes.body._id);
                (categorieUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of categories if not signed in', function (done) {
    // Create new categorie model instance
    var categorieObj = new Categorie(categorie);

    // Save the categorie
    categorieObj.save(function () {
      // Request categories
      request(app).get('/api/categories')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single categorie if not signed in', function (done) {
    // Create new categorie model instance
    var categorieObj = new Categorie(categorie);

    // Save the categorie
    categorieObj.save(function () {
      request(app).get('/api/categories/' + categorieObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', categorie.title);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single categorie with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/categories/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Categorie is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single categorie which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent categorie
    request(app).get('/api/categories/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No categorie with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an categorie if signed in', function (done) {
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

        // Save a new categorie
        agent.post('/api/categories')
          .send(categorie)
          .expect(200)
          .end(function (categorieSaveErr, categorieSaveRes) {
            // Handle categorie save error
            if (categorieSaveErr) {
              return done(categorieSaveErr);
            }

            // Delete an existing categorie
            agent.delete('/api/categories/' + categorieSaveRes.body._id)
              .send(categorie)
              .expect(200)
              .end(function (categorieDeleteErr, categorieDeleteRes) {
                // Handle categorie error error
                if (categorieDeleteErr) {
                  return done(categorieDeleteErr);
                }

                // Set assertions
                (categorieDeleteRes.body._id).should.equal(categorieSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an categorie if not signed in', function (done) {
    // Set categorie user
    categorie.user = user;

    // Create new categorie model instance
    var categorieObj = new Categorie(categorie);

    // Save the categorie
    categorieObj.save(function () {
      // Try deleting categorie
      request(app).delete('/api/categories/' + categorieObj._id)
        .expect(403)
        .end(function (categorieDeleteErr, categorieDeleteRes) {
          // Set message assertion
          (categorieDeleteRes.body.message).should.match('User is not authorized');

          // Handle categorie error error
          done(categorieDeleteErr);
        });

    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Categorie.remove().exec(done);
    });
  });
});
