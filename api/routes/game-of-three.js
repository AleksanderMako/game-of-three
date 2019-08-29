var express = require('express');
var router = express.Router();
var connection = require('../services/connection-service');
var database = require('../services/database-service');
connection.connect().then((db) => {
    new database(db)
}).catch((err) => {
    console.log("ERROR: Could not connect to database \n");
    console.log("ERROR: " + err);
});

router.get('/register', function (req, res) {
    res.send("this is the register endpoint ")
});

module.exports = router;