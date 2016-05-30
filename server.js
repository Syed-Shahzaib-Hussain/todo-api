/**
 * Created by shahzaib on 5/29/16.
 */
var express = require('express');
var app = express();
var PORT = process.env.PORT || 3000;
var todos = [];
var todoNextId=1;
var bodyParser = require('body-parser');

app.use(bodyParser.json());

app.get('/todos/:id', function (req, res) {
    var todoID = parseFloat(req.params.id);
    var matchedID;

    todos.forEach(function (model) {
        if (model.id === todoID) {
            matchedID = model;
        }
    });
    
    // for (var i = 0; i<todos.length; i++ ) {
    //     if (todos[i].id === todoID) {
    //         matchedID = todos[i];
    //     }
    // }
    //
    if (matchedID) {
        res.json(matchedID);
    } else {
        res.status(404).send();
    }

});




app.get('/todos', function (req, res) {
    res.json(todos)
});

app.get('/', function (req, res) {
    res.send("TODO API Root")
});

app.post('/todos', function (req, res) {
    var body = req.body;
    body.id = todoNextId++;
    todos.push(body);
    res.json(body);
    console.log(todos)
});


app.listen(PORT, function () {
    console.log("Server is started on port: " + PORT)
});