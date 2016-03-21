'use strict';

describe('Leaderboards E2E Tests:', function () {
  describe('Test leaderboards page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/leaderboards');
      expect(element.all(by.repeater('leaderboard in leaderboards')).count()).toEqual(0);
    });
  });
});
