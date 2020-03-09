const wd = require('wd');
const expect = require('chai').expect;
const Utils = require('./utils.test');
const async = require('async');

const CONFIG = {
  SERVER: {
    host: 'localhost',
    port: 4723,
  },
  DEVICE: {
    platformName: 'Android',
    deviceName: 'Nexus 6 API 26',
    app: 'android/app/build/outputs/apk/debug/app-debug.apk',
  },
};

function isDevelopment() {
  const NODE_ENV = process.env.NODE_ENV;
  return !NODE_ENV || (NODE_ENV && NODE_ENV === 'development');
}

function addEventListenersTo(driver) {
  if (!isDevelopment()) {
    return;
  }

  driver.on('status', (info) => {
    console.log(info);
  });
  driver.on('command', (command, method, data) => {
    console.log(command, method, data || '');
  });
  driver.on('http', (method, path, data) => {
    console.log(method, path, data || '');
  });
}


Object.freeze(CONFIG);

beforeEach((done) => {
  async.auto({
    'init connection': [function (done) {
      Utils.driver = wd.promiseChainRemote(CONFIG.SERVER);
      Utils.driver.setPageLoadTimeout(30000);
      addEventListenersTo(Utils.driver);

      Utils.driver.init(CONFIG.DEVICE, () => Utils.driver.resetApp(() => done()));
    }],
  }, (errors, results) => done(errors));
});

afterEach((done) => {
  Utils.driver.quit();
  return done();
});

describe('appium test', () => {
  it('test', (done) => {
    const driver = Utils.driver;
    async.auto({
      'find element': function (done) {
        driver.waitForElementById('sign up', (error, element) => {
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
      click: ['find element', function (results, done) {
        const element = results['find element'];
        element.click();
        return done();
      }],
    }, (errors, results) => done(errors));
  });
});

