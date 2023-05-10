const mongoose = require("mongoose");

const Useraddress = mongoose.model(
    "Useraddress",
    new mongoose.Schema({
        address1: String,
        address2: String,
        city: String,
        zipcode: Number,
        userId:
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }

    })
);

module.exports = Useraddress;