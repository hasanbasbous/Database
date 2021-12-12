const express = require('express');
const authController = require('../controllers/auth');
const searchController = require('../controllers/search');
const tripsController = require('../controllers/trips')
const loginController = require('../controllers/login')
const shareController = require('../controllers/share')
const carEditController = require('../controllers/carEdit');

const userEditController = require('../controllers/userEdit');
const carController = require('../controllers/car');

const feedbackController = require('../controllers/feedback');

const viewPassengersController = require('../controllers/viewPassenger');

const router = express.Router();

router.post('/register', authController.register)
router.post('/search', searchController.search)
router.post('/trips', tripsController.display)
router.post('/login', loginController.login)
router.post('/share', shareController.share)

router.post('/userEdit', userEditController.userEdit)
router.post('/car', carController.car)

router.post('/bookingcancel', tripsController.bookingcancel)
router.post('/tripcancel', tripsController.tripcancel)

router.post('/carEdit', carEditController.carEdit)
router.post('/carEdit2', carEditController.carEdit2)

router.post('/feedback', feedbackController.feedback)
router.post('/sendfeedback', feedbackController.sendfeedback)

router.post('/tripviewPassengers', viewPassengersController.displayPassengers)


module.exports = router;