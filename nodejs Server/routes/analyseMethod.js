const express = require('express');
const router = require('express-promise-router')();

const analyseMethodController = require('../controllers/analyseMethod');

router.route('/')
    .put(analyseMethodController.analyseMethod);

module.exports = router;
