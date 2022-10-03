const Admin = require('../models/admin');
const jwt = require('jsonwebtoken')

// signing up the admin
module.exports.signUp = async (req, res) => {
    try {
        // filter for name
        if (req.body.name.length < 3 || req.body.name.length > 30) {
            return res.status(400).json({
                message: 'Name Should be between min. 3 characters to max. 30 characters'
            })
        }
        var emailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        // filter for email  format
        if (!req.body.email.match(emailFormat)) {
            return res.status(400).json({
                message: 'Enter valid email-id'
            })
        }

        // find admin from emailid
        let admin = await Admin.findOne({
            email: req.body.email
        });
        // if found
        if (admin) {
            return res.status(400).send({
                message: "Admin already exists"
            });
        }
        // else
        let newAdmin = await Admin.create(req.body);
        return res.status(201).json({
            message: "Admin created successfully",
            newAdmin
        })
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            message: "Internal Server Error"
        })
    }
};

// logging in admin and generate jwt token for authentication
module.exports.createSession = async (req, res) => {
    try {
        // find admin from emailid
        let admin = await Admin.findOne({
            email: req.body.email
        });
        // compare password
        let storedPassword = await admin.comparePassword(req.body.password);
        // if invalid
        if (!admin || !storedPassword) {
            return res.status(422).json({
                message: "Invalid username and password",
            });
        }
        // else generate a token to admin
        let token = jwt.sign({
            _id: admin._id
        }, 'admin', {
            expiresIn: '60m'
        })
        // success message
        return res.status(200).json({
            success: true,
            message: `Sign in successful ${admin.name}`,
            token: token,
        });
    } catch (err) {
        console.log('xxxxxxxxxx', err);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
};