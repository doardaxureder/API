const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = {
    // Listar todos os produtos
    async listarProdutos(req, res) {
        try {
            const produtos = await prisma.produto.findMany();
            res.status(200).json(produtos);
        } catch (error) {
            console.error("Erro ao listar produtos:", error);
            res.status(500).json({ message: "Erro interno no servidor", error: error.message });
        }
    },

    // Buscar um produto pelo ID
    async buscarProduto(req, res) {
        try {
            const { id } = req.params;
            const produto = await prisma.produto.findUnique({
                where: { id: Number(id) }
            });
            if (!produto) {
                return res.status(404).json({ error: "Produto não encontrado" });
            }
            res.status(200).json(produto);
        } catch (error) {
            console.error("Erro ao buscar produto:", error);
            res.status(500).json({ error: "Erro de acesso aos dados do produto" });
        }
    },

    // Criar um novo produto
    async criarProduto(req, res) {
        try {
            const { descricao, quantidade, valor, proprietarioId } = req.body;

            // Validação simples para garantir que os campos não estejam vazios
            if (!descricao || quantidade === undefined || valor === undefined || !proprietarioId) {
                return res.status(400).json({ error: "Descrição, quantidade, valor e proprietário são obrigatórios." });
            }

            const novoProduto = await prisma.produto.create({
                data: {
                    descricao,
                    quantidade,
                    valor,
                    proprietario: {
                        connect: { id: Number(proprietarioId) } // Relaciona o produto ao proprietário
                    }
                }
            });

            res.status(201).json(novoProduto);
        } catch (error) {
            console.error("Erro ao criar produto:", error); // Log detalhado
            res.status(500).json({
                error: "Erro ao criar o produto.",
                message: error.message,
                stack: error.stack,  // Exibe o stack trace para ajudar a entender onde falhou
            });
        }
    },

    // Atualizar dados de um produto
    async atualizarProduto(req, res) {
        try {
            const { id } = req.params;
            const { descricao, quantidade, valor, proprietarioId } = req.body;

            // Verificando se o produto existe
            const produtoExistente = await prisma.produto.findUnique({
                where: { id: Number(id) }
            });

            if (!produtoExistente) {
                return res.status(404).json({ error: "Produto não encontrado." });
            }

            // Atualizar o produto
            const produtoAtualizado = await prisma.produto.update({
                where: { id: Number(id) },
                data: {
                    descricao,
                    quantidade,
                    valor,
                    proprietario: proprietarioId ? { connect: { id: Number(proprietarioId) } } : undefined
                }
            });

            res.status(200).json(produtoAtualizado);
        } catch (error) {
            console.error("Erro ao atualizar produto:", error);
            res.status(500).json({ error: "Erro ao atualizar o produto" });
        }
    },

    // Deletar um produto
    async deletarProduto(req, res) {
        try {
            const { id } = req.params;

            // Verificando se o produto existe
            const produtoExistente = await prisma.produto.findUnique({
                where: { id: Number(id) }
            });

            if (!produtoExistente) {
                return res.status(404).json({ error: "Produto não encontrado." });
            }

            // Remover o produto
            await prisma.produto.delete({
                where: { id: Number(id) }
            });

            res.status(204).json({ message: "Produto removido com sucesso." });
        } catch (error) {
            console.error("Erro ao remover produto:", error);
            res.status(500).json({ error: "Erro ao remover o produto" });
        }
    }
};
