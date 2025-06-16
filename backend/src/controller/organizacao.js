const organizacaoModel = require("../model/organizacao");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const PessoaModel = require("../model/pessoa");
const enderecoController = require("./endereco");
const AlimentoModel = require('../model/alimento')
const { QueryTypes } = require("sequelize");
const { sequelize } = require('../config/database')
const { includeEnderecoCompleto } = require("../utils/formatadores");
const { Op } = require("sequelize");

const SECRET_KEY = "doacerto";
const SALT_VALUE = 10;

class OrganizacaoController {
    async criar(organizacao, cnpj, telefone, email, secretaria, endereco) {
        const senhaCriptografada = await bcrypt.hash(String(cnpj), SALT_VALUE);
        const enderecoValue = await enderecoController.criar(endereco);

        const emailExistente = await organizacaoModel.findOne({ where: { email } });
        if (emailExistente) {
            throw new Error("Email já cadastrado")
        };

        const existente = await organizacaoModel.findOne({ where: { cnpj } });
        if (existente) {
            throw new Error("CNPJ já cadastrado");
        }

        const organizacaoValue = await organizacaoModel.create({
            organizacao,
            cnpj,
            telefone,
            email,
            senha: senhaCriptografada,
            idSecretaria: secretaria,
            idEndereco: !enderecoValue.mensagem ? enderecoValue.dataValues.idEndereco : null
        });

        return { data: organizacaoValue, message: "Organização criada com sucesso" };
    }

    async editar(idOrganizacao, organizacao, cnpj, telefone, email, senha, ieSituacao, secretaria, endereco) {
        const organizacaoAtual = await organizacaoModel.findByPk(idOrganizacao)
        if (!organizacaoAtual) {
            throw new Error("Organizacao não encontrada")
        }

        const existente = await organizacaoModel.findOne({ where: { cnpj } });
        if (existente && existente.dataValues.idOrganizacao !== Number(idOrganizacao)) {
            throw new Error("CNPJ já cadastrado");
        }

        const updates = { cnpj };
        if (organizacao != null) updates.organizacao = organizacao;
        if (telefone != null) updates.telefone = telefone;
        if (email != null) updates.email = email;
        if (ieSituacao != null) updates.ieSituacao = ieSituacao;
        if (secretaria != null) updates.idSecretaria = secretaria;
        if (senha != null) updates.senha = senha;

        const senhaCriptografada = await bcrypt.hash(String(senha), SALT_VALUE);
        if (senha != null) updates.senha = senhaCriptografada;

        await organizacaoAtual.update(updates);

        if (endereco) {
            if (organizacaoAtual.idEndereco) {
                const enderecoAtualizado = await enderecoController.atualizarRuaDoEndereco(organizacaoAtual.idEndereco, endereco);
                if (enderecoAtualizado.mensagem) {
                    throw new Error(enderecoAtualizado.mensagem);
                }
            } else {
                const novoEndereco = await enderecoController.criar(endereco);
                if (novoEndereco.mensagem) {
                    throw new Error(novoEndereco.mensagem);
                }
                await organizacaoAtual.update({ idEndereco: novoEndereco.idEndereco });
            }
        }
        return { data: organizacaoAtual, message: "Organização editada com sucesso" };
    }

    async deletar(idOrganizacao) {
        const organizacaoValue = await organizacaoModel.destroy({
            where: { idOrganizacao }
        });
        return { data: organizacaoValue, message: "Organização deletada com sucesso" };
    }

    async buscarPorId(idOrganizacao) {
        const organizacaoValue = await organizacaoModel.findOne({
            where: { idOrganizacao }
        });
        return organizacaoValue;
    }

