const logger = require("winston");


function getLogger() {
    const l = logger.createLogger({

        transports: [
            new logger.transports.Console({
              format: logger.format.combine(
                logger.format.colorize(),
                logger.format.simple()
              )
            }),
        ]
    });

    return l;
}
module.exports = getLogger; 