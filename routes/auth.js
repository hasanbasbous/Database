const express = require('express');
const authController = require('../controllers/auth');
const searchController = require('../controllers/search');

const router = express.Router();

router.post('/register', authController.register)
router.post('/search', searchController.search)


module.exports = router;