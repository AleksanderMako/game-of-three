const server = require("./server");
const connectionService = require("./services/connection-service");
const databaseService = require("./services/database-service");
const constants = require("./constants/constants");
const game = require("./models/game");
const rController = require("./controllers/register");
const gController = require("./controllers/game");

async function run() {
    const conn = await connectionService.connect();
    const gameSchema = game.gameModel(conn);
    const c = new constants();
    const dbService = new databaseService(gameSchema,c);
    const registerController = new rController(dbService,c);
    const gameController = new gController(dbService,c);
    const s = new server(registerController,gameController);
    s.start();
}
run ();