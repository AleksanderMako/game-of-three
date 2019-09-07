const client = require("./client");
const logger = require("./config/logger");
const readlineSync = require('readline-sync');

// async function runBot() {
//     const l = logger();
//     l.info("The application is starting in Bot mode!");

//     const c = new client();
//     await c.connected();
//     await c.register();
//     c.hadnleGameOver();
//     const number = c.computeNumber();
//     await c.sendNumber(number);
//     c.handleErr();
//     // game loop 
//     while (true) {
//         c.handleErr();
//         await c.getNumber();
//         const number = c.computeNumber();
//         if (number === 1) {
//             l.info("You have won the game ! ")
//             c.gameOver();
//             c.disconnect();
//             break;
//         } else {
//            await  c.sendNumber(number);
//         }
//     }
// }
async function runUserMode() {
    process.env.SOCKET_URL="http://localhost:3000";
    process.env.LOW=3;
    process.env.HIGH=2000;
    
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
        l.info("game status is "+ game.startGame);
        await c.sendNumber(number);
        c.handleErr();
    } else {
        // handle start game as a player who joins 
        c.handleErr();
       
        newNumber = game.currentNumber;
        l.info("The new number is: " + newNumber);
        userNumber = readlineSync.questionInt("Enter your computed number: ");
        correctUserNumber = validateUserChoice(userNumber, newNumber, l);
        if (correctUserNumber === 1) {
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
        userNumber = readlineSync.questionInt("Enter your computed number: ");
        correctUserNumber = validateUserChoice(userNumber, newNumber, l);
        if (correctUserNumber === 1) {
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
        else {
            while (serverNumber === 1 || serverNumber === -1 || serverNumber === 0) {
                logger.info("you need to add  1 to the number you got");
                userNumber = readlineSync.questionInt("Enter your computed number: ");
            }
            if(userNumber === 2 || userNumber === 0 || userNumber === 1 ) break;
        
            logger.info("you need to add -1,0 or 1 to the number you got and devide by 3");
            userNumber = readlineSync.questionInt("Enter your computed number: ");
        }

    }
    return userNumber;
}

runUserMode();

