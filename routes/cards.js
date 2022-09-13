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

router.use((req, res) => {
  res.status(400).send({ message: 'указан неправильный путь' });
});

module.exports = router;
