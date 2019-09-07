const expect = require('chai').expect;
const databaseService = require("../services/database-service");
const connService = require("../services/connection-service");
const Constants = require("../constants/constants");
const registerController = require("../controllers/register");
const game = require('../models/game');
const gameController = require("../controllers/game");

let conn;
let dbService;
let constants;
let schema;
let gController;

before(async function () {
    conn = await connService.connect();
    schema = game.gameModel(conn);
    constants = new Constants();
    dbService = new databaseService(schema, constants);
    rController = new registerController(dbService, constants);
    gController =new  gameController(dbService, constants);

});

afterEach(function (done) {
    conn.collections.games.drop(() => { done(); })
});

describe("database service ", function () {
    describe("create", function () {
        it("should create records in mongo db ", async function () {

            //Arrange 
            const testCreate = {
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

describe("register Controller ", function () {
    describe("register", function () {
        it("should create new db record when no open games are available ", async function () {

            //Act 
            const regDetails = await rController.registerPlayer();

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
            await dbService.create(game);

            //Act 
            await rController.registerPlayer();

            //Assert 
            const openGame = await dbService.findOpenGame();
            expect(openGame).to.be.undefined;

        });

        function countHelper() {
            return new Promise((resolve, reject) => {
                conn.collections.games.countDocuments({}, (err, c) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(c);
                    }
                });
            });
        }

        it("should not make a new game record whenever there is an open game and p2 attempts to join ", async function () {
            // Arrange 
            let allGamesCount;
            let currentCount;
            const game = {
                player1ID: "p1",
                player2ID: "",
                player1Status: true,
                player2Status: false,
                gameStatus: false,
                currentNumber: 3
            }
            try {
                await dbService.create(game);
                allGamesCount = await countHelper();

                //Act 
                await rController.registerPlayer();
                currentCount = await countHelper();

            } catch (error) {
                console.log("ERROR: " + error);
            }


            //Assert 
            expect(allGamesCount).equal(currentCount);
            expect(currentCount).equal(1);

        });
    });
});

describe("game controller ", function () {
    describe("set number", function () {
        it("should correctly update the current game number ", async function () {
            //Arrange 
            let gameID;
            let updatedGame;

            const game = {
                player1ID: "p1",
                player2ID: "",
                player1Status: true,
                player2Status: false,
                gameStatus: false,
                currentNumber: 3
            }

            try {
                gameID = await dbService.create(game);
                console.log("DEBUG: "+JSON.stringify(gameID));
            } catch (error) {

                console.log("ERROR in arrange:" + error);
            }

            const data = {
                gameID: gameID,
                currentNumber: 5
            }

            //Act 
            try {
                await gController.setNumber(data);

            } catch (error) {

                console.log("ERROR in act :" + error);
            }

            //Assert 
            try {
                updatedGame = await dbService.findById(data.gameID);
            } catch (error) {
                console.log("ERROR:" + error);
            }
            expect(updatedGame.currentNumber).equal(5);

        });
    });
});