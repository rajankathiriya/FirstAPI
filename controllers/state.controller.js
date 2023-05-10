//create,find jevi method aama lakhvani ane export krvani je last ma route ma import karavani koi 1 variable ma
const db = require("../models");//db ma model store kravyu
const State = db.state;//State ma db store kravyu

exports.create = (req, res) => {
    // Validate request
    if (!req.body.name) {
        res.status(400).send({ message: "Content can not be empty!" });
        return;
    }


    // Create a State
    const state = new State({
        name: req.body.name,
    });

    // Save State in the database
    state
        .save(state)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the State."
            });
        });
};
exports.findAll = (req, res) => {
    // ERROR++++++++++++
    // let a = "dahdashdgh";
    // let b = a.toFixed()
    State.find()
        .then((data) => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving States."
            });
        });
};

exports.delete = (req, res) => {
    const id = req.params.id;

    State.findByIdAndRemove(id)
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot delete State with id=${id}. Maybe State was not found!`
                });
            } else {
                res.send({
                    message: "State was deleted successfully!"
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

    State.findByIdAndUpdate(id, req.body, { useFindAndModify: true })
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot update State with id=${id}. Maybe State was not found!`
                });
            } else res.send({ message: "State was updated successfully." });
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating State with id=" + id
            });
        });
};