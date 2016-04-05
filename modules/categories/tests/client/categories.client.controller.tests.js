'use strict';

(function () {
  // Categories Controller Spec
  describe('Categories Controller Tests', function () {
    // Initialize global variables
    var CategoriesController,
      scope,
      $httpBackend,
      $stateParams,
      $location,
      Authentication,
      Categories,
      mockCategory;

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
    beforeEach(inject(function ($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_, _Authentication_, _Categories_) {
      // Set a new global scope
      scope = $rootScope.$new();

      // Point global variables to injected services
      $stateParams = _$stateParams_;
      $httpBackend = _$httpBackend_;
      $location = _$location_;
      Authentication = _Authentication_;
      Categories = _Categories_;

      // create mock categorie
      mockCategory = new Categories({
        _id: '525a8422f6d0f87f0e407a33',
        title: 'An Categorie about MEAN',
        content: 'MEAN rocks!'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Categories controller.
      CategoriesController = $controller('CategoriesController', {
        $scope: scope
      });
    }));

    it('$scope.find() should create an array with at least one categorie object fetched from XHR', inject(function (Categories) {
      // Create a sample categories array that includes the new categorie
      var sampleCategories = [mockCategory];

      // Set GET response
      $httpBackend.expectGET('api/categories').respond(sampleCategories);

      // Run controller functionality
      scope.find();
      $httpBackend.flush();

      // Test scope value
      expect(scope.categories).toEqualData(sampleCategories);
    }));

    it('$scope.findOne() should create an array with one categorie object fetched from XHR using a categorieId URL parameter', inject(function (Categories) {
      // Set the URL parameter
      $stateParams.categoryId = mockCategory._id;

      // Set GET response
      $httpBackend.expectGET(/api\/categories\/([0-9a-fA-F]{24})$/).respond(mockCategory);

      // Run controller functionality
      scope.findOne();
      $httpBackend.flush();

      // Test scope value
      expect(scope.category).toEqualData(mockCategory);
    }));

    describe('$scope.create()', function () {
      var sampleCategoryPostData;

      beforeEach(function () {
        // Create a sample categorie object
        sampleCategoryPostData = new Categories({
          title: 'An Category about MEAN',
          content: 'MEAN rocks!'
        });

        // Fixture mock form input values
        scope.title = 'An Category about MEAN';
        scope.content = 'MEAN rocks!';

        spyOn($location, 'path');
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (Categories) {
        // Set POST response
        $httpBackend.expectPOST('api/categories', sampleCategoryPostData).respond(mockCategory);

        // Run controller functionality
        scope.create(true);
        $httpBackend.flush();

        // Test form inputs are reset
        expect(scope.title).toEqual('');
        expect(scope.content).toEqual('');

        // Test URL redirection after the categorie was created
        expect($location.path.calls.mostRecent().args[0]).toBe('categories/' + mockCategory._id);
      }));

      it('should set scope.error if save error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/categories', sampleCategoryPostData).respond(400, {
          message: errorMessage
        });

        scope.create(true);
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      });
    });

    describe('$scope.update()', function () {
      beforeEach(function () {
        // Mock categorie in scope
        scope.category = mockCategory;
      });

      it('should update a valid category', inject(function (Categories) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/categories\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        scope.update(true);
        $httpBackend.flush();

        // Test URL location to new object
        expect($location.path()).toBe('/categories/' + mockCategory._id);
      }));

      it('should set scope.error to error response message', inject(function (Categories) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/categories\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        scope.update(true);
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      }));
    });

    describe('$scope.remove(category)', function () {
      beforeEach(function () {
        // Create new categories array and include the categorie
        scope.categories = [mockCategory, {}];

        // Set expected DELETE response
        $httpBackend.expectDELETE(/api\/categories\/([0-9a-fA-F]{24})$/).respond(204);

        // Run controller functionality
        scope.remove(mockCategory);
      });

      it('should send a DELETE request with a valid categoryId and remove the categorie from the scope', inject(function (Categories) {
        expect(scope.categories.length).toBe(1);
      }));
    });

    describe('scope.remove()', function () {
      beforeEach(function () {
        spyOn($location, 'path');
        scope.category = mockCategory;

        $httpBackend.expectDELETE(/api\/categories\/([0-9a-fA-F]{24})$/).respond(204);

        scope.remove();
        $httpBackend.flush();
      });

      it('should redirect to categories', function () {
        expect($location.path).toHaveBeenCalledWith('categories');
      });
    });
  });
}());