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
var db = require('./db');
var bcrypt = require('bcrypt');

app.use(bodyParser.json());

app.get('/todos/:id', function (req, res) {
    var todoID = parseFloat(req.params.id);

    db.todos.findById(todoID).then(function (todo) {
          if(!!todo){
              res.json(todo.toJSON());
              console.log(todo.toJSON());
          } else {
              res.status(404).send();
          }
    }, function (err) {
        res.status(500).send('Server Problem')
    });
    //var matchedID = _.findWhere(todos, {id: todoID});

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
    // if (matchedID) {
    //     res.json(matchedID);
    // } else {
    //     res.status(404).send();
    // }

});




app.get('/todos', function (req, res) {
    var query = req.query;
    var filter= {};

    if (query.hasOwnProperty('completed') && query.completed === "true") {
        filter.completed = true;
    } else if(query.hasOwnProperty('completed')&& query.completed === "false"){
        filter.completed = false;
    }

    if(query.hasOwnProperty('q') && query.q.trim().length > 0 && _.isString(query.q)) {
        filter.description = {
            $like : "%"+query.q+"%"
        }
    }else if (query.hasOwnProperty('q')) {
        res.status(400).send("Bad Query Parameter")
    }

    db.todos.findAll({
        where: filter
    }).then(function (todos) {
        res.json(todos);
    }, function (err) {
        res.status(500).send("Server Error")
    });


    // var filteredTodos = todos;
    //
    // if(queryParams.hasOwnProperty('completed') && queryParams.completed === 'true') {
    //     filteredTodos = _.where(filteredTodos, {completed: true})
    // } else if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'false') {
    //     filteredTodos = _.where(filteredTodos, {completed: false})
    // }
    //
    // if (queryParams.hasOwnProperty('q') && queryParams.q.length > 0) {
    //     filteredTodos = _.filter(filteredTodos, function (todo) {
    //         return todo.description.toLowerCase().indexOf(queryParams.q) > -1
    //     })
    // }
    //
    // res.json(filteredTodos)
});

app.get('/', function (req, res) {
    res.send("TODO API Root")
});

app.post('/todos', function (req, res) {
    var body = _.pick(req.body, 'description', 'completed');

    db.todos.create(body).then(function (todo) {
            res.json(todo.toJSON())
    }, function (err) {
        res.status(400).json(err);
    });
    // if (!_.isBoolean(body.completed) && !_.isString(body.description) && body.description.trim().length === 0) {
    //     return res.status(400).send();
    // }

    // body.id = todoNextId++;
    // body.description = body.description.trim();
    // todos.push(body);
    // res.json(body);
    // console.log(todos)
});

app.delete('/todos/:id', function (req, res) {
    var todoID = parseInt(req.params.id, 10);
    db.todos.destroy({
        where: {
            id: todoID
        }
    }).then(function (delObj) {
        if (delObj === 0) {
            res.status(404).send("Id not found")
        } else {
            res.status(204).send();
        }

    }, function (err) {
        res.status(500).send('Internal Server Error')
    });

    // var matchedTodo = _.findWhere(todos, {id : todoID});
    // if (!matchedTodo) {
    //     return res.status(400).json({"error": "Id not found"})
    // }
    // todos = _.without(todos,matchedTodo);
    // console.log("Deleted Model is: " + JSON.stringify(matchedTodo));
    // res.json(matchedTodo);
});

app.put('/todos/:id', function (req, res) {
    var todoId = parseInt(req.params.id);
    var body = _.pick(req.body, 'description', 'completed');
    var attributes = {};

    if (body.hasOwnProperty('completed')) {
        attributes.completed = body.completed;
    }

    if(body.hasOwnProperty('description')) {
        attributes.description = body.description;
    }

    db.todos.findById(todoId).then(function (todo) {
        if (todo) {
            return todo.update(attributes);
        } else {
            res.status(404).send("Todo not found")
        }
    }, function (err) {
        res.status(500).send("Internal Server Error!")
    }).then(function (todo) {
        res.json(todo);
    }, function (err) {
        res.status(500).json(err)
    });

    // var matchedTodo = _.findWhere(todos, {id: todoId});
    // var validObject = {};
    //
    // if (!matchedTodo) {
    //     return res.status(404).send();
    // }
    //
    // if (body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length>0 ) {
    //     validObject.description = body.description;
    // } else if (body.hasOwnProperty('description')) {
    //     return res.status(400).send();
    // }
    //
    // if (body.hasOwnProperty('completed') && _.isBoolean(body.completed)) {
    //     validObject.completed = body.completed;
    // } else if (body.hasOwnProperty('completed')) {
    //     return res.status(400).send();
    // }
    //
    // _.extend(matchedTodo, validObject);
    // res.json(matchedTodo);
    //


});

app.post('/user', function (req,res) {
    var body = _.pick(req.body, 'email', 'password');
    db.users.create(body).then(function (user) {
       res.json(user.toPublicJSON());
    }, function (err) {
        res.status(400).json(err)
    })
});

app.post('/user/login', function (req, res) {
    var body = _.pick(req.body, 'email', 'password');

    db.users.authenticate(body).then(function (user) {
        res.json(user.toPublicJSON());
    }, function (err) {
        res.status(401).send();
    })
   
});

db.sequelize.sync({force:true}).then(function () {
    app.listen(PORT, function () {
        console.log("Server is started on port: " + PORT)
    });
});
