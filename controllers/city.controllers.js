//create,find jevi method aama lakhvani ane export krvani je last ma route ma import karavani koi 1 variable ma
const db = require("../models");//db ma model store kravyu
const city = db.city;//city ma db store kravyu

exports.create = (req, res) => {
    // Validate request
    if (!req.body.name) {
        res.status(400).send({ message: "Content can not be empty!" });
        return;
    }

    // Create a city
    const City = new city({
        name: req.body.name,
        stateid: req.body.stateid,
    });

    // Save city in the database
    City
        .save(City)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the city."
            });
        });
};
exports.findAll = (req, res) => {
    city.find()
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

exports.delete = (req, res) => {
    const id = req.params.id;

    city.findByIdAndRemove(id)
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot delete city with id=${id}. Maybe city was not found!`
                });
            } else {
                res.send({
                    message: "city was deleted successfully!"
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete State with id=" + id
            });
        });
};

exports.deleteAll = (req, res) => {
    State.deleteMany({})
        .then(data => {
            res.send({
                message: `${data.deletedCount} States were deleted successfully!`
            });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while removing all States."
            });
        });
};

exports.update = (req, res) => {
    if (!req.body) {
        return res.status(400).send({
            message: "Data to update can not be empty!"
        });
    }

    const id = req.params.id;
    console.log(id);

    city.findByIdAndUpdate(id, req.body, { useFindAndModify: true })
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot update city with id=${id}. Maybe city was not found!`
                });
            } else res.send({ message: "city was updated successfully." });
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating city with id=" + id
            });
        });
};