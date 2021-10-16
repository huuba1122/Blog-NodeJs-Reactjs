const express = require('express');
const router = express.Router();
const CommentController = require('../Controllers/Comment.controller');
const { verifyAccessToken } = require('../helpers/jwt_service');

router.post('/', verifyAccessToken, CommentController.create);
router.put('/', verifyAccessToken, CommentController.update);
router.delete('/:id', verifyAccessToken, CommentController.delete);
router.get('/:id', CommentController.getById);
router.get('/', CommentController.get);


module.exports = router;