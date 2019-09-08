
const client = require("./client");
const logger = require("./config/logger");
const setEnvVariables = require("./config/settings");
async function runBot() {
    setEnvVariables();

    const l = logger();
    l.info("The application is starting in Bot mode!");

    const c = new client();
    await c.connected();
    await c.register();
    c.hadnleGameOver();
    const number = c.computeNumber();
    if (number === 1 && c.verifyWinCondition()) {
        l.info("You have won the game ! ")
        c.gameOver();
        c.disconnect();
    }
    else await c.sendNumber(number);
    c.handleErr();
    // game loop 
    while (true) {
        c.handleErr();
        const newNumber = await c.getNumber();
        const number = c.computeNumber();
        if (number === 1 && c.verifyWinCondition()) {
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