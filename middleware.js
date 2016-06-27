/**
 * Created by shahzaib on 6/18/16.
 */
module.exports = function (db) {
  return {
      requireAuthentication: function (req, res, next) {
          var token = req.get('Auth');
          db.users.getByToken(token).then(function (user) {
              req.user = user;
              next();
          }, function (err) {
              res.status(401).send();
          })
      }
  }
};