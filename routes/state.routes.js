//koi 1 variable ma aakhu co ntrollor store kravi devanu ane ane get ma ane post ma variablename.controllorexport(var)

module.exports = app => {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });
    const state = require("../controllers/state.controller");//full contoller shital ma import kravyu


    var router = require("express").Router();//router ma express.js import kravyu
    const authJwt = require("../middlewares/authJwt");

    router.post("/", state.create);//state.create ma je create(method) che a controller ma thi lai aavya
    // router.get("", [authJwt.verifyToken, authJwt.isAdmin], state.findAll);//state.findAll ma je findAll(method) che a controller ma thi lai aavya
    router.get("", state.findAll);//state.findAll ma je findAll(method) che a controller ma thi lai aavya
    router.delete("/:id", state.delete);
    router.delete("/", state.deleteAll);
    router.put("/:id", state.update);



    app.use('/api/state', router);//je api bane a last ma aapnu je server hoy tya aa last ma lahvanu

}