const express = require('express')
const { body } = require('express-validator')
const feedController = require('../controllers/feed')

const router = express.Router();

router.get('/posts', feedController.getPost)
router.post('/post',
  [
    // trim used to white space 
    body('title').trim().isLength({ min: 5 }),
    body('content').trim().isLength({ min: 5 })
  ], feedController.createPost)

router.get('/post/:postId', feedController.getSinglePost)

router.put(
  '/post/:postId',
  [
    body('title')
      .trim()
      .isLength({ min: 5 }),
    body('content')
      .trim()
      .isLength({ min: 5 })
  ],
  feedController.updatePost
);

module.exports = router