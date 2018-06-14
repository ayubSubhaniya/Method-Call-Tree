const express = require('express');
const router = require('express-promise-router')();

const userController = require('../controllers/user');

router.route('/')
    .get(userController.getAllUsers)
    .post(userController.addUser);

router.route('/:userId')
    .get(userController.getUser)
    .put(userController.replaceUser)
    .patch(userController.updateUser);

router.route('/:userId/orders')
    .get(userController.getAllOrders);

module.exports = router;
