const express = require('express');
const route = express.Router();
const userController = require('../controllers/users');

route.get('/user/:no_of_users', userController.exportUserDetails)

module.exports = route;