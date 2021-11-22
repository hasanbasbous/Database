const express = require('express');
const authController = require('../controllers/auth');
const searchController = require('../controllers/search');
const tripsController = require('../controllers/trips')
// const loginController = require('../controllers/login')

const router = express.Router();

router.post('/register', authController.register)
router.post('/search', searchController.search)
router.post('/trips', tripsController.display)
// router.post('/login', loginController)



module.exports = router;