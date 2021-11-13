// import express router
const express = require('express');
const router = express.Router();

// import router
const auth = require('./auth');

// routes list
router.use('/auth', auth);

module.exports = router;