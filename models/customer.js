const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    phone_no: {
        type: Number,
        required: true,
        unique: true,
    },
    address: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    photo:{
        type:String
    }

}, {
    timestamps: true
})

const Customer = mongoose.model('Customer', customerSchema);

module.exports = Customer;