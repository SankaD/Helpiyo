const async = require('async');
const Utils = require('../utils.test');

describe('signup page', () => {
  beforeEach((done) => {
    async.auto({
      'find element': (done) => {
        Utils.driver.waitForElementById('sign up', (error, element) => {
          if (error) {
            console.log(error);
            return done(error);
          }
          if (element) {
            return done(null, element);
          }
          return done('Element not found');
        });
      },
      'go to signup': ['find element', (results, done) => {
        const element = results['find element'];
        element.click();
        return done();
      }],
    }, errors => done(errors));
  });
  it.only('create user', () => {
    const email = `one${Date.now()}@test.com`;
    return Utils.driver.elementByAccessibilityId('email')
      .sendKeys(email)
      .elementByAccessibilityId('password_field')
      .sendKeys('Password@123')
      .elementByAccessibilityId('submit')
      .click();
  });
});
