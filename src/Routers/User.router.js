const express = require('express');
const router = express.Router();
const { verifyAccessToken } = require('../helpers/jwt_service');
const { authPage } = require('../middleware/authPage');
const uploadMulter = require('../helpers/upload_file');


const UserController = require('../Controllers/User.controller');

router.post('/update-avatar/:id',verifyAccessToken, uploadMulter.single('avatar'), UserController.updateAvatar);
router.put('/:id',verifyAccessToken, UserController.update);
router.get('/:id',verifyAccessToken, UserController.getById);
router.get('/', verifyAccessToken, authPage(['ADMIN']), UserController.getAll);

module.exports = router;

