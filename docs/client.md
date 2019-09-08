# Game of Three Client
The client application is represented by three files in total: client.js, run-client.js, run-bot.js

### Client.js 
The client of the application is implemented inside a class where the main properties are:  
```
id which holds the client's game ID
gameID which holds the ID of the current game the client is participating 
client which holds the connection object to the server 
currentNumber which is the number fetched from the server
startGame which indicates if the client should start the game.
```
The following logic is followed on deciding whos tarts the game:  
```
1. If the registration object returned by the server contains a number property then
   1. this means the server joined the client to an open game started by someone else
   2. therefore the startGame property must be set to false 
2. Otherwise this client starts the game 

```

### Running the client as bot

The run bot file includes the logic needed for a client to play on its own. 



