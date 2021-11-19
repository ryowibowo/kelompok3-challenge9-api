// import express router
const express = require('express');
const router = express.Router();

// import router
const auth = require('./auth');
const rps = require('./rps')
const update = require('./update')
const read = require('./read')
const forgot = require('./forgotPass')
// routes list
router.use('/auth', auth);
router.use('/rps',rps)
router.use('/', update)
router.use('/', read)
router.use('/', forgot)


module.exports = router;