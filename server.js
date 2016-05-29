/**
 * Created by shahzaib on 5/29/16.
 */
var express = require('express');
var app = express();
var PORT = process.env.PORT || 3000;

app.get('/', function (req, res) {
    res.send("TODO API Root")
});

app.listen(PORT, function () {
    console.log("Server is started on port: " + PORT)
});