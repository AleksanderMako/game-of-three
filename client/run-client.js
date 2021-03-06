const client = require("./client");
const logger = require("./config/logger");
const readlineSync = require('readline-sync');
const setEnvVariables = require("./config/settings");

async function runUserMode() {
    setEnvVariables();

    let newNumber;
    let userNumber;
    let correctUserNumber;
    const l = logger();

    l.info("The application is starting in user mode!");
    const c = new client();
    await c.connected();
    const game = await c.register();
    c.hadnleGameOver();
    if (game.startGame) {
        const number = c.computeNumber();
        await c.sendNumber(number);
        c.handleErr();
    } else {
        // handle start game as a player who joins 
        c.handleErr();

        newNumber = game.currentNumber;
        l.info("The new number is: " + newNumber);
        userNumber = readlineSync.questionInt("Enter your computed number by adding -1,0 or 1 to the number you got and devide by 3: ");
        correctUserNumber = validateUserChoice(userNumber, newNumber, l);
        if (correctUserNumber === 1 && c.verifyWinCondition()) {
            l.info("You have won the game ! ")
            c.gameOver();
            c.disconnect();
        } else {
            await c.sendNumber(correctUserNumber);
        }
    }

    while (true) {
        // after the first exchange continue listening for events in the game loop 
        c.handleErr();
        newNumber = await c.getNumber();
        l.info("The number pulled from the server is: " + newNumber);
        userNumber = readlineSync.questionInt("Enter your computed number by adding -1,0 or 1 to the number you got and devide by 3: ");
        correctUserNumber = validateUserChoice(userNumber, newNumber, l);
        if (correctUserNumber === 1 && c.verifyWinCondition()) {
            l.info("You have won the game ! ")
            c.gameOver();
            c.disconnect();
            break;
        } else await c.sendNumber(correctUserNumber);
    }
}
function validateUserChoice(userNumber, serverNumber, logger) {


    while (true) {
        if ((serverNumber + 1) / 3 === userNumber) break;
        else if ((serverNumber / 3) === userNumber) break;
        else if ((serverNumber - 1) / 3 === userNumber) break;
        else if (serverNumber === 1 || serverNumber === -1 || serverNumber === 0) {
            if (userNumber === 2 || userNumber === 0 || userNumber === 1) break;
            logger.info("you need to add  1 to the number you got due to server number being: " + serverNumber);
            userNumber = readlineSync.questionInt("Enter your computed number: ");
        }
        else {

            logger.info("you need to add -1,0 or 1 to the number you got and devide by 3");
            userNumber = readlineSync.questionInt("Enter your computed number: ");
        }

    }
    return userNumber;
}

runUserMode();

