#!/bin/bash

source ./env.sh 
docker-compose -p ${PROJECT_NAME} -f compose-dev.yml up