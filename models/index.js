const dbConfig = require("../config/db.config");

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
const mongoosePaginate = require('mongoose-paginate-v2');

const db = {};
db.mongoose = mongoose, mongoosePaginate;
db.url = dbConfig.url;
db.state = require("./state.model")(mongoose);
db.city = require("./city.model");
db.user = require("./user.model");
db.useraddress = require("./userAddress.model");
db.role = require("./role.model");
db.ROLES = ["user", "admin", "moderator"];

module.exports = db;