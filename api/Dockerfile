FROM node:10
RUN mkdir /api
WORKDIR /api 
COPY package.json /api
RUN npm install --verbose
COPY . /api
