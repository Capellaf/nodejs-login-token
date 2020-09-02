const db = require('../database/db');
const bcrypt = require('bcrypt');

const newAluno = (object, res) => {
    db.query("SELECT * FROM aluno WHERE cpf = ?", [object.cpf],(err, results) => {
        if (err) {
            return res.status(500).send({error: err})
        }
        if (results.length > 0) {
            res.status(409).send({ message: "Cpf já cadastrado!"} )
        } else {
            db.query("SELECT * FROM aluno WHERE email = ?", [object.email],(err, results) => {
                if (err) {
                    return res.status(500).send({error: err})
                }
                if (results.length > 0) {
                    res.status(409).send({ message: "Email já cadastrado!"} )
                } else {
                    db.query("INSERT INTO aluno (nome, cpf, email, telefone, nivel, idturma) VALUES (?,?,?,?,?,?)", 
                    [
                        object.nome,
                        object.cpf,
                        object.email,
                        object.telefone,
                        object.nivel,
                        object.idturma
                    ], (err) => {
                        if (err) {
                            return res.status(400).send()
                        }
                        return res.status(201).send({
                            message: 'Aluno cadastrado com sucesso!',
                            userCriado: object.login
                        })
                    })
                }
            })
        }   
    })
}

module.exports = newAluno;