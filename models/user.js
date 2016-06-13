/**
 * Created by shahzaib on 6/13/16.
 */

module.exports = function (sequelize, DataTypes) {
    return sequelize.define('user', {
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [8,100]
            }
        }
    }, {
        hooks: {
            beforeValidate: function(user, options) {
                if (typeof user.email === 'string' && user.email.trim().length >0) {
                   user.email = user.email.toLowerCase();
                }
            }
        }
    })
};