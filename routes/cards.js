const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getCards,
  createCard,
  delCardById,
  addCardLike,
  delCardLike,
} = require('../controllers/cards');

router.get('/', getCards);

router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().min(4),
  }),
}), createCard);

router.delete('/:cardId', delCardById);
router.put('/:cardId/likes', addCardLike);
router.delete('/:cardId/likes', delCardLike);

module.exports = router;
