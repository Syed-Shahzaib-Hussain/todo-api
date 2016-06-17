/**
 * Created by shahzaib on 6/13/16.
 */
var bcrypt = require('bcrypt');
var _ = require('underscore');
var jwt = require('jsonwebtoken');
var crypto = require('crypto-js');


module.exports = function (sequelize, DataTypes) {
    var user = sequelize.define('user', {
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        }, salt : {
            type: DataTypes.STRING
        }, password_hash: {
            type: DataTypes.STRING
        },
        password: {
            type: DataTypes.VIRTUAL,
            allowNull: false,
            validate: {
                len: [8,100]
            },
            set : function (value) {
                var salt = bcrypt.genSaltSync(10);
                var hashedPassword = bcrypt.hashSync(value, salt);
                this.setDataValue('password', value);
                this.setDataValue('password_hash', hashedPassword);
                this.setDataValue('salt', salt)
            }
        }

    }, {
        hooks: {
            beforeValidate: function(user, options) {
                if (typeof user.email === 'string' && user.email.trim().length >0) {
                   user.email = user.email.toLowerCase();
                }
            }
        }, instanceMethods: {
            toPublicJSON: function () {
                var json = this.toJSON();
                return _.pick(json, 'id', 'email', 'createdAt', 'updatedAt');
            },
            generateToken: function (type) {
                var userData = JSON.stringify({
                    id: this.get('id'),
                    type: type
                });

                var encryptedData = crypto.AES.encrypt(userData, 'asdfghjkl123!@#').toString();
                var token = jwt.sign({token: encryptedData}, "qwerty!@#!@$#");
                return token;
            }
        }, classMethods: {
            authenticate: function (body) {
                return new Promise(function (resolve, reject) {
                    if (typeof body.email !== 'string' || typeof body.password !== 'string') {
                        return reject();
                    }

                    user.findOne({
                        where: {
                            email: body.email
                        }
                    }).then(function (email) {
                        if (!email || !bcrypt.compareSync(body.password, email.get('password_hash'))) {
                            return reject();
                        }
                        return resolve(email);
                    },function () {
                        return reject();
                    })
                })
            }
        }
    });
    return user;
};