'use strict';

const mongoose = require('mongoose');

const contactSchema = mongoose.Schema({
    nameFirst: String,
    nameLast: String,
    phoneNumber: String,
    email: String,
    address: String
});
const Contact = mongoose.model('Contact', contactSchema);

module.exports = {Contact};