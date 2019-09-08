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
          resolve({
            startGame: this.startGame,
            currentNumber: data.currentNumber
          });
        }
        else {
          this.startGame = true;
          resolve({
            startGame: this.startGame,
            currentNumber: -1.5
          });
        }
      });
    });

  }

  sendNumber(number) {
    const gamePayload = {
      gameID: this.gameID,
      playerID: this.id,
      currentNumber: number
    }
    this.l.info("send event issued for number: " + number);
    return new Promise((resolve, reject) => {
      this.client.emit("number", gamePayload, function (ack) {
        if(ack)resolve();
        reject();
      });
    });

  }

  // Boundaries are inclusive 
  computeNumber() {
    let newNumber;
    if (this.startGame) {
      const randInt = this.randomInt(process.env.LOW, process.env.HIGH);
      if (randInt === 0) randInt += 1;
      this.startGame = false;
      return randInt;
    }

    if (this.currentNumber === 1 || this.currentNumber === -1 || this.currentNumber === 0) {
      newNumber = this.currentNumber + 1;
      this.l.info("The new number is: " + newNumber);
      return newNumber;
    }
    if ((this.currentNumber + 1) % 3 === 0) {

     // this.currentNumber += 1;
      newNumber = (this.currentNumber+1) / 3;
      this.l.info("The new number is: " + newNumber);
      return newNumber;

    } else if ((this.currentNumber % 3) === 0) {

      newNumber = this.currentNumber / 3;
      this.l.info("The new number is: " + newNumber);
      return newNumber;

    } else if ((this.currentNumber - 1) % 3 === 0) {

      // this.currentNumber -= 1;
      newNumber = (this.currentNumber -1)/ 3;
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
        resolve(number);
      });
    });

  }
  handleErr() {
    this.client.on("Error", (errorMsg) => {
      this.l.info("ERROR: " + JSON.stringify(errorMsg));
    });
  }
  disconnect() {
    this.l.info("disconnect event fired");
    this.client.emit("connectiondown", "");
  }
  gameOver() {
    this.l.info("gameOver event fired");
    const gameOver = {
      gameID: this.gameID,
      playerID: this.id,
      message: "Game Over you have lost!"
    }
    this.client.emit("gameOver", gameOver);
  }
  hadnleGameOver() {
    this.client.on("gameOver-gg", (message) => {
      this.l.info(message);
      this.disconnect();
    });
  }
  verifyWinCondition(){
    if((this.currentNumber+1)%3 === 0)return true;
    else if((this.currentNumber-1)%3 === 0)return true;
    else if((this.currentNumber%3)===0 && this.currentNumber !==0)return true;
    return false;
  }
}
