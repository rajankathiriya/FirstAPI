const mongoose = require("mongoose");

const User = mongoose.model(
    "User",
    new mongoose.Schema({
        // _id: mongoose.Schema.Types.ObjectId,
        firstname: String,
        lastname: String,
        phone: Number,
        email: String,
        password: String,
        confirmpassword: String,
        roles: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Role"
            }
        ]
    })
);

module.exports = User;