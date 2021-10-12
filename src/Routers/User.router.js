const express = require('express');
const router = express.Router();
const { verifyAccessToken } = require('../helpers/jwt_service');
const { authPage } = require('../middleware/authPage');


const UserController = require('../Controllers/User.controller');


router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.post('/logout', UserController.logout);
router.post('/refresh-token', UserController.refreshToken);
router.get('/', verifyAccessToken, authPage(['ADMIN']), UserController.getAll);

module.exports = router;

