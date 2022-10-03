const express = require('express');
// using express router
const router = express.Router();

// route for admin
router.use('/admin',require('./admin'));

// for customer
router.use('/customer',require('./customer'));



module.exports = router;