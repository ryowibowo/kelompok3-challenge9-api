const express = require('express');
const router = express.Router();
const restrict = require('../middlewares/restrict')

const update = require('../controller/update')


router.post('/update/',restrict, update.postUpdate)
// router.get('/update/', update.getUpdate)

module.exports = router;