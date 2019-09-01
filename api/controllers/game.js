module.exports = class GameController {
    constructor(databaseService, constants) {
        this.dbService = databaseService;
        this.constants = constants;
    }

    async setNumber(data) {
        // pull document by id 
        let updatedGame;
        const game = await this.getGame(data);

        // set the currentNumber to data.number
        game.currentNumber = data.number;

        try {
            updatedGame = await this.dbService.update(game);
        } catch (error) {
            console.log("ERROR in game constroller setNumber : " + err);
        }
        if (updatedGame.currentNumber !== data.number) throw new Error("current number in Database was not updated");

    }

    async getNumber(data) {
        // pull document by id 
        const game = await this.getGame(data);
        return game.currentNumber;
    }

    async doesGameExist(data) {
        const game = await this.getGame(data);
        if (game) return true;
        return false;
    }

    async getGame(data) {

        let game;
        try {
            game = await this.dbService.findById(data.gameId);

        } catch (error) {
            console.log("ERROR in game constroller getGame : " + err);
        }
        return game;
    }
}