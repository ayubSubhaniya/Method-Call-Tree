const express = require('express');
const router = require('express-promise-router')();

const serviceController = require('../controllers/service');

router.route('/')
    .get(serviceController.getAllServices)
    .post(serviceController.addService);

router.route('/:serviceId')
    .get(serviceController.getService)
    .put(serviceController.replaceService)
    .patch(serviceController.updateService);

module.exports = router;
