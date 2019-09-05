const client = require("./client");
const logger = require("./config/logger");
const readlineSync = require('readline-sync');

async function runBot() {
    const l = logger();
    l.info("The application is starting in Bot mode!");

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
async function runUserMode() {
    let newNumber;
    let userNumber;
    let correctUserNumber;

    const l = logger();
    l.info("The application is starting in user mode!");
    const c = new client();
    await c.connected();
    const game = await c.register();
    if (game.startGame) {
        const number = c.computeNumber();
        c.sendNumber(number);
        c.handleErr();
    } else {
        // handle start game as a player who joins 
        c.handleErr();
        l.debug("Joined an open game ");
        newNumber = game.currentNumber;
        l.info("The new number is: " + newNumber);
        userNumber = readlineSync.questionInt("Enter your computed number: ");
        correctUserNumber = validateUserChoice(userNumber, newNumber, l);
        if (correctUserNumber === 1) {
            l.info("You have won the game ! ")
            //c.disconnect();

        } else {
            c.sendNumber(correctUserNumber);
        }
    }

    while (true) {
        // after the first exchange continue listening for events 
        c.handleErr();
        newNumber = await c.getNumber();
        l.info("The number pulled from the server is: " + newNumber);
        userNumber = readlineSync.questionInt("Enter your computed number: ");
        correctUserNumber = validateUserChoice(userNumber, newNumber, l);
        if (correctUserNumber === 1) {
            l.info("You have won the game ! ")
            // c.disconnect();
            break;
        } else c.sendNumber(correctUserNumber);
    }
}
function validateUserChoice(userNumber, serverNumber, logger) {

    while (true) {
        if ((serverNumber + 1) / 3 === userNumber) break;
        else if ((serverNumber / 3) === userNumber) break;
        else if ((serverNumber - 1) / 3 === userNumber) break;
        else {
            logger.info("you need to add -1,0 or 1 to the number you got and devide by 3 ");
            userNumber = readlineSync.questionInt("Enter your computed number: ");
        }
    }
    return userNumber;
}

async function run() {
    if (process.env.MODE === "bot") await runBot();
    else await runUserMode();
}
run();