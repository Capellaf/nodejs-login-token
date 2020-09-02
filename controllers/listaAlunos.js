const db = require('../database/db');

const listaAlunos = (object, res) => {
    let filter = '';
    if(object.nome) filter = ' WHERE INSTR (nome, "'+ object.nome +'")'
    db.query('SELECT * FROM aluno' + filter +';', (err, rows) => {
    if (err) {
      return res.status(400).send("Falha ao listar alunos!")
    }
    res.json(rows);
  })
}

module.exports = listaAlunos;