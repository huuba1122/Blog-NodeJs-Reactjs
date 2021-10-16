const express = require('express');
const router = express.Router();
const { authPage } = require('../middleware/authPage');
const TagController = require('../Controllers/Tag.controller');
const { verifyAccessToken } = require('../helpers/jwt_service');


router.post('/', verifyAccessToken, authPage(['ADMIN']), TagController.create);
router.delete('/:id', verifyAccessToken, authPage(['ADMIN']), TagController.delete);
router.get('/', TagController.getAll);

module.exports = router;
