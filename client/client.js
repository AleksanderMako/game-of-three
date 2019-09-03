const io = require('socket.io-client');
const logger = require("./config/logger");
/*
  connect to server 
  send register event 
  get the data back 
*/
module.exports = class Client {
  constructor() {
    this.id = "";
    this.gameID = "";
    this.client = io.connect(process.env.SOCKET_URL);
    this.currentNumber = -1;
    this.startGame;
    this.l = logger();
  }

  connected() {
    return new Promise((resolve, reject) => {
      this.client.on("welcome", (welcomeMessage) => {
        this.l.info(welcomeMessage);
        resolve();
      })
    });
    ;
  }

  register() {
    return new Promise((resolve, reject) => {
      this.client.emit("register", "");
      this.client.on("register-response", (data) => {
        this.gameID = data.gameID;
        this.id = data.playerID;
        this.l.info("Completed registration");
        this.l.info("Game ID: " + this.gameID + " player ID: " + this.id);
        if (data.currentNumber) {
          this.currentNumber = data.currentNumber;
          this.startGame = false;
        }
        else this.startGame = true;
        resolve();
      });
    });

  }

  sendNumber(number) {
    const gamePayload = {
      gameID: this.gameID,
      playerID: this.id,
      currentNumber: number
    }
    this.l.info("send event issued for number" + number);
    this.client.emit("number", gamePayload);
  }

  computeNumber() {
    //TODO: configure this with env vars low and high 
    let newNumber;
    if (this.startGame) {
      const randInt = this.randomInt(3, 100);
      this.startGame = false;
      return randInt;
    }

    if ((this.currentNumber + 1) % 3 == 0) {

      this.currentNumber += 1;
      newNumber = this.currentNumber / 3;
      this.l.info("The new number is: " + newNumber);
      return newNumber;

    } else if ((this.currentNumber % 3) == 0) {

      newNumber = this.currentNumber / 3;
      this.l.info("The new number is: " + newNumber);
      return newNumber;

    } else if ((this.currentNumber - 1) % 3 == 0) {

      this.currentNumber -= 1;
      newNumber = this.currentNumber / 3;
      this.l.info("The new number is: " + newNumber);
      return newNumber;
    }

  }
  randomInt(low, high) {
    return Math.floor(Math.random() * (high - low + 1) + low);
  }
  getNumber() {
    return new Promise((resolve, reject) => {
      this.client.on("get-number", (number) => {
        this.currentNumber = number;
        resolve();
      });
    });

  }
  handleErr() {
    this.client.on("Error", (errorMsg)=> {
      this.l.info("ERROR: "+ JSON.stringify(errorMsg));
    });
  }

}