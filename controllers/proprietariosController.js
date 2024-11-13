const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = {
    // Criar um novo proprietário
    async criarProprietarios(req, res) {
        try {
            const { nome, email, endereco, produtos } = req.body;

            if (!nome || !email || !endereco) {
                console.log("Campos obrigatórios faltando");
                return res.status(400).json({ error: "Nome, email e endereço são obrigatórios." });
            }

            // Formatar produtos se estiverem presentes
            const produtosFormatted = produtos?.map(produto => ({
                descricao: produto.descricao,
                quantidade: produto.quantidade || 0,
                valor: produto.valor || 0
            })) || [];

            // Criação do proprietário e produtos relacionados
            const novoProprietario = await prisma.proprietario.create({
                data: {
                    nome,
                    email,
                    endereco,
                    produtos: {
                        create: produtosFormatted
                    }
                }
            });

            console.log("Proprietário criado com sucesso:", novoProprietario);
            return res.status(201).json(novoProprietario);
        } catch (error) {
            console.error("Erro ao criar o proprietário:", error);
            return res.status(500).json({ error: "Erro ao criar o proprietário." });
        }
    },

    async listarProprietarios(req,res){
        try {
            const proprietarios = await prisma.proprietario.findMany();
            res.status(200).json(proprietarios);

        }catch(error){
            res.status(500).json({ error: "Erro ao listar os proprietarios"})
        }
    },

    async listarProdutos(req,res){
        try {
            const produtos = await prisma.produto.findMany();
            res.status(200).json(produtos);

        }catch(error){
            res.status(500).json({ error: "Erro ao listar os produtos"})
        }
    },

    async buscarProprietario(req, res) {
        let proprietario=null;
        try {
            const { id } = req.query; // ou req.query se estiver usando query params
            const { nome } = req.query;
            console.log("nome" + nome);
            console.log("id:" + id);          
            if (!id && !nome) {
                return res.status(400).json({ error: "Parâmetro 'id' ou 'nome' é necessário." });
            }else if(id) {
                proprietario = await prisma.proprietario.findFirst({
                    where: {
                             id: Number(id),
                }});
            }else if(nome){
                proprietario = await prisma.proprietario.findMany({
                    where: {
                          nome: { contains: String(nome) }      
                    }
                });
            }    
            if (!proprietario) {
                return res.status(404).json({
                    error: "Proprietário não encontrado."
                });
            }
    
            res.status(200).json(proprietario);
    
        } catch (error) {
            console.error(error); // Log do erro para depuração
            res.status(500).json({ error: "Erro de acesso aos dados do proprietário." });
        }
    
    },

    async buscarProduto(req, res) {
        let produto = null;
        try {
            const { quantidade, valor } = req.query;
            console.log("quantidade:", quantidade);
            console.log("valor:", valor);
    
            if (!quantidade && !valor) {
                return res.status(400).json({ error: "Parâmetro 'quantidade' ou 'valor' é necessário." });
            } else if (quantidade) {
                console.log("Buscando por quantidade");
                produto = await prisma.produto.findFirst({
                    where: { quantidade: Number(quantidade) }
                });
            } else if (valor) {
                console.log("Buscando por valor");
                produto = await prisma.produto.findFirst({
                    where: { valor: Number(valor) }
                });
            }
    
            if (!produto) {
                return res.status(404).json({
                    error: "Produto não encontrado."
                });
            }
    
            res.status(200).json(produto);
    
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Erro de acesso aos dados do produto." });
        }
    },
    



    
    async deletarProprietario(req,res){
        try {
            const { id } = req.params;
            console.log("id"+ id);
            await prisma.proprietario.delete(
                {
                    where: { id: Number(id) }
                }
            )
            res.status(204).json({ message: "Proprietário removido com sucesso." } )

        }catch(error){
            res.status(500).json({ error: error });
        }
    },

    async pesquisarProdutoMaiorValorTotal(req, res) {
        try {
            const produto = await prisma.produto.findMany({
                orderBy: {
                    valor: 'desc'
                },
                take: 1  // Limita a busca ao primeiro produto (o de maior valor total)
            });
    
            if (!produto) {
                return res.status(404).json({ error: "Nenhum produto encontrado." });
            }
    
            res.status(200).json(produto);
        } catch (error) {
            console.error("Erro ao buscar o produto de maior valor total:", error);
            res.status(500).json({ error: "Erro ao buscar o produto." });
        }
    },

    async pesquisarProprietarioMaiorNumeroProdutos(req, res) {
        try {
            const proprietario = await prisma.proprietario.findFirst({
                orderBy: {
                    produtos: {
                        _count: 'desc' // Ordena pelo número de produtos (em ordem decrescente)
                    }
                },
                include: {
                    produtos: true // Inclui os produtos do proprietário para exibir no resultado
                },
                take: 1 // Limita a busca ao primeiro proprietário com o maior número de produtos
            });
    
            if (!proprietario) {
                return res.status(404).json({ error: "Nenhum proprietário encontrado." });
            }
    
            res.status(200).json(proprietario);
        } catch (error) {
            console.error("Erro ao buscar o proprietário com o maior número de produtos:", error);
            res.status(500).json({ error: "Erro ao buscar o proprietário." });
        }
    }
    
    
    
};
