// import express router
const express = require('express');
const router = express.Router();

// import router
const auth = require('./auth');
const rps = require('./rps')
const update = require('./update')
const read = require('./read')
// routes list
router.use('/auth', auth);
router.use('/rps',rps)
router.use('/', update)
router.use('/', read)

module.exports = router;