//data base ma je key ni jrur hoy a key lakhvani and table nu name j bnavvu hoy a lakhvanu
module.exports = mongoose => {
    const State = mongoose.model(
        "state",
        mongoose.Schema(
            {
                name: String
            },
            { timestamps: true }
        )
    );

    return State;
};