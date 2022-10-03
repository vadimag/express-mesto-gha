const { PORT = 3000 } = process.env;

const express = require('express');
const mongoose = require('mongoose');
const { celebrate, Joi } = require('celebrate');
const { errors } = require('celebrate');
const bodyParser = require('body-parser');
const routerUsers = require('./routes/users');
const routerCards = require('./routes/cards');
const {
  createUser,
  login,
} = require('./controllers/users');
const { auth } = require('./moddlewares/auth');
const NotFoundError = require('./errors/not-found-err');

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', {
// mongoose.connect('mongodb://192.168.125.111:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(bodyParser.json());

app.use('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), login);

app.use('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }).unknown(true),
}), createUser);

app.use(auth);
app.use('/users', routerUsers);
app.use('/cards', routerCards);

app.use(errors());

app.use((req, res, next) => {
  next(new NotFoundError('path not found'));
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  // console.log(err);
  res.status(statusCode).send({ message: statusCode === 500 ? 'На сервере произошла ошибка' : message });
});

app.listen(PORT);
