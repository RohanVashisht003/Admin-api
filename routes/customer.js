const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customer_controller');


// register customer
router.post('/register', customerController.register);
// upload customer photo
router.post('/:id/upload', customerController.upload);



module.exports = router;