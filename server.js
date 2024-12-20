const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Conexão com o banco de dados SQLite
const db = new sqlite3.Database(':memory:');

db.serialize(() => {
    db.run("CREATE TABLE moradores (id INTEGER PRIMARY KEY AUTOINCREMENT, nomeCompleto TEXT, nomeRua TEXT, numeroCasa TEXT, telefone TEXT, cpf TEXT UNIQUE)");
    db.run("CREATE TABLE pagamentos (id INTEGER PRIMARY KEY AUTOINCREMENT, moradorId INTEGER, dataPagamento TEXT, status TEXT, FOREIGN KEY(moradorId) REFERENCES moradores(id))");
});

// Rota para cadastrar morador
app.post('/cadastrar', (req, res) => {
    const { nomeCompleto, nomeRua, numeroCasa, telefone, cpf } = req.body;
    db.run("INSERT INTO moradores (nomeCompleto, nomeRua, numeroCasa, telefone, cpf) VALUES (?, ?, ?, ?, ?)", [nomeCompleto, nomeRua, numeroCasa, telefone, cpf], function(err) {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json({ id: this.lastID });
    });
});

// Rota para login
app.post('/login', (req, res) => {
    const { cpf } = req.body;
    db.get("SELECT * FROM moradores WHERE cpf = ?", [cpf], (err, row) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        if (!row) {
            return res.status(404).json({ error: "Morador não encontrado" });
        }
        res.json({ morador: row });
    });
});

// Rota para verificar status de pagamento
app.get('/status/:moradorId', (req, res) => {
    const { moradorId } = req.params;
    db.all("SELECT * FROM pagamentos WHERE moradorId = ?", [moradorId], (err, rows) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json({ pagamentos: rows });
    });
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
