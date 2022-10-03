const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin_controller');
const customerController = require('../controllers/customer_controller');
const checkAuthentication = require('../config/manual-jwt-authenticate');

// admin register
router.post('/register', adminController.signUp);
// admin login
router.post('/login', adminController.createSession);


// get data of particular customer
router.get('/:id/check', checkAuthentication, customerController.showData);
// get data on particular date
router.get('/onDate', checkAuthentication, customerController.dateFilter);

module.exports = router;