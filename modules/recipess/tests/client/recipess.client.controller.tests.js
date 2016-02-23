'use strict';

(function () {
  // Recipess Controller Spec
  describe('Recipess Controller Tests', function () {
    // Initialize global variables
    var RecipessController,
      scope,
      $httpBackend,
      $stateParams,
      $location,
      Authentication,
      Recipess,
      mockRecipes;

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
    beforeEach(inject(function ($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_, _Authentication_, _Recipess_) {
      // Set a new global scope
      scope = $rootScope.$new();

      // Point global variables to injected services
      $stateParams = _$stateParams_;
      $httpBackend = _$httpBackend_;
      $location = _$location_;
      Authentication = _Authentication_;
      Recipess = _Recipess_;

      // create mock recipes
      mockRecipes = new Recipess({
        _id: '525a8422f6d0f87f0e407a33',
        title: 'An Recipes about MEAN',
        content: 'MEAN rocks!'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Recipess controller.
      RecipessController = $controller('RecipessController', {
        $scope: scope
      });
    }));

    it('$scope.find() should create an array with at least one recipes object fetched from XHR', inject(function (Recipess) {
      // Create a sample recipess array that includes the new recipes
      var sampleRecipess = [mockRecipes];

      // Set GET response
      $httpBackend.expectGET('api/recipess').respond(sampleRecipess);

      // Run controller functionality
      scope.find();
      $httpBackend.flush();

      // Test scope value
      expect(scope.recipess).toEqualData(sampleRecipess);
    }));

    it('$scope.findOne() should create an array with one recipes object fetched from XHR using a recipesId URL parameter', inject(function (Recipess) {
      // Set the URL parameter
      $stateParams.recipesId = mockRecipes._id;

      // Set GET response
      $httpBackend.expectGET(/api\/recipess\/([0-9a-fA-F]{24})$/).respond(mockRecipes);

      // Run controller functionality
      scope.findOne();
      $httpBackend.flush();

      // Test scope value
      expect(scope.recipes).toEqualData(mockRecipes);
    }));

    describe('$scope.create()', function () {
      var sampleRecipesPostData;

      beforeEach(function () {
        // Create a sample recipes object
        sampleRecipesPostData = new Recipess({
          title: 'An Recipes about MEAN',
          content: 'MEAN rocks!'
        });

        // Fixture mock form input values
        scope.title = 'An Recipes about MEAN';
        scope.content = 'MEAN rocks!';

        spyOn($location, 'path');
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (Recipess) {
        // Set POST response
        $httpBackend.expectPOST('api/recipess', sampleRecipesPostData).respond(mockRecipes);

        // Run controller functionality
        scope.create(true);
        $httpBackend.flush();

        // Test form inputs are reset
        expect(scope.title).toEqual('');
        expect(scope.content).toEqual('');

        // Test URL redirection after the recipes was created
        expect($location.path.calls.mostRecent().args[0]).toBe('recipess/' + mockRecipes._id);
      }));

      it('should set scope.error if save error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/recipess', sampleRecipesPostData).respond(400, {
          message: errorMessage
        });

        scope.create(true);
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      });
    });

    describe('$scope.update()', function () {
      beforeEach(function () {
        // Mock recipes in scope
        scope.recipes = mockRecipes;
      });

      it('should update a valid recipes', inject(function (Recipess) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/recipess\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        scope.update(true);
        $httpBackend.flush();

        // Test URL location to new object
        expect($location.path()).toBe('/recipess/' + mockRecipes._id);
      }));

      it('should set scope.error to error response message', inject(function (Recipess) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/recipess\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        scope.update(true);
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      }));
    });

    describe('$scope.remove(recipes)', function () {
      beforeEach(function () {
        // Create new recipess array and include the recipes
        scope.recipess = [mockRecipes, {}];

        // Set expected DELETE response
        $httpBackend.expectDELETE(/api\/recipess\/([0-9a-fA-F]{24})$/).respond(204);

        // Run controller functionality
        scope.remove(mockRecipes);
      });

      it('should send a DELETE request with a valid recipesId and remove the recipes from the scope', inject(function (Recipess) {
        expect(scope.recipess.length).toBe(1);
      }));
    });

    describe('scope.remove()', function () {
      beforeEach(function () {
        spyOn($location, 'path');
        scope.recipes = mockRecipes;

        $httpBackend.expectDELETE(/api\/recipess\/([0-9a-fA-F]{24})$/).respond(204);

        scope.remove();
        $httpBackend.flush();
      });

      it('should redirect to recipess', function () {
        expect($location.path).toHaveBeenCalledWith('recipess');
      });
    });
  });
}());
