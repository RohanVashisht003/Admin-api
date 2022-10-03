const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const adminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

// encrypt password
adminSchema.pre('save', async function () {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
})

// match password
adminSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}
const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;