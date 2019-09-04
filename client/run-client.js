const client = require("./client");
const logger = require("./config/logger");
async function run() {
    const l = logger();
    const c = new client();
    await c.connected();
    await c.register();
    const number = c.computeNumber();
    c.sendNumber(number);
    c.handleErr();
    // game loop 
    while (true) {
        c.handleErr();
        await c.getNumber();
        const number = c.computeNumber();
        if (number === 1) {
            l.info("You have won the game ! ")
            c.disconnect();
            break;
        } else {
            c.sendNumber(number);
        }


    }
}
run();