    async buscarOrganizacoes() {
        const organizacaoValue = await organizacaoModel.findAll({
            include: [{
                model: PessoaModel,
                as: 'secretaria',
                attributes: ['idPessoa', 'nome']
            },
                includeEnderecoCompleto,
            ]
        });

        const response = organizacaoValue.map(p => {
            const e = p.endereco;
            const r = e?.rua;
            const b = r?.bairro;
            const c = b?.cidade;
            const est = c?.estado;
            const pais = est?.pai;
            return {
                idOrganizacao: p.idOrganizacao,
                organizacao: p.organizacao,
                cnpj: p.cnpj,
                telefone: p.telefone,
                email: p.email,
                dtCadastro: p.dtCadastro,
                ieSituacao: p.ieSituacao,
                idSecretaria: p.idSecretaria,
                nomeSecretaria: p.secretaria?.nome,
                idEndereco: p.idEndereco,
                endereco: e ? {
                    cep: r?.CEP,
                    rua: r?.rua,
                    numero: e?.numero,
                    complemento: e?.complemento,
                    bairro: b?.bairro,
                    cidade: c?.cidade,
                    estado: est?.estado,
                    pais: pais?.pais
                } : null,
            }
        })

        return response;
    }

    async buscarOrganizacoesAtivas() {
        const organizacaoValue = await organizacaoModel.findAll({
            where: { ieSituacao: 'A' }
        });
        return organizacaoValue;
    }


    async login(email, senha) {
        if (!email || !senha) {
            throw new Error("Email e senha são obrigatórios")
        }

        const organizacaoValue = await organizacaoModel.findOne({
            where: { email }
        });


        if (!organizacaoValue) {
            throw new Error("Organizacao não encontrada")
        }

        const senhaCorreta = await bcrypt.compare(senha, organizacaoValue.senha);

        if (!senhaCorreta) {
            throw new Error("Senha incorreta")
        }

        const token = jwt.sign({ idOrganizacao: organizacaoValue.idOrganizacao, role: organizacaoValue.role }, SECRET_KEY, { expiresIn: "1h" });

        return { token };

    }

    async listarAlimentosEmEstoque(idOrganizacao) {
        const alimentosValue = await sequelize.query(`
        SELECT c.alimento,
               b."idAlimento",
               d."idUnidadeMedida",
               d."dsUnidadeMedida",
               SUM(CASE WHEN a."ieMovimentacao" = 'E' THEN b."quantidade" ELSE 0 END) AS total_entradas,
               SUM(CASE WHEN a."ieMovimentacao" = 'S' THEN b."quantidade" ELSE 0 END) AS total_saidas,
               SUM(CASE WHEN a."ieMovimentacao" = 'E' THEN b."quantidade" ELSE 0 END) -
               SUM(CASE WHEN a."ieMovimentacao" = 'S' THEN b."quantidade" ELSE 0 END) AS saldo
          FROM movimentacao a
          JOIN movimentacao_alimento b ON b."idMovimentacao" = a."idMovimentacao"
          JOIN alimento c ON c."idAlimento" = b."idAlimento"
          JOIN unidade_medida d ON d."idUnidadeMedida" = b."idUnidadeMedida"
         WHERE (:idOrganizacao = 1 or a."idOrganizacao" = :idOrganizacao)
      GROUP BY b."idAlimento", d."idUnidadeMedida", c."alimento", d."dsUnidadeMedida"
        HAVING SUM(CASE WHEN a."ieMovimentacao" = 'E' THEN b."quantidade" ELSE 0 END) -
               SUM(CASE WHEN a."ieMovimentacao" = 'S' THEN b."quantidade" ELSE 0 END) > 0;`,
            {
                replacements: { idOrganizacao },
                type: QueryTypes.SELECT
            })

        return alimentosValue;
    }

    async listarAlimentosParaMovimentacao(idOrganizacao, ieMovimentacao) {
        if (ieMovimentacao === 'E') {
            const alimentos = await AlimentoModel.findAll();
            return alimentos;
        } else {
            const organizacaoValue = this.listarAlimentosEmEstoque(idOrganizacao);
            return organizacaoValue
        }
    }

    async validarDado(filtros = {}) {
        const { email, cnpj } = filtros;

        let whereClause = {};

        if (email) {
            whereClause.email = email;
        }

        if (cnpj) {
            whereClause.cnpj = cnpj;
        }

        const organizacaoValue = await organizacaoModel.findOne({
            where: whereClause
        });

        if (organizacaoValue) {
            return { mensagem: "indiponível", disponivel: false };
        }

        return { mensagem: "Disponível", disponivel: true };
    }
}

module.exports = new OrganizacaoController()