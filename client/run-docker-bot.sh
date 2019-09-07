#!/bin/bash
source ./docker-bot-env.sh
docker-compose -p ${PROJECT_NAME} -f run-docker-bot.yml up --build