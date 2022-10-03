const bcrypt = require('bcryptjs');
const User = require('../models/user');
const { getToken } = require('../moddlewares/auth');
const BadRequestError = require('../errors/bad-request-err');
const NotFoundError = require('../errors/not-found-err');
const ConflictError = require('../errors/conflict-err');

const getUsers = (req, res, next) => {
  User.find()
    .then((data) => {
      res.send(data);
    })
    .catch(next);
};

const getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }
      res.send(user);
    })
    .catch(next);
};

// const createUser = (req, res) => {
//   const {
//     name,
//     email,
//     password,
//     about,
//     avatar,
//   } = req.body;
//   if (!email || !password) {
//     return res.status(400).
// send({ message: 'Переданы некорректные данные при создании пользователя' });
//   }
//   bcrypt.hash(password, 10)
//     .then((hash) => {
//       User.create({
//         name,
//         email,
//         password: hash,
//         about,
//         avatar,
//       })
//         .then((user) => {
//           res.send({ _id: user._id, email: user.email });
//         })
//         .catch((error) => {
//           if (error.name === 'ValidationError') {
//             res.status(400).
// send({ message: 'Переданы некорректные данные при создании пользователя' });
//           } else {
//             res.status(500).send({ message: 'На сервере произошла ошибка' });
//           }
//         });
//     });
// };

const createUser = (req, res, next) => {
  const {
    name,
    email,
    password,
    about,
    avatar,
  } = req.body;
  if (!email || !password) {
    throw new BadRequestError('Переданы некорректные данные при создании пользователя');
  }
  bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({
        name,
        email,
        password: hash,
        about,
        avatar,
      })
        .then((user) => {
          res.send({ _id: user._id, email: user.email });
        })
        .catch((err) => {
          // console.log(err?._message);
          if (err.code === 11000) {
            next(new ConflictError('Пользователь с таким email уже зарегистрирован!'));
          } else {
            next(err);
          }
        });
    });
};

// const login = (req, res) => {
//   const { email, password } = req.body;
//   if (!email) {
//     res.
// status(401).
// send({ message: 'Переданы некорректные данные при аутентификации пользователя' });
//   }
//   return User.findUserByCredentials(email, password)
//     .then((user) => {
//       const token = getToken(user._id);
//       res.status(200).send(token);
//     })
//     .catch((error) => {
//       res.status(401).send({ message: error.message });
//     });
// };

const login = (req, res, next) => {
  const { email, password } = req.body;
  if (!email) {
    throw new BadRequestError('Переданы некорректные данные при аутентификации пользователя');
  }
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = getToken(user._id);
      res.status(200).send(token);
    })
    .catch(next);
};

// const updateUserProfile = (req, res) => {
//   const { name, about } = req.body;
//   User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
//     .then((user) => {
//       if (!user) {
//         res.status(404).send({ message: 'Пользователь по указанному _id не найден' });
//         return;
//       }
//       res.send(user);
//     })
//     .catch((error) => {
//       if (error.name === 'ValidationError') {
//         res.status(400).send({ message: 'Переданы некорректные данные при обновлении профиля' });
//       } else {
//         res.status(500).send({ message: 'На сервере произошла ошибка' });
//       }
//     });
// };

const updateUserProfile = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }
      res.send(user);
    })
    .catch(next);
};

// const getUserProfile = (req, res) => {
//   User.findById(req.user._id)
//     .then((user) => {
//       if (!user) {
//         res.status(404).send({ message: 'Пользователь по указанному _id не найден' });
//         return;
//       }
//       res.send(user);
//     })
//     .catch(() => res.status(500).send({ message: 'На сервере произошла ошибка' }));
// };

const getUserProfile = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }
      res.send(user);
    })
    .catch(next);
};

// const updateUserAvatar = (req, res) => {
//   const { avatar } = req.body;
//   User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
//     .then((user) => {
//       if (!user) {
//         res.status(404).send({ message: 'Пользователь по указанному _id не найден' });
//         return;
//       }
//       res.send(user);
//     })
//     .catch((error) => {
//       if (error.name === 'ValidationError') {
//         res.status(400).send({ message: 'Переданы некорректные данные при обновлении аватара' });
//       } else {
//         res.status(500).send({ message: 'На сервере произошла ошибка' });
//       }
//     });
// };

const updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }
      res.send(user);
    })
    .catch(next);
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  login,
  updateUserProfile,
  getUserProfile,
  updateUserAvatar,
};
