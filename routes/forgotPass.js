const express = require('express');

const router = express.Router();

const forgot = require('../controller/forgotPass');

router.get('/forgot-password', forgot.getFrogotP);
router.post('/forgot-password', forgot.forgotP);
router.get('/reset-password/:id/:token', forgot.getResetP);
router.post('/reset-password/:id/:token', (forgot.resetP));

module.exports = router;
