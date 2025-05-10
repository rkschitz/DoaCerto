const pessoaModel = require('../model/pessoa');
const enderecoController = require('./endereco');
const enderecoModel = require('../model/endereco');
const ruaModel = require('../model/rua');
const bairroModel = require('../model/bairro');
const cidadeModel = require('../model/cidade');
const estadoModel = require('../model/estado');
const paisModel = require('../model/pais');
const DonatarioController = require('../controller/donatario')

const { Op } = require('sequelize');

const includeEnderecoCompleto = {
    model: enderecoModel,
    as: 'endereco',
    required: false,
    attributes: ['numero', 'complemento'],
    include: {
        model: ruaModel,
        required: false,
        attributes: ['rua', 'CEP'],
        include: {
            model: bairroModel,
            required: false,
            attributes: ['bairro'],
            include: {
                model: cidadeModel,
                required: false,
                attributes: ['cidade'],
                include: {
                    model: estadoModel,
                    required: false,
                    attributes: ['estado'],
                    include: {
                        model: paisModel,
                        required: false,
                        attributes: ['pais'],
                    }
                }
            }
        }
    }
};

function formatarPessoa(p) {
    const e = p.endereco;
    const r = e?.rua;
    const b = r?.bairro;
    const c = b?.cidade;
    const est = c?.estado;
    const pais = est?.pais; // corrigido: antes estava `est?.pai`

    return {
        idPessoa: p.idPessoa,
        nome: p.nome,
        cpf: p.cpf,
        telefone: p.telefone,
        email: p.email,
        dtNascimento: p.dtNascimento,
        sexo: p.sexo,
        endereco: e ? {
            cep: r?.CEP,
            rua: r?.rua,
            numero: e?.numero,
            complemento: e?.complemento,
            bairro: b?.bairro,
            cidade: c?.cidade,
            estado: est?.estado,
            pais: pais?.pais
        } : null
    };
}



class PessoaController {
    async criar(nome, cpf, telefone, email, dtNascimento, sexo, endereco) {
        try {

            const enderecoValue = await enderecoController.criar(endereco);

            const pessoaValue = await pessoaModel.create({
                nome,
                cpf,
                telefone,
                email,
                dtNascimento,
                sexo,
                idEndereco: !enderecoValue.mensagem ? enderecoValue.dataValues.idEndereco : null
            })

            return pessoaValue;

        } catch (e) {
            return { mensagem: e.message };
        }
    }

    async editar(
        idPessoa,
        nome,
        cpf,
        telefone,
        email,
        dtNascimento,
        sexo,
        endereco
    ) {
        const pessoa = await pessoaModel.findByPk(idPessoa);
        if (!pessoa) {
            throw new Error("Pessoa não encontrada.");
        }

        const existente = await pessoaModel.findOne({ where: { cpf } });
        if (existente && existente.dataValues.idPessoa !== Number(idPessoa)) {
            throw new Error("CPF já cadastrado.");
        }

        const updates = { cpf };
        if (nome != null) updates.nome = nome;
        if (telefone != null) updates.telefone = telefone;
        if (email != null) updates.email = email;
        if (dtNascimento != null) updates.dtNascimento = dtNascimento;
        if (sexo != null) updates.sexo = sexo;

        await pessoa.update(updates);

        if (endereco) {
            if (pessoa.idEndereco) {
                // Atualiza a rua e dados do endereço existente
                const enderecoAtualizado = await enderecoController.atualizarRuaDoEndereco(pessoa.idEndereco, endereco);
                if (enderecoAtualizado?.mensagem) {
                    throw new Error("Erro ao atualizar endereço: " + enderecoAtualizado.mensagem);
                }
            } else {
                // Cria novo endereço e associa à pessoa
                const novoEndereco = await enderecoController.criar(endereco);
                if (novoEndereco?.mensagem) {
                    throw new Error("Erro ao criar endereço: " + novoEndereco.mensagem);
                }

                await pessoa.update({ idEndereco: novoEndereco.idEndereco });
            }
        }

        return pessoa;
    }


    async deletar(idPessoa) {

        try {
            const personValue = await pessoaModel.findOne({ where: { idPessoa } });
            await personValue.destroy();
            return { mensagem: "Pessoa excluída com sucesso." };
        } catch (e) {
            return { mensagem: e.message }
        }
    }



    async buscarTodos() {
        const pessoas = await pessoaModel.findAll({
            include: includeEnderecoCompleto
        });

        return pessoas.map(p => {
            const e = p.endereco;
            const r = e?.rua;
            const b = r?.bairro;
            const c = b?.cidade;
            const est = c?.estado;
            const pais = est?.pai;

            return {
                idPessoa: p.idPessoa,
                nome: p.nome,
                cpf: p.cpf,
                telefone: p.telefone,
                email: p.email,
                dtNascimento: p.dtNascimento,
                sexo: p.sexo,
                endereco: e ? {
                    cep: r?.CEP,
                    rua: r?.rua,
                    numero: e?.numero,
                    complemento: e?.complemento,
                    bairro: b?.bairro,
                    cidade: c?.cidade,
                    estado: est?.estado,
                    pais: pais?.pais
                } : null
            };
        });
    }

    async buscarPorNomeCpf(nome, cpf) {
        if (!nome && !cpf) {
            throw new Error("Nome ou CPF devem ser informados.");
        }

        const where = {};
        if (nome) {
            where.nome = { [Op.like]: `%${nome}%` };
        }
        if (cpf) {
            where.cpf = { [Op.like]: `%${cpf}%` };
        }

        const response = await pessoaModel.findAll({
            where,
            include: includeEnderecoCompleto
        });


        return response.map(formatarPessoa)
    }
}

module.exports = new PessoaController();