#!/bin/bash
#compose file settings 
export DOCKER_NETWORK=dev-net
export DOCKER_NETWORK_NAME=soscket-dev-net
export PORT=4001
export CONTAINER_NAME=client1
export WORKING_DIR=client
export VOLUMES=client
export PROJECT_NAME=clientapp1
#Application settings 
export SOCKET_URL=http://api:3000
export LOW=3
export HIGH=1000
#command to run the file is source env.sh 