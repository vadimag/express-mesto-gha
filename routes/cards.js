const router = require('express').Router();
const {
  getCards,
  createCard,
  delCardById,
  addCardLike,
  delCardLike,
} = require('../controllers/cards');

router.get('/', getCards);
router.post('/', createCard);
router.delete('/:cardId', delCardById);
router.put('/:cardId/likes', addCardLike);
router.delete('/:cardId/likes', delCardLike);

module.exports = router;
