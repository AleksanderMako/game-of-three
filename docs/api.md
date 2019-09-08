# Game of Three API

The game of three API uses the socket.Io library to accept and pass messageds around and is organized like so:   

* Controllers
* Services
* Models
* Config
* Constants

### Models

The api uses a Mongo instance for persistance and it persists some amount of data to allow for more than one game 
being played at the time.  
Therefore the api has a game model which looks like this:  

```
player1ID of type string.
player2ID of type string.
player1Status of type boolean which denotes if a user is online of offline.
player2Status of type boolean which denotes if a user is online of offline.
gameStatus of type boolean where true would indicate the game is closed i.e both players joined the game.
and currentNumber of type number which is a place holder for the number that has just been published.

```
### Services

The API also has a layer of services that it uses to interact with the database.\
The first service is called a connection service and wraps the connection method inside a promise.\
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

The controllers layer is where the api includes most of its logic with regards to registration and game operations.\
This layer has two controllers:
* Register Controller 
* Game Controller

#### Register controller 
The register controller is implemented in a class and expets to receive a database service object and a constants object \
through the constructor of the class.  
This controller has one main method which is the register method and is responsible for assigning players to games.  
The following logic is used isnide this method:  
```
1. Search the database for an open game 
2. If there are no open games make a new game record and generate an ID for the user  
    1. Return an object that contains the new user ID and the game ID  
3. 

```

