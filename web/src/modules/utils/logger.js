export default class Logger {
    info(msg) {
        console.log(msg);
    }
    error(error) { console.error(error); }

    warn(msg) { console.warn(msg); }

    log(msg) { this.info(msg); }
}