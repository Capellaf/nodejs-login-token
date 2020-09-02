const db = require('../database/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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

module.exports = login;