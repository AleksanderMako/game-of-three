#!/bin/bash

source ./env.sh 
if [ "$MODE" = "bot"  ]; then
     docker-compose -p ${PROJECT_NAME} -f compose-dev.yml up
else 
    npm start
fi