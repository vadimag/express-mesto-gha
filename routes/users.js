const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUsers,
  getUserById,
  updateUserProfile,
  getUserProfile,
  updateUserAvatar,
} = require('../controllers/users');
const { auth } = require('../moddlewares/auth');

router.use(auth);
router.get('/', getUsers);
router.get('/me', getUserProfile);
router.get('/:userId', getUserById);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), updateUserProfile);

router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required(),
  }),
}), updateUserAvatar);

module.exports = router;
