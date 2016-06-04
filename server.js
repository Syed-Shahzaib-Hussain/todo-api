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
    var queryParams = req.query;
    var filteredTodos = todos;

    if(queryParams.hasOwnProperty('completed') && queryParams.completed === 'true') {
        filteredTodos = _.where(filteredTodos, {completed: true})
    } else if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'false') {
        filteredTodos = _.where(filteredTodos, {completed: false})
    }

    res.json(filteredTodos)
});

app.get('/', function (req, res) {
    res.send("TODO API Root")
});

app.post('/todos', function (req, res) {
    var body = _.pick(req.body, 'description', 'completed');
    if (!_.isBoolean(body.completed) && !_.isString(body.description) && body.description.trim().length === 0) {
        return res.status(400).send();
    }

    body.id = todoNextId++;
    body.description = body.description.trim();
    todos.push(body);
    res.json(body);
    console.log(todos)
});

app.delete('/todos/:id', function (req, res) {
    var todoID = parseInt(req.params.id, 10);
    var matchedTodo = _.findWhere(todos, {id : todoID});
    if (!matchedTodo) {
        return res.status(400).json({"error": "Id not found"})
    }
    todos = _.without(todos,matchedTodo);
    console.log("Deleted Model is: " + JSON.stringify(matchedTodo));
    res.json(matchedTodo);
});

app.put('/todos/:id', function (req, res) {
    var todoId = parseInt(req.params.id);
    var matchedTodo = _.findWhere(todos, {id: todoId});
    var body = _.pick(req.body, 'description', 'completed');
    var validObject = {};

    if (!matchedTodo) {
        return res.status(404).send();
    }

    if (body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length>0 ) {
        validObject.description = body.description;
    } else if (body.hasOwnProperty('description')) {
        return res.status(400).send();
    }

    if (body.hasOwnProperty('completed') && _.isBoolean(body.completed)) {
        validObject.completed = body.completed;
    } else if (body.hasOwnProperty('completed')) {
        return res.status(400).send();
    }

    _.extend(matchedTodo, validObject);
    res.json(matchedTodo);
    

});

app.listen(PORT, function () {
    console.log("Server is started on port: " + PORT)
});