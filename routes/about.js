const { renderAbout } = require('../controllers/about')
const express = require('express');
const router = express.Router();

router.route('/')
    .get(renderAbout);

module.exports = router;