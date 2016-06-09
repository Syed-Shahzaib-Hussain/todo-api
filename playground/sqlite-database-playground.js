/**
 * Created by shahzaib on 6/10/16.
 */
var Sequelize = require('sequelize');
var sequelize = new Sequelize(undefined, undefined, undefined, {
    'dialect': 'sqlite',
    'storage': __dirname + '/sqlite-database-playground.sqlite'
});

var Todo = sequelize.define('todo', {
    description: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            len: [1,255]
        }
    },
    completed: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
});

sequelize.sync({force: true}).then(function () {



    Todo.create({
        description: 'takeout trash',
    }).then(function () {
        return Todo.create({
            description: 'clean office',
            completed: true
        })
    }).then(function () {
        // return Todo.findById(1);
        // return Todo.findAll({
        //     where : {
        //         completed: false
        //     }
        // })

        return Todo.findAll({
            where: {
                description: {
                    $like: '%office%'
                }
            }
        })


    }).then(function (todos) {
        if(todos) {
            todos.forEach(function (todo) {
                console.log(todo.toJSON())
            })
        } else {
            console.log("No todo found")
        }
    }).catch(function (e) {
        console.log(e)
    });



    console.log("Everything is synced");
});