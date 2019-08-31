"use strict";
const mongoose = require('mongoose');

function connect() {

    return new Promise((resolve, reject) => {

        const db = mongoose.connect("mongodb://db:27019/games", {
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