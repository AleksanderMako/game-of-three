# Game of Three

This solution consits of an API and client application both implemented with node.js.
The API uses the socket.io library to facilitate communication between two instances of the client application.
The API also makes use of a MongoDB instance to allow for more than one match to take place at the time.


## Getting Started

The api and the client application can both be run through npm and docker and can run on windows, linux and macOS.

### Prerequisites

Docker and Docker Compose with a 17.12.0+ Docker engine release.
NPM 
Node.js

### Running the software 

#### Run on Windows 

To run the software on Windows use npm. You will not need a Mongo instance running on Windows as there is one configured to run on the MongoDB atlas cluster.
The API will be listening on port 3000 by default on the host machine with a default 1 minute connection timeout configured to allow for user interaction on the console.

Run the API:
```
navigate to the api directory
set the variable TOOL in the .env file to npm
set the variable ENV in the .env file to production
npm install 
npm start 
```

Run a bot client (player that playes without user interaction)

```
navigate to the client directory
set the variable TOOL in the .env file to npm 
npm install 
npm run bot
```

Run a client that accepts user input 

```
navigate to the client directory
set the variable TOOL in the .env file to npm 
npm install 
npm run client 
```
#### Running through docker and docker compose

Start the API:
```
navigate to the api directory
set the variable TOOL in the .env file to docker
set the variable ENV in the .env file to production
docker-compose up --build
```
Run a bot client inside docker:

```
navigate to the client directory
in the docker-bot-env.sh file set the LOW and HIGH variables to desired values
in the docker-bot-env.sh set a desired PORT for the bot client,a PROJECT_NAME and a CONTAINER_NAME and save the file
in the .env file in the same directory set the TOOL variable to docker
give permissions to the run-docker-bot.sh script and execute it (./run-docker-bot.sh script)

```



## Running the tests

Explain how to run the automated tests for this system

### Break down into end to end tests

Explain what these tests test and why

```
Give an example
```

### And coding style tests

Explain what these tests test and why

```
Give an example
```

## Deployment

Add additional notes about how to deploy this on a live system

## Built With

* [Dropwizard](http://www.dropwizard.io/1.0.2/docs/) - The web framework used
* [Maven](https://maven.apache.org/) - Dependency Management
* [ROME](https://rometools.github.io/rome/) - Used to generate RSS Feeds


