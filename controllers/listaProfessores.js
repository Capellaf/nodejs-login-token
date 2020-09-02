const db = require('../database/db');

const listaProfessores = (object, res) => {
    let filter = '';
    if(object.nome) filter = ' WHERE INSTR (nome, "'+ object.nome +'")'
    db.query('SELECT * FROM professor' + filter +';', (err, rows) => {
    if (err) {
      return res.status(400).send("Falha ao listar professores!")
    }
    res.json(rows);
  })
}

module.exports = listaProfessores;