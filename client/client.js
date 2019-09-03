const io = require('socket.io-client');

/*
  connect to server 
  send register event 
  get the data back 
*/
module.exports = class Client {
  constructor() {
    this.id = "";
    this.gameID = "";
    this.client = io.connect("http://api:3000");
    this.currentNumber = -1;
    this.startGame;
  }
  register() {
    this.client.emit("register", "");
    this.client.on("register response", (data) => {
      this.gameID = data.gameID;
      this.id = data.playerID;
      if (data.currentNumber) {
        this.currentNumber = data.currentNumber;
        this.startGame = false;
      }
      else this.startGame = true;

      return this.startGame;
    });
  }
  sendNumber(gameID, playerID, number) {
    const gamePayload = {
      gameId: gameID,
      playerID: playerID,
      number: number
    }
    this.client.emit("number", gamePayload);
  }
  computeNumber() {
    //TODO: configure this with env vars low and high 
    if (this.startGame) {
      const randInt = this.randomInt(3, 100);
      this.startGame = false;
      return randInt;
    }
    if ((this.currentNumber + 1) % 3 == 0) {
      this.currentNumber += 1;
      return this.currentNumber / 3;

    } else if ((this.currentNumber % 3) == 0) {
      return this.currentNumber / 3;

    } else if ((this.currentNumber - 1) % 3 == 0) {
      this.currentNumber -= 1;
      return this.currentNumber / 3;
    }


  }
  randomInt(low, high) {
    return Math.floor(Math.random() * (high - low + 1) + low);
  }

}