
// ==============================================================================
const express = require("express");
const cors = require("cors");
const expressValidator = require('express-validator')
const fs = require('fs');

const app = express();

// import library and files(swaggerUi)
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const customCss = fs.readFileSync((process.cwd() + "/swagger.css"), 'utf8');


global.__basedir = __dirname;

// =========================================================================
//react na localhost sathe connect krva mate
var corsOptions = {
    origin: "http://localhost:3000"
};
// =========================================================================

// =========================================================================
//server ne mongoos sathe connect krva mate
const db = require("./models");
const errorHandler = require("./middlewares/errorHandler");
db.mongoose.connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log("Connected to the database!");
        // initial();
    })
    .catch(err => {
        console.log("Cannot connect to the database!", err);
        process.exit();
    });
app.use(cors(corsOptions));

// function initial() {
//     Role.estimatedDocumentCount((err, count) => {
//         if (!err && count === 0) {
//             new Role({
//                 name: "user"
//             }).save(err => {
//                 if (err) {
//                     console.log("error", err);
//                 }

//                 console.log("added 'user' to roles collection");
//             });

//             new Role({
//                 name: "moderator"
//             }).save(err => {
//                 if (err) {
//                     console.log("error", err);
//                 }

//                 console.log("added 'moderator' to roles collection");
//             });

//             new Role({
//                 name: "admin"
//             }).save(err => {
//                 if (err) {
//                     console.log("error", err);
//                 }

//                 console.log("added 'admin' to roles collection");
//             });
//         }
//     });
// }
// =========================================================================

// parse requests of content-type - application/json
app.use(express.json());
app.use(expressValidator());

// let express to use this(swaggerUi)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, { customCss }));


// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// =========================================================================
//routes mathi app import kravyu(route import)
require("./routes/state.routes")(app);
require("./routes/city.routes")(app);
require("./routes/auth.routes")(app);
require("./routes/file.routes")(app);
// =========================================================================
// ========================ERROR========================
app.use(errorHandler);

// simple route
app.get("/", (req, res) => {
    res.json({ message: "Welcome to Food Delivery application." });
});



const PORT = process.env.PORT || 2222;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});