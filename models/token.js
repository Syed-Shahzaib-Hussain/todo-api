/**
 * Created by shahzaib on 6/28/16.
 */
var crypto = require('crypto-js');

module.exports = function (sequelize, DataTypes) {
    return sequelize.define('token',{
        token: {
            allowNull: false,
            type: DataTypes.VIRTUAL,
            validation: {
                len:[1]
            },
            set: function (value) {
                var hashValue = crypto.MD5(value).toString();
                this.setDataValue('token', value);
                this.setDataValue('hashToken', hashValue);
            }
        },
        hashToken: DataTypes.STRING
    })
};