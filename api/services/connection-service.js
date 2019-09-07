"use strict";
require('dotenv').config();
const settings = require("../config/config");
const mongoose = require('mongoose');

function connect() {

    return new Promise((resolve, reject) => {

        const db = mongoose.connect(settings.getDBConnectionStr(), {
            useNewUrlParser: true,
            useFindAndModify: false 
        }, (err, db) => {

            if (err != null) {
                reject(err);
            }
            resolve(db);
        });
    });
    
}

module.exports = {
    connect
}