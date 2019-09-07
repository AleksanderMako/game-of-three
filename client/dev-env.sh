#!/bin/bash
#====================================================================
# Running 2 bots requires CONTAINER_NAME, PROJECT_NAME and PORT 
# THE MODE variable must be set to bot and the socket url to api:3000
# and then execute the run.sh script 
#====================================================================

#============================================================================
# Running a client requires to set the socket URL to localhost:3000
# and then setting the MODE variable to user 
# To run its corresponding bot just set CONTAINER_NAME, PROJECT_NAME and PORT
# to values of your choosing and the execute the run.sh script 
#============================================================================

#compose file settings 
export DOCKER_NETWORK=dev-net
export DOCKER_NETWORK_NAME=soscket-dev-net
export PORT=4000
export CONTAINER_NAME=client
export WORKING_DIR=client
export VOLUMES=client
export PROJECT_NAME=clientapp
export DEV_MODE_FILENAME=runclient
#Application settings 
export SOCKET_URL=http://localhost:3000
export LOW=3
export HIGH=4000
export MODE=bot 
#command to run the file is source env.sh 