const Card = require('../models/card');
const BadRequestError = require('../errors/bad-request-err');
const NotFoundError = require('../errors/not-found-err');
const ForbiddenError = require('../errors/forbidden_err');

// const getCards = (req, res) => {
//   Card.find()
//     .then((cards) => {
//       res.send(cards);
//     })
//     .catch(() => {
//       res.status(500).send({ message: 'На сервере произошла ошибка' });
//     });
// };

const getCards = (req, res, next) => {
  Card.find()
    .then((cards) => {
      res.send(cards);
    })
    .catch(next);
};

// const createCard = (req, res) => {
//   const { name, link } = req.body;
//   Card.create({ name, link, owner: req.user._id })
//     .then((card) => {
//       res.send(card);
//     })
//     .catch((error) => {
//       if (error.name === 'ValidationError') {
//         res.status(400).send({ message: 'Переданы некорректные данные при создании карточки' });
//       } else {
//         res.status(500).send({ message: 'На сервере произошла ошибка' });
//       }
//     });
// };

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      res.send(card);
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при создании карточки'));
      } else {
        next(error);
      }
    });
};

const delCardById = (req, res, next) => {
  Card.findOne({ _id: req.params.cardId })
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка не найдена');
      }
      if (card.owner.toString() !== req.user._id.toString()) {
        throw new ForbiddenError('Удаление запрещено!');
      }
      Card.findOneAndDelete({ _id: card._id })
        .then((deletedCard) => {
          res.send(deletedCard);
        });
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные для удаления карточки'));
      } else {
        next(error);
      }
    });
};

const addCardLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка не найдена');
      }
      res.send(card);
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные карточки'));
      } else {
        next(error);
      }
    });
};

const delCardLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка не найдена');
      }
      res.send(card);
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные карточки'));
      } else {
        next(error);
      }
    });
};

module.exports = {
  createCard,
  getCards,
  delCardById,
  addCardLike,
  delCardLike,
};
