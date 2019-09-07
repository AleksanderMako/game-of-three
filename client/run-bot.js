
const client = require("./client");
const logger = require("./config/logger");
const getSocket = require("./config/settings");
async function runBot() {
    getSocket();
    process.env.LOW = 3;
    process.env.HIGH = 2000;

    const l = logger();
    l.info("The application is starting in Bot mode!");

    const c = new client();
    await c.connected();
    await c.register();
    c.hadnleGameOver();
    const number = c.computeNumber();
    await c.sendNumber(number);
    c.handleErr();
    // game loop 
    while (true) {
        c.handleErr();
        await c.getNumber();
        const number = c.computeNumber();
        if (number === 1) {
            l.info("You have won the game ! ")
            c.gameOver();
            c.disconnect();
            break;
        } else {
            await c.sendNumber(number);
        }
    }
}
runBot();