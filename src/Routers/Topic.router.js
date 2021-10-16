const express = require('express');
const router = express.Router();
const { authPage } = require('../middleware/authPage');
const TopicController = require('../Controllers/Topic.controller');
const { verifyAccessToken } = require('../helpers/jwt_service');


router.post('/', verifyAccessToken, authPage(['ADMIN']), TopicController.create);
router.delete('/:id',verifyAccessToken, authPage(['ADMIN']), TopicController.delete);
router.get('/', TopicController.getAll);

module.exports = router;