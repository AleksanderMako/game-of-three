const expect = require('chai').expect;
const io = require('socket.io-client');
var clientIo = io.connect("http://api:3000");


describe("Server", function () {
    describe("connect and register ", function () {

        it("should send back the data correctly ", function () {
            clientIo.emit("register", "");
            // clientIo.on("welcome", (data) => {
            //     console.log(data);
            // });
            clientIo.on("register response", function (data) {
                const dataObj = JSON.parse(data);
                console.log("DEBUG: server reg data " + data);
                expect(dataObj.playerID).to.not.be.null;
                expect(dataObj.playerID).to.not.be.undefined;
                expect(dataObj.gameID).to.not.be.null;
                expect(dataObj.gameID).to.not.be.undefined;
            });
        });

    });
});