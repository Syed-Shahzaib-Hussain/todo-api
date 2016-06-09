/**
 * Created by shahzaib on 6/9/16.
 */

module.exports = function (sequelize, DataTypes) {

    return sequelize.define('todo', {
        description: {
            type: DataTypes.STRING
        },
        completed: {
            type: DataTypes.BOOLEAN
        }
    });

};