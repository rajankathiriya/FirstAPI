const config = require("../config/auth.config");
const db = require("../models");
var bcrypt = require("bcryptjs");
const User = db.user;
const Useraddress = db.useraddress;
const Role = db.role;
var jwt = require("jsonwebtoken");
const { body } = require('express-validator/check')

exports.validate = (method) => {
    switch (method) {
        case 'signup': {
            return [
                body("firstname", "firstname does not exists").exists().isLength({ min: 5, max: 20 }),
                body("lastname", "lastname does not exists").exists().isLength({ min: 5, max: 20 }),
                body("phone").optional().isInt().isInt(),
                body('email', 'Invalid email').exists().isEmail().custom(async (value) => {
                    const user = await User.findOne({ email: value });
                    if (user) {
                        throw new Error('Email already exists');
                    }
                    return true;
                }),
                body("password", "password does not exists").exists(),
                body("confirmpassword", "confirmpassword does not match").custom((value, { req }) => {
                    if (value !== req.body.password) {
                        throw new Error("Password Dose not match")
                    } else {
                        return true
                    }
                })
            ];
        }
    }
};
const { validationResult } = require('express-validator/check');

exports.signup = (req, res) => {

    const user = new User({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        phone: req.body.phone,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8),
        confirmpassword: bcrypt.hashSync(req.body.confirmpassword, 8)
    });

    user.save(user).then(y => {
        const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions

        if (!errors.isEmpty()) {
            res.status(422).json({ errors: errors.array() });
            return;
        }
        var nodemailer = require('nodemailer');

        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'rkofficial2512@gmail.com',
                pass: 'dvzdgifqvbrrgrzy'
            }
        });

        var mailOptions = {
            from: 'rkofficial2512@gmail.com',
            to: req.body.email,
            subject: 'Sending Email using Node.js',
            text: 'That was easy!'
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });

        if (req.body.roles) {

            Role.find({ name: { $in: req.body.roles } }).then((roles) => {
                user.roles = roles.map(role => role._id);
                user.save(user).then(err => {
                    if (err) {
                        res.status(500).send({ message: err });
                        return;
                    }
                    res.send({ message: "User was registered successfully!" });
                });
            })
        }
        else {
            Role.findOne({ name: "user" }).then((role) => {
                console.log(role);
                user.roles = [role._id];
                user.save().then(err => {
                    if (err) {
                        res.status(500).send({ message: err });
                        return;
                    }
                    res.send({ message: "User was registered successfully!" });
                })
            })
        }
    })
}

exports.signupWithTransaction = async (req, res) => {

    const user = new User({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        phone: req.body.phone,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8),
        confirmpassword: bcrypt.hashSync(req.body.confirmpassword, 8)
    });
    try {
        const session = await db.mongoose.connection.startSession();
        await session.withTransaction(async () => {
            const userAddress = new Useraddress({
                address1: req.body.address1,
                address2: req.body.address2,
                city: req.body.city,
                zipcode: req.body.zipcode,
                userId: user.id

            });
            await user.save(user, session).then(y => {

                var nodemailer = require('nodemailer');

                var transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: 'rkofficial2512@gmail.com',
                        pass: 'dvzdgifqvbrrgrzy'
                    }
                });

                var mailOptions = {
                    from: 'rkofficial2512@gmail.com',
                    to: req.body.email,
                    subject: 'Sending Email using Node.js/Transaction',
                    text: 'That is Transaction example!'
                };

                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Email sent: ' + info.response);
                    }
                });

                if (req.body.roles) {

                    Role.find({ name: { $in: req.body.roles } }).then((roles) => {
                        user.roles = roles.map(role => role._id);
                        user.save(user).then(err => {
                            if (err) {
                                res.status(500).send({ message: err });
                                return;
                            }
                            res.send({ message: "User was registered successfully!" });
                        });
                    })
                }
                else {
                    Role.findOne({ name: "user" }).then((role) => {
                        console.log(role);
                        user.roles = [role._id];
                        user.save().then(err => {
                            if (err) {
                                res.status(500).send({ message: err });
                                return;
                            }
                            res.send({ message: "User was registered successfully!" });
                        })
                    })
                }
            })
            await userAddress.save(userAddress, session);
        });
        await session.endSession();

        console.log('success');
    } catch (error) {
        console.log(error);
    }
};




exports.signin = (req, res) => {
    User.findOne({
        username: req.body.username
    })
        .populate("roles", "-__v")
        .exec().then((user) => {


            if (!user) {
                return res.status(404).send({ message: "User Not found." });
            }

            var passwordIsValid = bcrypt.compareSync(
                req.body.password,
                user.password
            );

            if (!passwordIsValid) {
                return res.status(401).send({
                    accessToken: null,
                    message: "Invalid Password!"
                });
            }

            var token = jwt.sign({ id: user.id }, config.secret, {
                expiresIn: 86400 // 24 hours
            });

            var authorities = [];

            for (let i = 0; i < user.roles.length; i++) {
                authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
            }
            res.status(200).send({
                id: user._id,
                username: user.username,
                email: user.email,
                roles: authorities,
                accessToken: token
            });
        });
};

exports.findAll = (req, res) => {
    User.find()
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving citys."
            });
        });
};