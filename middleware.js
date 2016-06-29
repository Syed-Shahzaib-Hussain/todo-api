/**
 * Created by shahzaib on 6/18/16.
 */
var crypto = require('crypto-js');

module.exports = function (db) {
  return {
      requireAuthentication: function (req, res, next) {
          var token = req.get('Auth') || '';

          db.token.findOne({
              where: {
                  hashToken: crypto.MD5(token).toString()
              }
          }).then(function (tokenInstance) {
              if(!tokenInstance) {
                  throw new Error();
              }

              req.token = tokenInstance;
              return db.users.getByToken(token);
          }).then(function (user) {
              req.user = user;
              next();
          }).catch(function (err) {
              res.status(401).send();
              console.error(err);
          });



          // db.users.getByToken(token).then(function (user) {
          //     req.user = user;
          //     next();
          // }, function (err) {
          //     res.status(401).send();
          // })
      }
  }
};