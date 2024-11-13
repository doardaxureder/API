const express = require('express');
const bodyParser = require('body-parser');
const proprietariosRoutes = require('./routes/proprietariosRoutes');
const produtosRoutes = require('./routes/produtosRoutes');

const app = express();
const port = 3002;

app.use(bodyParser.json());
app.use(express.static('public'));
app.use('/api/proprietarios', proprietariosRoutes);
app.use('/api/produtos', produtosRoutes);

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});