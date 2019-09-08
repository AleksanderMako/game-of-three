# Game of Three API

The Game of Three API uses the socket.Io library to accept and pass messageds around and is organized in the following way:   

* Controllers
* Services
* Models
* Configurations
* Constants

### Models

The API uses a Mongo instance for persistance and it persists some amount of data to allow for more than one game 
to be played at the time.  
Therefore, the API has a game model which looks like this:  

```
player1ID of type string.
player2ID of type string.
player1Status of type boolean which denotes if a user is online of offline.
player2Status of type boolean which denotes if a user is online of offline.
gameStatus of type boolean where true would indicate the game is closed i.e both players joined the game.
and currentNumber of type number which is a place holder for the number that has just been published.

```
### Services

The API also has a layer of services which it uses to interact with the database.\
The first service is called connection service and it wraps the connection method inside a promise.\
The second service is called the database service and it is implemented using the class syntax.\
The database service includes methods for CRUD oprations which can be used in other layers of the application.  

#### Database service methods 

```
create which makes game objects 
findById
findOpenGame which searches the database for documents with game status to false
update
```

### Controllers 

The controllers layer is where the API includes most of its logic with regards to registration and game operations.\
This layer has two controllers:
* Register Controller 
* Game Controller

#### Register controller 
The register controller is implemented in a class and expects to receive a database service object and a constants object \
through the constructor of the class.  
This controller has one main method which is responsible for assigning players to games.  
The following logic is used inside this method:  
```
1. Search the database for an open game 
2. If there are no open games make a new game record and generate an ID for the user  
    * Return an object that contains the new user ID and the game ID  
3. If there is an open game  
    1. generate the ID for the user  
    2. update the game record with the new ID  
    3. return an object that has the user ID, GameID and the current number stored in the database
```

#### Game controller 
The game controller includes methods that deal with updating the game object and fetching it from the database.  
It is also implemented inside a class and expects a database service instance and a constancts object.  
The methods of the controller are:  
```
setNumber which given a new number updates the game record.  
getNumber which fetches the number currently stored.  
getGame which fetches the entire game object.  
and doesGameExist which given a game ID tries to find the corresponding object.
```

### Constants 
This is a utility class that includes some variables with pre set values to act as a mnemonics for values.  
For instance:  
```
online = true
offline =false 
closed = true
awaitingPlayer = false 
```
These values are used in the API to make the code more readable and easy to follow.

### Config
The config folder includes utility methods for configuring the environment and setting up a winston logger.  

### Server 
The server is represented by two files, namely serve.js and run-server.js.  
server.js respondes to the following events:  
* connection
* number
* gameOver
* connectiondown
* disconnect  
and it triggers the events:  
* Error
* register-response
* gameOver-gg (good game) 
* welcome

The following logic is followed:  
```
1. Upon connection the server triggers the welcome event
2. Upon registration the server takes note of the new user's ID and indexes a map with it where the socket object is saved.
   1. The server returns the registration object through the register-response event
3. Upon a number event the server 
   1. If the game exists the server updates the current game 
       1. Acknowledges that it has received the number
       2. It fetches the other player's ID from the game and with it it takes the player's socket if it exists yet
       3. If the receiving socket exists it sends the new number through that socket
   3. If the game does not exist it broadcasts an error
4. Upon connectiondown or disconnect event the server deletes the socket from the map and closes the connection to it.
```

The run-server.js file instantiates the objects of the application and injects all the dependencies as well as it starts the server.








