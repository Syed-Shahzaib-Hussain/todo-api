/**
 * Created by shahzaib on 5/29/16.
 */
var express = require('express');
var app = express();
var PORT = process.env.PORT || 3000;
var todos = [];
var todoNextId=1;
var bodyParser = require('body-parser');
var _ = require('underscore');

app.use(bodyParser.json());

app.get('/todos/:id', function (req, res) {
    var todoID = parseFloat(req.params.id);
    var matchedID = _.findWhere(todos, {id: todoID});

    // todos.forEach(function (model) {
    //     if (model.id === todoID) {
    //         matchedID = model;
    //     }
    // });
    
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
    var body = _.pick(req.body, 'description', 'completed');
    if (!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0) {
        return res.status(400).send();
    }

    body.id = todoNextId++;
    body.description = body.description.trim();
    todos.push(body);
    res.json(body);
    console.log(todos)
});


app.listen(PORT, function () {
    console.log("Server is started on port: " + PORT)
});