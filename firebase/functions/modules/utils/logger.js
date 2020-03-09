// const logger = require('winston-color');

module.exports = {
    debug: (text) => {
        if (typeof global.it === "function") {
            console.log(text);
        }
    },
    info: (text) => {
        console.log(text);
    },
    warn: (text) => {
        console.warn(text);
    },
    error: (text) => {
        console.error(text);
    }
};