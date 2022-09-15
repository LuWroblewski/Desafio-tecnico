const express = require('express');
const mongoose = require("mongoose");
require("dotenv").config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express()
const cors = require('cors')

app.use(cors())

app.use(

    express.urlencoded({
        extended: true

    })
)
app.use(express.json())

//rota da API
const Routes = require('../routes/routes.js')


app.use('/', Routes)


//rota inicial
app.get('/', (req, res) => {

    res.json({ message: 'bem vindo' })

})

//conexão
const username = process.env.DB_USER;
const password = process.env.DB_PASS;
const cluster = " ";
const dbname = "user";

mongoose.connect(
    `mongodb+srv://${username}:${password}@${cluster}.mongodb.net/${dbname}?retryWrites=true&w=majority`
)


    .then(() => {
        console.log("conectado")
        app.listen(3000)
    })
    .catch((err) => console.log(err))
