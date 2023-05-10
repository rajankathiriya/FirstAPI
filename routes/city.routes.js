//koi 1 variable ma aakhu co ntrollor store kravi devanu ane ane get ma ane post ma variablename.controllorexport(var)

module.exports = app => {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });
    const city = require("../controllers/city.controllers");//full contoller shital ma import kravyu
    const authJwt = require("../middlewares/authJwt");
    var router = require("express").Router();//router ma express.js import kravyu


    router.post("/", city.create);//city.create ma je create(method) che a controller ma thi lai aavya
    router.get("", [authJwt.verifyToken, authJwt.isAdmin], city.findAll);//city.findAll ma je findAll(method) che a controller ma thi lai aavya
    router.delete("/:id", city.delete);
    router.delete("/", city.deleteAll);
    router.put("/:id", city.update);


    app.use('/api/city', router);//je api bane a last ma aapnu je server hoy tya aa last ma lahvanu

}