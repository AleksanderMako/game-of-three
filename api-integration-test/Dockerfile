FROM node:10
RUN mkdir /tests
WORKDIR /tests
COPY package.json /tests
RUN npm install --verbose
COPY . /tests