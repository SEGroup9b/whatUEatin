'use strict';

describe('Recipess E2E Tests:', function () {
  describe('Test recipess page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/recipess');
      expect(element.all(by.repeater('recipes in recipess')).count()).toEqual(0);
    });
  });
});
