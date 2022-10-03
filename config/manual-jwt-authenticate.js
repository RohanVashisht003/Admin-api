const Admin = require('../models/admin');
const jwt = require('jsonwebtoken');

// checking the authorization 
checkAuthentication = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
// if no token found
    if (!token) {
        console.log("Token not found/TokenError");
        return res.status(401).json({
            success: false,
            message: "You are not authorized"
        });
    }

    try {
        const decrypted = jwt.verify(token, 'admin');
        req.admin = await Admin.findById(decrypted._id);
        next();
    } catch (err) {
        console.log(err);
        return res.status(401).json({
            success: false,
            message: "Unauthroized access"
        });
    }
}

module.exports = checkAuthentication;