const expect = require('chai').expect;
const databaseService = require("../services/database-service");
const connService = require("../services/connection-service");
const Constants = require("../constants/constants");
const registerController = require("../controllers/register");
const game = require('../models/game');

let conn;
let dbService;
let constants;
let schema;

before(async function () {
    conn = await connService.connect();
    schema = game.gameModel(conn);
    constants = new Constants();
    dbService = new databaseService(schema, constants);
    controller = new registerController(dbService, constants);

});

afterEach(function (done) {
    conn.collections.games.drop(() => { done(); })
});

describe("database service ", function () {
    describe("create", function () {
        it("should create records in mongo db ", async function () {

            //Arrange 
            var testCreate = {
                player1ID: "p1",
                player2ID: "p2",
                player1Status: true,
                player2Status: true,
                gameStatus: true,
                currentNumber: 3
            };

            // Act 
            const gameID = await dbService.create(testCreate);

            // Assert 
            const game = await dbService.findById(gameID);

            expect(testCreate.player1ID).equal(game.player1ID);
            expect(testCreate.player2ID).equal(game.player2ID);
            expect(testCreate.player1Status).equal(game.player1Status);
            expect(testCreate.player2Status).equal(game.player2Status);
            expect(testCreate.gameStatus).equal(game.gameStatus);
            expect(testCreate.currentNumber).equal(game.currentNumber);
        });
    });
});

describe("register controller ", function () {
    describe("register", function () {
        it("should create new db record when no open games are available ", async function () {

            //Act 
            const regDetails = await controller.registerPlayer();

            //Assert 
            expect(regDetails.playerID).to.not.be.null;
            expect(regDetails.playerID).to.not.be.undefined;
            expect(regDetails.gameID).to.not.be.null;
            expect(regDetails.gameID).to.not.be.undefined;
        });

        it("should close the game when p2 joins  ", async function () {
            //Arrange 
            const game = {
                player1ID: "p1",
                player2ID: "",
                player1Status: true,
                player2Status: false,
                gameStatus: false,
                currentNumber: 3
            }
            const gameID = await dbService.create(game);

            //Act 
            const regDetails = await controller.registerPlayer();

            //Assert 
            const openGame = await dbService.findOpenGame();
            expect(openGame).to.be.undefined;

        });
    });
});