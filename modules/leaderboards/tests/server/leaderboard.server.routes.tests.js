'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Leaderboard = mongoose.model('Leaderboard'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, leaderboard;

/**
 * Leaderboard routes tests
 */
describe('Leaderboard CRUD tests', function () {

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

    // Save a user to the test db and create new leaderboard
    user.save(function () {
      leaderboard = {
        title: 'Leaderboard Title',
        content: 'Leaderboard Content'
      };

      done();
    });
  });

  it('should be able to save an leaderboard if logged in', function (done) {
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

        // Save a new leaderboard
        agent.post('/api/leaderboards')
          .send(leaderboard)
          .expect(200)
          .end(function (leaderboardSaveErr, leaderboardSaveRes) {
            // Handle leaderboard save error
            if (leaderboardSaveErr) {
              return done(leaderboardSaveErr);
            }

            // Get a list of leaderboards
            agent.get('/api/leaderboards')
              .end(function (leaderboardsGetErr, leaderboardsGetRes) {
                // Handle leaderboard save error
                if (leaderboardsGetErr) {
                  return done(leaderboardsGetErr);
                }

                // Get leaderboards list
                var leaderboards = leaderboardsGetRes.body;

                // Set assertions
                (leaderboards[0].user._id).should.equal(userId);
                (leaderboards[0].title).should.match('Leaderboard Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an leaderboard if not logged in', function (done) {
    agent.post('/api/leaderboards')
      .send(leaderboard)
      .expect(403)
      .end(function (leaderboardSaveErr, leaderboardSaveRes) {
        // Call the assertion callback
        done(leaderboardSaveErr);
      });
  });

  it('should not be able to save an leaderboard if no title is provided', function (done) {
    // Invalidate title field
    leaderboard.title = '';

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

        // Save a new leaderboard
        agent.post('/api/leaderboards')
          .send(leaderboard)
          .expect(400)
          .end(function (leaderboardSaveErr, leaderboardSaveRes) {
            // Set message assertion
            (leaderboardSaveRes.body.message).should.match('Title cannot be blank');

            // Handle leaderboard save error
            done(leaderboardSaveErr);
          });
      });
  });

  it('should be able to update an leaderboard if signed in', function (done) {
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

        // Save a new leaderboard
        agent.post('/api/leaderboards')
          .send(leaderboard)
          .expect(200)
          .end(function (leaderboardSaveErr, leaderboardSaveRes) {
            // Handle leaderboard save error
            if (leaderboardSaveErr) {
              return done(leaderboardSaveErr);
            }

            // Update leaderboard title
            leaderboard.title = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing leaderboard
            agent.put('/api/leaderboards/' + leaderboardSaveRes.body._id)
              .send(leaderboard)
              .expect(200)
              .end(function (leaderboardUpdateErr, leaderboardUpdateRes) {
                // Handle leaderboard update error
                if (leaderboardUpdateErr) {
                  return done(leaderboardUpdateErr);
                }

                // Set assertions
                (leaderboardUpdateRes.body._id).should.equal(leaderboardSaveRes.body._id);
                (leaderboardUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of leaderboards if not signed in', function (done) {
    // Create new leaderboard model instance
    var leaderboardObj = new Leaderboard(leaderboard);

    // Save the leaderboard
    leaderboardObj.save(function () {
      // Request leaderboards
      request(app).get('/api/leaderboards')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single leaderboard if not signed in', function (done) {
    // Create new leaderboard model instance
    var leaderboardObj = new Leaderboard(leaderboard);

    // Save the leaderboard
    leaderboardObj.save(function () {
      request(app).get('/api/leaderboards/' + leaderboardObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', leaderboard.title);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single leaderboard with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/leaderboards/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Leaderboard is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single leaderboard which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent leaderboard
    request(app).get('/api/leaderboards/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No leaderboard with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an leaderboard if signed in', function (done) {
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

        // Save a new leaderboard
        agent.post('/api/leaderboards')
          .send(leaderboard)
          .expect(200)
          .end(function (leaderboardSaveErr, leaderboardSaveRes) {
            // Handle leaderboard save error
            if (leaderboardSaveErr) {
              return done(leaderboardSaveErr);
            }

            // Delete an existing leaderboard
            agent.delete('/api/leaderboards/' + leaderboardSaveRes.body._id)
              .send(leaderboard)
              .expect(200)
              .end(function (leaderboardDeleteErr, leaderboardDeleteRes) {
                // Handle leaderboard error error
                if (leaderboardDeleteErr) {
                  return done(leaderboardDeleteErr);
                }

                // Set assertions
                (leaderboardDeleteRes.body._id).should.equal(leaderboardSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an leaderboard if not signed in', function (done) {
    // Set leaderboard user
    leaderboard.user = user;

    // Create new leaderboard model instance
    var leaderboardObj = new Leaderboard(leaderboard);

    // Save the leaderboard
    leaderboardObj.save(function () {
      // Try deleting leaderboard
      request(app).delete('/api/leaderboards/' + leaderboardObj._id)
        .expect(403)
        .end(function (leaderboardDeleteErr, leaderboardDeleteRes) {
          // Set message assertion
          (leaderboardDeleteRes.body.message).should.match('User is not authorized');

          // Handle leaderboard error error
          done(leaderboardDeleteErr);
        });

    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Leaderboard.remove().exec(done);
    });
  });
});
