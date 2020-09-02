const express = require('express');
const bodyParser = require('body-parser');

const auth = require('./middleware/login');
const login = require('./controllers/login');
const newUser = require('./controllers/newUser');
const listaAlunos = require('./controllers/listaAlunos');
const listaProfessores = require('./controllers/listaProfessores');
const newProf = require('./controllers/newProf');
const newAluno = require('./controllers/newAluno');

const app = express();
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

const port = process.env.PORT || 5000;

app.post('/newUser', auth, (req, res) => {
    return newUser(req.body,res)
})

app.post('/login', (req, res) => {
    return login(req.body,res)
})

app.get('/listaAlunos/:nome?', (req, res) => {
    return listaAlunos(req.params,res)
})

app.get('/listaProfessores/:nome?', (req, res) => {
    return listaProfessores(req.params,res)
})

app.post('/newProf', auth, (req, res) => {
    return newProf(req.body,res)
})

app.post('/newAluno', auth, (req, res) => {
    return newAluno(req.body,res)
})

app.listen(port, () => console.log(`Listening on port ${port}`));