const mongoose = require("mongoose");


const userSchema = new mongoose.Schema({
    nome: String,
    idade: String,
    email: String,
    senha: String,
    tipoUser: String
});

const userModel = mongoose.model("user", userSchema);

module.exports = userModel
