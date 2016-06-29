var Sequelize = require('sequelize');
var env = process.env.NODE_ENV || 'development';
var sequelize;

if(env === 'production') {
    sequelize = new Sequelize(process.env.DATABASE_URL, {
        dialect: 'postgresql'
    })
} else {
    sequelize = new Sequelize(undefined, undefined, undefined, {
        'dialect': 'sqlite',
        'storage': __dirname + '/data/developer-todo-api.sqlite'
    });

}

var db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.todos = sequelize.import(__dirname + "/models/todo.js");
db.users = sequelize.import(__dirname + "/models/user.js");
db.token = sequelize.import(__dirname + "/models/token.js");
db.users.hasMany(db.todos);
db.todos.belongsTo(db.users);
module.exports = db;