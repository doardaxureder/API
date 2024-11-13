const express = require('express');
const router = express.Router();
const proprietariosController = require('../controllers/proprietariosController');

// Cria um novo proprietário
router.post('/', proprietariosController.criarProprietarios);

router.get('/proprietarios', proprietariosController.listarProprietarios);
router.get('/produtos', proprietariosController.listarProdutos);

router.get('/search/proprietario', proprietariosController.buscarProprietario);
//http://localhost:3002/api/proprietarios/search/proprietario?id=18
router.get('/search/produto', proprietariosController.buscarProduto);
//http://localhost:3002/api/proprietarios/search/produto?valor=98.10


router.delete('/:id', proprietariosController.deletarProprietario);

router.get('/produto/maior-valor', proprietariosController.pesquisarProdutoMaiorValorTotal);
//http://localhost:3002/api/proprietarios/produto/maior-valor

router.get('/proprietario/maior-produtos', proprietariosController.pesquisarProprietarioMaiorNumeroProdutos);
//http://localhost:3002/api/proprietarios/proprietario/maior-produtos

module.exports = router;
