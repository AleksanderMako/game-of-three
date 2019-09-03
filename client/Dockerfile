FROM node:10
RUN mkdir /client
WORKDIR /client
COPY package.json /client
RUN npm install --verbose
COPY . /client