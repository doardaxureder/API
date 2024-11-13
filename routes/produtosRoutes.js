const express = require('express');
const router = express.Router();
const produtosController = require('../controllers/produtosController');

// Listar todos os produtos
router.get('/produtos', produtosController.listarProdutos);

// Buscar um produto pelo ID
router.get('/produtos/:id', produtosController.buscarProduto);

// Criar um novo produto
router.post('/produtos', produtosController.criarProduto);

// Atualizar dados de um produto
router.put('/produtos/:id', produtosController.atualizarProduto);

// Deletar um produto
router.delete('/produtos/:id', produtosController.deletarProduto);

module.exports = router;
