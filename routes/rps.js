// import express router
const express = require('express');

const router = express.Router();

// import controllers
const runRps = require('../controller/rps');
const restrict = require('../middlewares/restrict');

// routes list
router.post('/rps', restrict, runRps);

// export router
module.exports = router;
