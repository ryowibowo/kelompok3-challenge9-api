const express = require('express');

const router = express.Router();
const restrict = require('../middlewares/restrict');
const read = require('../controller/read');

router.get('/infoPlayer/:id', read.read);
router.get('/infoPlayer/', read.readAll);

module.exports = router;
