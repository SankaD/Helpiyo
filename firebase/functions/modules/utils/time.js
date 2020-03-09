const moment = require('moment');

module.exports = {
    now: () => {
        return moment().utc().toDate();
    },
};