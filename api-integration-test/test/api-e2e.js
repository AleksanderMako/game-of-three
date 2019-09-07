const expect = require('chai').expect;
const io = require('socket.io-client');
var clientIo = io.connect("http://api:3000");;
const helper = require("./test-helpers");

// afterEach(()=>{
//     clientIo.emit("connectiondown");
// });
describe("Server", function () {
    describe("number event ", function () {
        beforeEach(() => {
            clientIo = io.connect("http://api:3000");
        });
        it("should issue an error event if there is not a player id ", function () {
            // Arrange 
            const game = {
                gameID: "gg",
                currentNumber: 55
            }

            //Act 
            clientIo.emit("number", game);

            //Assert
            clientIo.on("Error", function (message) {
                const expectedError = new Error("number event requires the player ID")
                expect(message).to.deep.equal(expectedError.message);
            });
        });

        it("should issue an error when current number is missing ", function () {
            // Arrange 
            const game = {
                gameID: "gg",
                playerID: "P1"
            }

            //Act 
            clientIo.emit("number", game);

            //Assert 
            clientIo.on("Error", function (message) {
                const expectedError = new Error("number event requires the computed number")
                expect(message).to.deep.equal(expectedError.message);
            });
        });

        it("should pass the number correctly to the other user ", async function () {
            this.timeout(40000);
            // Arragne 
            const user1 = await helper.registerHelper(clientIo);
            const user1GamePayload = {
                gameID: user1.gameID,
                playerID: user1.playerID,
                currentNumber: 3
            }
            // clientIo.emit("number", user1GamePayload);
            await helper.sendNumberHelper(clientIo,user1GamePayload);
            const client2 = io.connect("http://api:3000");
            const user2 = await helper.registerHelper(client2);
            console.log("DEBUG user2 : " + user2.currentNumber);

            const user2GamePayload = {
                gameID: user2.gameID,
                playerID: user2.playerID,
                currentNumber: 1
            }

            // Act 
            await helper.sendNumberHelper(client2,user2GamePayload);
            // client2.emit("number", user2GamePayload);
            // const numberSentFromUsr1 = await helper.getNumberHelper(client2);
            // client2.emit("number", user2GamePayload);
            const numberSentFromUsr2 = await helper.getNumberHelper(clientIo);

            //Assert 
            expect(user2.currentNumber).equal(3);
            expect(numberSentFromUsr2).equal(1);
            clientIo.emit("connectiondown");
            client2.emit("connectiondown");

        });

    });

    describe("connect and register ", function () {

        it("should successfully register a player ", function () {
            clientIo.emit("register", "");
            clientIo.on("welcome", (data) => {
                console.log(data);
            });
            clientIo.on("register-response", function (data) {
                console.log("DEBUG: server reg data " + data);
                expect(data.playerID).to.not.be.null;
                expect(data.playerID).to.not.be.undefined;
                expect(data.gameID).to.not.be.null;
                expect(data.gameID).to.not.be.undefined;
            });
        });

    });

});