#!/bin/bash
#compose file settings 
export DOCKER_NETWORK=dev-net
export DOCKER_NETWORK_NAME=soscket-dev-net
export PORT=4000
export CONTAINER_NAME=client
export WORKING_DIR=client
export VOLUMES=client
export PROJECT_NAME=clientapp
export STDIN_OPEN=true
export TTY=true
#Application settings 
export SOCKET_URL=http://api:3000
export LOW=3
export HIGH=1000
export MODE=bot 
#command to run the file is source env.sh 