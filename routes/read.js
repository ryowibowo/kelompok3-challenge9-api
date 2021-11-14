const express = require('express');
const router = express.Router();
const restrict = require('../middlewares/restrict')
const read = require('../controller/read')


router.get('/infoPlayer',restrict, read.read)

module.exports = router;