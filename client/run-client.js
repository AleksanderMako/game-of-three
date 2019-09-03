const client = require("./client");

async function run() {
    const c = new client();
    await c.connected();
    await c.register();
    const number = c.computeNumber();
    c.sendNumber(number);
    c.handleErr();
    // game loop 
    while (true) {
        await c.getNumber();
        const number = c.computeNumber();
        if (number === 1) {
            console.log("INFO: game over");
            break;
        } else {
            c.sendNumber(number);
            c.handleErr();
        }


    }
}
run();