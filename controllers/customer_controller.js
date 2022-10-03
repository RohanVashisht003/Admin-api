const Customer = require('../models/customer');
const multer = require('../config/multer-config');
const fs = require('fs');
const path = require('path');

// register customer
module.exports.register = async (req, res) => {
    try {
        // filter for phone number
        if (req.body.phone_no.length < 10 || req.body.phone_no.length > 10) {
            return res.status(400).json({
                message: 'Enter 10 digit number'
            })
        }
        // filter for name
        if (req.body.name.length < 3 || req.body.name.length > 30) {
            return res.status(400).json({
                message: 'Name should be between min. 3 characters to max. 30 characters'
            })
        }
        // filter for address
        if (req.body.address.length > 50) {
            return res.status(400).json({
                message: 'Address should be max 50 characters'
            })
        }

        var emailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        // filter for email  format
        if (!req.body.email.match(emailFormat)) {
            return res.status(400).json({
                message: 'Enter valid email-id'
            })
        }
        // find customer from phone number
        let customer = await Customer.findOne({
            phone_no: req.body.phone_no
        });

        // if found
        if (customer) {
            return res.status(200).json({
                message: "Customer Already Exists",
                customer: customer,
            })
        }
        // else
        let newCustomer = await Customer.create(req.body);

        // success message
        return res.status(201).json({
            message: 'Customer registered successfully',
            newCustomer: newCustomer
        })

    } catch (err) {
        return res.status(500).json({
            message: "Internal server error"
        })
    }
}

// show data of particular customer
module.exports.showData = async (req, res) => {
    try {
        // find customer from id
        var customer = await Customer.findById(req.params.id);
        // if not found
        if (!customer) {
            return res.status(400).json({
                message: 'Customer does not exist'
            })
        }
        // else
        return res.status(200).json({
            message: 'Customer details',
            customer: customer
        })
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            success: false
        })
    }

}

// filter by date of registration
module.exports.dateFilter = async (req, res) => {
    try {
        let startDate = (new Date(req.body.date));
        let date = new Date()
        let endDate = new Date(date.setDate(startDate.getDate() + 1))

        // find customer(s) from date
        var customerArr = await Customer.find({
            createdAt: {
                $gt: startDate,
                $lt: endDate
            }
        });
        // if no customer found
        if (customerArr.length === 0) {
            return res.status(400).json({
                message: 'Customer does not exist'
            })
        }
        // else
        return res.status(200).json({
            message: 'Customer(s) found',
            customer: customerArr
        })

    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            success: false
        })
    }
}

// upload customer image
module.exports.upload = async (req, res) => {
    try {
        // find customer from id
        var customer = await Customer.findById(req.params.id);
        // if not found
        if (!customer) {
            return res.status(400).json({
                message: 'Customer does not exist'
            })
        }
        // using multer for handling files
        await multer(req, res);
        // if no file is attached
        if (req.file == undefined) {
            return res.status(400).send({
                message: "Please upload a file!"
            });
        }
        // if any old customer is present then remove that
        if (customer.photo) {
            fs.unlinkSync(path.join(__dirname, '..', customer.photo));
        }
        // upload new file data to mongodb
        customer.photo = '/uploads/customers' + '/' + req.file.filename;
        customer.save();
        // success message
        return res.status(200).send({
            message: "Uploaded the file successfully: " + req.file.originalname,
        });
    } catch (err) {
        // if file size exceeds
        if (err.code == "LIMIT_FILE_SIZE") {
            return res.status(500).send({
                message: "File size cannot be larger than 5MB!",
            });
        }
        return res.status(500).send({
            message: `Could not upload the file`,
        });
    }
};