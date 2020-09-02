const db = require('../database/db');
const bcrypt = require('bcrypt');

const newProf = (object, res) => {
    db.query("SELECT * FROM professor WHERE cpf = ?", [object.cpf],(err, results) => {
        if (err) {
            return res.status(500).send({error: err})
        }
        if (results.length > 0) {
            res.status(409).send({ message: "Cpf já cadastrado!"} )
        } else {
            db.query("SELECT * FROM professor WHERE email = ?", [object.email],(err, results) => {
                if (err) {
                    return res.status(500).send({error: err})
                }
                if (results.length > 0) {
                    res.status(409).send({ message: "Email já cadastrado!"} )
                } else {
                    db.query("INSERT INTO professor (nome, cpf, email, idturma) VALUES (?,?,?,?)", 
                    [
                        object.nome,
                        object.cpf,
                        object.email,
                        object.idturma
                    ], (err) => {
                        if (err) {
                            return res.status(400).send()
                        }
                        return res.status(201).send({
                            message: 'Professor cadastrado com sucesso!',
                            userCriado: object.login
                        })
                    })
                }
            })
        }   
    })
}

module.exports = newProf;