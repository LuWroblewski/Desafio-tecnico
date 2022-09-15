require("dotenv").config();
const router = require('express').Router()
const bcrypt = require('bcrypt');
const express = require('express');
const jwt = require("jsonwebtoken");

const userModel = require('../models/models.js');
//se for 2 ou mais => const { x, y} = require('../models/models.js')



router.get("/user/:id", checkToken, async (req, res) => {

    const id = req.params.id

    const userExist = await userModel.findById(id, '-senha')
    if (!userExist) return res.status(404).json({ message: 'Usuario não encontrado. Tente novamente' })
    res.status(200).json({ userExist })
})
function checkToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(" ")[1]
    if (!token) return res.status(401).json({ message: 'Acesso negado' })

    try {
        const secret = process.env.SECRET
        jwt.verify(token, secret)
        next()
    } catch (error) {
        res.status(400).json({ message: 'error' })

    }
}


//Registro do usuario
router.use(express.json())
router.post("/auth/register", async (req, res) => {

    const { nome, idade, email, senha, tipoUser } = req.body



    const userExist = await userModel.findOne({ email: email })
    if (userExist) return res.status(422).json({ message: 'use outro email,este já esta sendo usado' })


    const salt = await bcrypt.genSalt(12)
    const passwordHash = await bcrypt.hash(senha, salt)
    const userRoute = new userModel({
        nome,
        idade,
        email,
        senha: passwordHash,
        tipoUser
    })

    try {
        await userRoute.save()
        res.status(201).json({ message: 'Post realizado com sucesso' })
    } catch (error) {
        res.status(500).json({ error: error })

    }

});

//login do usuario

router.post("/auth/login", async (req, res) => {

    const { email, senha } = req.body;

    //check user
    const userExist = await userModel.findOne({ email: email })
    if (!userExist) return res.status(404).json({ message: 'Usuario não encontrado. Tente novamente' })

    //check senha

    const checkSenha = await bcrypt.compare(senha, userExist.senha)
    if (!checkSenha) return res.status(404).json({ message: 'Senha invalida' })

    try {
        const secret = process.env.SECRET
        const token = jwt.sign({
            id: userExist._id,
        },
            secret,
        )
        res.status(200).json({ message: 'Login realizado com sucesso', token })


    } catch (error) {
        res.status(500).json({ error: error })

    }

});



//search

router.get('/:email', async (req, res) => {
    const email = req.params.email

    try {
        const userExist = await userModel.findOne({ email: email }, '-senha')
        if (!userExist) return res.status(404).json({ message: 'Usuario não encontrado. Tente novamente' })

        res.status(200).json(userExist)
    } catch (error) {
        res.status(500).json({ error: error })
    }

})

//update

router.patch('/:email', async (req, res) => {
    const emailUpdate = req.params.email

    const { nome, idade, email, tipoUser } = req.body

    const userRoute = {
        nome,
        idade,
        email,
        tipoUser
    }

    try {
        const updateUser = await userModel.updateOne({ email: emailUpdate }, userRoute)
        res.status(200).json(userRoute)

        if (updateUser.matchedCount === 0) {
            res.status(422).json({ message: 'não realizado' })
            return;
        }
    } catch (error) {
        res.status(500).json({ error: error })
    }

})


//delete

router.delete('/:email', async (req, res) => {
    const emailUpdate = req.params.email

    const userExist = await userModel.findOne({ email: emailUpdate })

    if (!userExist) {
        res.status(422).json({ message: 'Id não encontrado' })
        return;
    }
    try {
        await userModel.deleteOne({ email: emailUpdate })
        res.status(200).json({ message: 'delete feito com sucesso' })


    } catch (error) {
        res.status(500).json({ error: error })

    }



})

module.exports = router