const mysql = require('mysql');
const bcrypt = require('bcrypt');
const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const app = express();
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

const port = process.env.PORT || 5000;

const db = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
  });

const newUser = (object, res) => {
    db.query("SELECT * FROM users WHERE login = ?", [object.login],(err, results) => {
        if (err) {
            return res.status(500).send({error: err})
        }
        if (results.length > 0) {
            res.status(409).send({ message: "Usuário já cadastrado!"} )
        } else {
            bcrypt.hash (object.psw, 10, (errBcrypt, hash) => {
                if(errBcrypt) {
                    return res.status(500).send({error: errBcrypt})
                }
                db.query("INSERT INTO users (login, psw) VALUES (?, ?)",
            [
                object.login,
                hash 
            ],(err) => {
                if(err) {
                    return res.status(400).send()
                }
                return res.status(201).send({
                    message: 'Usuário criado com sucesso!',
                    userCriado: object.login
                })
            })
            })
        }
    })   
}

const login = (object, res) => {
    db.query("SELECT * FROM users WHERE login=?",
    [
        object.login
    ],(err, values) => {
        if(err) {
            return res.status(500).send({error: err})
        }
        if(values.length <1 || values == undefined) {
            return res.status(401).send("Falha na autenticação!")
        }
        bcrypt.compare(object.psw, values[0].psw, (err, result) => {
            if (err) {
                return res.status(401).send("Falha na autenticação!")
            }
            if (result) {
                const token = jwt.sign({
                    id_user: values[0].id,
                    login: values[0].login
                }, process.env.JWT_KEY, 
                {
                    expiresIn : "1h"
                })
                return res.status(200).send({ message: 'Autenticado com sucesso!', token: token})
            }
            return res.status(401).send("Falha na autenticação!") 
        })
    })
}

app.post('/newUser', (req, res) => {
    return newUser(req.body,res)
})

app.post('/login', (req, res) => {
    return login(req.body,res)
})

app.listen(port, () => console.log(`Listening on port ${port}`));