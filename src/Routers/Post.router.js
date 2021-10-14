const express = require('express');
const router = express.Router();
const { verifyAccessToken } = require('../helpers/jwt_service');
const { authPage } = require('../middleware/authPage');
const uploadMulter = require('../helpers/upload_file');


const PostController = require('../Controllers/Post.controller');

router.post('/upload-file', uploadMulter.single('file'), PostController.uploadFile);
// router.put('/:id',verifyAccessToken, PostController.update);
// router.get('/:id',verifyAccessToken, PostController.getById);
// router.get('/', verifyAccessToken, authPage(['ADMIN']), PostController.getAll);

module.exports = router;

