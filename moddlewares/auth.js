const jwt = require('jsonwebtoken');
const User = require('../models/user');
const UnauthorizedError = require('../errors/unauthorized-err');

const KEY = 'fgsdsdjgskd';

const getToken = (id) => jwt.sign({ _id: id }, KEY, { expiresIn: '7d' });

// const auth = (req, res, next) => {
//   const { authorization } = req.headers;
//   // if (!authorization || !authorization.startsWith('Bearer ')) {
//   if (!authorization) {
//     return res.status(401).send({ message: 'Необходима авторизация' });
//   }
//   const token = authorization.replace('Bearer ', '');
//   return jwt.verify(token, KEY, (err, payload) => {
//     if (err) {
//       return res.status(401).send({ message: 'Необходима авторизация' });
//     }
//     return User.findOne({ _id: payload._id })
//       .then((user) => {
//         if (!user) {
//           return res.status(401).send({ message: 'Необходима авторизация' });
//         }
//         req.user = user._id;
//         next();
//       })
//       .catch(() => res.status(401).send({ message: 'Необходима авторизация' }));
//   });
// };

const auth = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    throw new UnauthorizedError('Необходима авторизация');
  }
  const token = authorization.replace('Bearer ', '');
  return jwt.verify(token, KEY, (err, payload) => {
    if (err) {
      throw new UnauthorizedError('Необходима авторизация');
    }
    return User.findOne({ _id: payload._id })
      .then((user) => {
        if (!user) {
          throw new UnauthorizedError('Необходима авторизация');
        }
        req.user = user._id;
        next();
      })
      .catch(next);
  });
};

module.exports = { getToken, auth };
