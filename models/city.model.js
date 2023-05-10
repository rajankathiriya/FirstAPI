//data base ma je key ni jrur hoy a key lakhvani and table nu name j bnavvu hoy a lakhvanu
module.exports = mongoose => {
    const City = mongoose.model(
        "city",
        mongoose.Schema(
            {
                name: String,
                stateid: String
            },
            { timestamps: true }
        )
    );

    return City;
};