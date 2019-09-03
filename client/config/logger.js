const logger = require("winston");


function getLogger() {
    const l = logger.createLogger({
        transports: [
            new logger.transports.Console(),
        ]
    });
    return l;
}
module.exports = getLogger; 
