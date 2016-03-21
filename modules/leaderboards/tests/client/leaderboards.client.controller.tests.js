'use strict';

(function () {
  // Leaderboards Controller Spec
  describe('Leaderboards Controller Tests', function () {
    // Initialize global variables
    var LeaderboardsController,
      scope,
      $httpBackend,
      $stateParams,
      $location,
      Authentication,
      Leaderboards,
      mockLeaderboard;

    // The $resource service augments the response object with methods for updating and deleting the resource.
    // If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
    // the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
    // When the toEqualData matcher compares two objects, it takes only object properties into
    // account and ignores methods.
    beforeEach(function () {
      jasmine.addMatchers({
        toEqualData: function (util, customEqualityTesters) {
          return {
            compare: function (actual, expected) {
              return {
                pass: angular.equals(actual, expected)
              };
            }
          };
        }
      });
    });

    // Then we can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_, _Authentication_, _Leaderboards_) {
      // Set a new global scope
      scope = $rootScope.$new();

      // Point global variables to injected services
      $stateParams = _$stateParams_;
      $httpBackend = _$httpBackend_;
      $location = _$location_;
      Authentication = _Authentication_;
      Leaderboards = _Leaderboards_;

      // create mock leaderboard
      mockLeaderboard = new Leaderboards({
        _id: '525a8422f6d0f87f0e407a33',
        title: 'An Leaderboard about MEAN',
        content: 'MEAN rocks!'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Leaderboards controller.
      LeaderboardsController = $controller('LeaderboardsController', {
        $scope: scope
      });
    }));

    it('$scope.find() should create an array with at least one leaderboard object fetched from XHR', inject(function (Leaderboards) {
      // Create a sample leaderboards array that includes the new leaderboard
      var sampleLeaderboards = [mockLeaderboard];

      // Set GET response
      $httpBackend.expectGET('api/leaderboards').respond(sampleLeaderboards);

      // Run controller functionality
      scope.find();
      $httpBackend.flush();

      // Test scope value
      expect(scope.leaderboards).toEqualData(sampleLeaderboards);
    }));

    it('$scope.findOne() should create an array with one leaderboard object fetched from XHR using a leaderboardId URL parameter', inject(function (Leaderboards) {
      // Set the URL parameter
      $stateParams.leaderboardId = mockLeaderboard._id;

      // Set GET response
      $httpBackend.expectGET(/api\/leaderboards\/([0-9a-fA-F]{24})$/).respond(mockLeaderboard);

      // Run controller functionality
      scope.findOne();
      $httpBackend.flush();

      // Test scope value
      expect(scope.leaderboard).toEqualData(mockLeaderboard);
    }));

    describe('$scope.create()', function () {
      var sampleLeaderboardPostData;

      beforeEach(function () {
        // Create a sample leaderboard object
        sampleLeaderboardPostData = new Leaderboards({
          title: 'An Leaderboard about MEAN',
          content: 'MEAN rocks!'
        });

        // Fixture mock form input values
        scope.title = 'An Leaderboard about MEAN';
        scope.content = 'MEAN rocks!';

        spyOn($location, 'path');
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (Leaderboards) {
        // Set POST response
        $httpBackend.expectPOST('api/leaderboards', sampleLeaderboardPostData).respond(mockLeaderboard);

        // Run controller functionality
        scope.create(true);
        $httpBackend.flush();

        // Test form inputs are reset
        expect(scope.title).toEqual('');
        expect(scope.content).toEqual('');

        // Test URL redirection after the leaderboard was created
        expect($location.path.calls.mostRecent().args[0]).toBe('leaderboards/' + mockLeaderboard._id);
      }));

      it('should set scope.error if save error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/leaderboards', sampleLeaderboardPostData).respond(400, {
          message: errorMessage
        });

        scope.create(true);
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      });
    });

    describe('$scope.update()', function () {
      beforeEach(function () {
        // Mock leaderboard in scope
        scope.leaderboard = mockLeaderboard;
      });

      it('should update a valid leaderboard', inject(function (Leaderboards) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/leaderboards\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        scope.update(true);
        $httpBackend.flush();

        // Test URL location to new object
        expect($location.path()).toBe('/leaderboards/' + mockLeaderboard._id);
      }));

      it('should set scope.error to error response message', inject(function (Leaderboards) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/leaderboards\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        scope.update(true);
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      }));
    });

    describe('$scope.remove(leaderboard)', function () {
      beforeEach(function () {
        // Create new leaderboards array and include the leaderboard
        scope.leaderboards = [mockLeaderboard, {}];

        // Set expected DELETE response
        $httpBackend.expectDELETE(/api\/leaderboards\/([0-9a-fA-F]{24})$/).respond(204);

        // Run controller functionality
        scope.remove(mockLeaderboard);
      });

      it('should send a DELETE request with a valid leaderboardId and remove the leaderboard from the scope', inject(function (Leaderboards) {
        expect(scope.leaderboards.length).toBe(1);
      }));
    });

    describe('scope.remove()', function () {
      beforeEach(function () {
        spyOn($location, 'path');
        scope.leaderboard = mockLeaderboard;

        $httpBackend.expectDELETE(/api\/leaderboards\/([0-9a-fA-F]{24})$/).respond(204);

        scope.remove();
        $httpBackend.flush();
      });

      it('should redirect to leaderboards', function () {
        expect($location.path).toHaveBeenCalledWith('leaderboards');
      });
    });
  });
}());
