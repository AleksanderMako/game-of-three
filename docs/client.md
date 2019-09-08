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
The clients and server interaction can be broken down to 2 phases:  
1. The "handshake" which involves the handoff of the first number between the two components.
2. The game loop which handles every other game interaction 

The following protocol is followed by the bot:  
```
1. Instantiate a client object
2. Connect to the server
3. Register 
4. Compute a number
   1. If this client is starting the game then the compute method knows to incept a random number  
   otherwise it just computes the new number based on the rules using the number it got 
   
5. After the computation check if this client is a winner 
   1. if the client is a winner it triggers a game over event and disconnects  
   otherwise it sends the number to the server 
6. The handshake is now complete and the bot enters the game loop
7. The game loop: 
   1. set a number event listener
   2. compute number
   3. check for win and issue game over and disconnect otherwise send the number

```

### Running the client in interactive mode

The run client file represents the client which can interact with the user.
The protocol here is very similiar however instead of a compute number method the client reads input and validates it  
according to the game rules. 
Exception here make scenarios where the number is negative. 
If the number is negative the client in both modes operates by the same rules up until the number is reduced to  
-1,1 or 0. When the game reaches one of these stages the natural goal of the client should be towards 2 and the user is expected to add 1 to these numbers.
The client in interactive mode will validate these cases but the bot mode will increment the number by 1. 


