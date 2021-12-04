const express = require('express');
const authController = require('../controllers/auth');
const searchController = require('../controllers/search');
const tripsController = require('../controllers/trips')
const loginController = require('../controllers/login')
const shareController = require('../controllers/share')

const userEditController = require('../controllers/userEdit');
const carController = require('../controllers/car');

const router = express.Router();

router.post('/register', authController.register)
router.post('/search', searchController.search)
router.post('/trips', tripsController.display)
router.post('/login', loginController.login)
router.post('/share', shareController.share)

router.post('/userEdit', userEditController.userEdit)
router.post('/car', carController.car)



module.exports = router;