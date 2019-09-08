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
To successfully run the application it is important to keep in mind that if the api starts outside the container a bot client can't start inside a container otherwise they will not be able to communicate.
In addition the client application that accepts user input will always run through npm so that it can have access to stdin,stdout

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
give permissions to the run-docker-bot.sh script and execute it (./run-docker-bot.sh )

```

## Running the tests

The tests may be run inside of a container or through npm. 

#### Running the tests via docker

```
clean the environment with docker rm -f $(docker ps -aq) in case there are leftover containers
navigate inside the api folder 
in the .env file set the TOOL variable to docker and the ENV variable to test
and then run docker-compose -f compose-test.yml up --build 
clean the enviroment with:
docker rm -f $(docker ps -aq) by now most of the work is cached and it should be really fast.

run the command docker-compose -f compose-e2e-test.yml up --build 
navigate to the api-integration-test directory 
set the variable TOOL to docker in the .env file and run docker-compose up --build 
```

#### Running the tests via npm

```
navigate inside the api folder 
in the .env file set the TOOL variable to npm and the ENV variable to test
npm install 
npm run test

then run a server with npm start 
and navigate to api-integration-test directory
set the variable TOOL to npm and then npm run test

```


