/**
 * Created by shahzaib on 6/7/16.
 */
var Sequelize = require('sequelize');
var sequelize = new Sequelize(undefined, undefined, undefined, {
    'dialect': 'sqlite',
    'storage': __dirname + '/sqlite-databse-playground.sqlite'
});

var Todo = sequelize.define('todo', {
    description: {
        type: Sequelize.STRING
    },
    completed: {
        type: Sequelize.BOOLEAN
    }
});

sequelize.sync().then(function () {
    console.log("everything is synced")

    Todo.create({
        description: 'hello i am description',
        completed: true
    }).then(function (todo) {
        console.log("Finished");
        console.log(todo)
    })
});
