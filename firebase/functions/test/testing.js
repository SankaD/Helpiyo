// process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
// process.env.TESTING = "1";
process.env.SOCCO_SECRET = "testing";

const TestUtils = require('./testUtils');
const bootstrap = require('../bootstrap');
const DbManager = require('../modules/db/db_manager');
const logger = require('../modules/utils/logger');
const mongoose = require('mongoose');

mongoose.connection.once('open', () => {
    // mongoose.connection.db.dropDatabase(function () {
    //     console.log("database truncated");
    // });
});
mongoose.connect("mongodb://localhost:27017/helpiyo_local", {useNewUrlParser: true})
    .catch(error => {
        logger.error(error);
    });

// const mongoose = require('mongoose');

const expect = require("chai").expect;

const createProfile = require("../modules/profile/register");
const verifyProfile = require("../modules/profile/verify_profile");

before(() => {

});

beforeEach(() => {
    return TestUtils.instance.resetData()
        .then(() => {
            let promise1 = createProfile({
                _id: "one@test.com",
                email: "one@test.com",
                password: "Password@123",
                phoneNumber: "0718065232",
                heroName: "One"
            });

            let promise2 = createProfile({
                _id: "two@test.com",
                email: "two@test.com",
                password: "Password@123",
                phoneNumber: "0773837838",
                heroName: "Two"
            });

            let promise3 = createProfile({
                _id: "three@test.com",
                email: "three@test.com",
                password: "Password@123",
                phoneNumber: "0773837839",
                heroName: "Three"
            });

            let promise4 = createProfile({
                _id: "new@test.com",
                email: "new@test.com",
                password: "Password@123",
                phoneNumber: "0773837833",
                heroName: "New"
            });
            return Promise.all([promise1, promise2, promise3, promise4]);
        });
});

describe("Test framework", () => {
    it("Testing 123", () => {
        expect(1).to.equal(1);
    });
});

after(() => {
    // process.exit();
    return mongoose.connection.close();
});