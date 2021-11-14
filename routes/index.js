// import express router
const express = require('express');
const router = express.Router();

// import router
const auth = require('./auth');
const rps = require('./rps')

// routes list
router.use('/auth', auth);
router.use('/rps',rps)

module.exports = router;