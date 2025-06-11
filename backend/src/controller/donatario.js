const { literal } = require("sequelize");
const DonatarioModel = require('../model/donatario');
const DependenteController = require('../controller/dependente');
const PessoaModel = require('../model/pessoa');
const OrganizacaoModel = require('../model/organizacao');
const SituacaoHabitacionalModel = require('../model/situacaoHabitacional');
const SituacaoProfissionalModel = require('../model/situacaoProfissional');
const GrauParentescoModel = require('../model/grauParentesco');
const DependenteModel = require('../model/dependente');
const { Op } = require('sequelize');
const { includeEnderecoCompleto, formatarPessoa } = require("../utils/formatadores");
const NacionalidadeModel = require("../model/nacionalidade");

class DonatarioController {
    async criar(idPessoa,
        idSituacaoHabitacional,
        tempoResidencia,
        rendaFamiliar,
        idSituacaoProfissional,
        cadastroCras,
        outroLocal,
        enfermoNaCasa,
        situacaoEnfermo,
        dataCadastro,
        idOrganizacao,
        responsavelVisita,
        observacao,
        dependentes = [],
        idNacionalidade,
        secretariaCadastro) {

        const donatarioValue =
            await DonatarioModel.create({
                idPessoa,
                idSituacaoHabitacional,
                tempoResidencia,
                rendaFamiliar,
                idSituacaoProfissional,
                cadastroCras,
                outroLocal,
                enfermoNaCasa,
                situacaoEnfermo,
                dataCadastro,
                idOrganizacao,
                responsavelVisita,
                observacao,
                idNacionalidade,
                secretariaCadastro
            })

        if (Array.isArray(dependentes) && dependentes.length > 0) {
            for (const dependente of dependentes) {
                try {
                    await DependenteController.criar(
                        dependente.idPessoa,
                        donatarioValue.dataValues.idDonatario,
                        dependente.idGrauParentesco
                    )
                } catch (e) {
                    throw new Error(e)
                }
            }
        }
        return { data: donatarioValue, message: "Donatário criado com sucesso." };
    }

    async editar(
        idDonatario,
        idPessoa,
        idSituacaoHabitacional,
        tempoResidencia,
        rendaFamiliar,
        idSituacaoProfissional,
        cadastroCras,
        outroLocal,
        enfermoNaCasa,
        situacaoEnfermo,
        dataCadastro,
        responsavelVisita,
        observacao,
        dependentes = [],
        idNacionalidade,
        dataVisita,
        situacaoCadastral,
    ) {


        const donatarioAtual = await DonatarioModel.findOne({ where: { idDonatario } });
        if (!donatarioAtual) {
            throw new Error("Donatário não encontrado.");
        }

        const donatarioValue = await DonatarioModel.update({
            idPessoa: idPessoa ?? donatarioAtual.idPessoa,
            idSituacaoHabitacional: idSituacaoHabitacional ?? donatarioAtual.idSituacaoHabitacional,
            tempoResidencia: tempoResidencia ?? donatarioAtual.tempoResidencia,
            rendaFamiliar: rendaFamiliar ?? donatarioAtual.rendaFamiliar,
            idSituacaoProfissional: idSituacaoProfissional ?? donatarioAtual.idSituacaoProfissional,
            cadastroCras: cadastroCras ?? donatarioAtual.cadastroCras,
            outroLocal: outroLocal ?? donatarioAtual.outroLocal,
            enfermoNaCasa: enfermoNaCasa ?? donatarioAtual.enfermoNaCasa,
            situacaoEnfermo: situacaoEnfermo ?? donatarioAtual.situacaoEnfermo,
            dataCadastro: dataCadastro ?? donatarioAtual.dataCadastro,
            responsavelVisita: responsavelVisita ?? donatarioAtual.responsavelVisita,
            dataVisita: dataVisita ?? donatarioAtual.dataVisita,
            situacaoCadastral: situacaoCadastral ?? donatarioAtual.situacaoCadastral,
            observacao: observacao ?? donatarioAtual.observacao,
            idNacionalidade: idNacionalidade ?? donatarioAtual.idNacionalidade
        }, {
            where: { idDonatario }
        });

        const dependentesAtuais = await DependenteModel.findAll({
            where: { idProvedor: idDonatario }
        });

        const novosIds = [];

        for (const dependente of dependentes) {
            if (dependente.idDependente) {
                try {
                    await DependenteController.editar(
                        dependente.idDependente,
                        dependente.idGrauParentesco,
                        dependente.idPessoa
                    );
                    novosIds.push(dependente.idDependente);
                } catch (e) {
                    throw new Error(e)
                }
            } else {
                try {
                    const novo = await DependenteController.criar(
                        dependente.idPessoa,
                        idDonatario,
                        dependente.idGrauParentesco
                    );
                    novosIds.push(novo.idDependente);
                } catch (e) {
                    throw new Error(e)
                }
            }
        }

        const dependentesAtualIds = dependentesAtuais.map(d => d.idDependente);
        const idsParaExcluir = dependentesAtualIds.filter(id => !novosIds.includes(id));

        for (const id of idsParaExcluir) {
            try {
                await DependenteController.excluir(id);
            } catch (e) {
                throw new Error(e)
            }
        }

        return { data: donatarioValue, message: "Donatário atualizado com sucesso." };
    }

    async excluir(idDonatario) {
        const donatarioValue = await DonatarioModel.destroy({
            where: { idDonatario }
        });
        if (!donatarioValue) {
            throw new Error("Donatário não encontrado.");
        }

        return { message: "Donatário excluído com sucesso." };
    }

    async buscarPorId(idDonatario) {
        const donatarioValue = await DonatarioModel.findOne({
            where: { idDonatario }
        });
        return donatarioValue;
    }

    async buscarTodos(nome, cpf, situacaoCadastral) {

        const whereDonatario = {};
        const wherePessoa = {};
        if (nome) {
            wherePessoa.nome = { [Op.like]: `%${nome}%` };
        }
        if (cpf) {
            wherePessoa.cpf = cpf;
        }

        if (situacaoCadastral != 'T') {
            whereDonatario.situacaoCadastral = situacaoCadastral;
        }

        const donatarios = await DonatarioModel.findAll({
            where: whereDonatario,
            include: [
                {
                    model: PessoaModel,
                    as: 'pessoa',
                    where: Object.keys(wherePessoa).length ? wherePessoa : undefined,
                    attributes: ['idPessoa', 'nome', 'cpf', 'dtNascimento', 'sexo', 'telefone'],
                    include: includeEnderecoCompleto
                },
                {
                    model: PessoaModel,
                    as: 'responsavel',
                    attributes: ['idPessoa', 'nome', 'cpf']
                },
                {
                    model: OrganizacaoModel,
                    as: 'organizacao',
                    attributes: ['idOrganizacao', 'organizacao'],
                    include: {
                        model: PessoaModel,
                        as: 'secretaria',
                        attributes: ['idPessoa', 'nome', 'cpf']
                    }
                },
                {
                    model: SituacaoHabitacionalModel,
                    as: 'situacaoHabitacional',
                    attributes: ['idSituacaoHabitacional', 'situacaoHabitacional']
                },
                {
                    model: SituacaoProfissionalModel,
                    as: 'situacaoProfissional',
                    attributes: ['idSituacaoProfissional', 'situacaoProfissional']
                },
                {
                    model: DependenteModel,
                    as: 'dependentes',
                    attributes: ['idDependente'],
                    include: [
                        {
                            model: PessoaModel,
                            as: 'pessoa',
                            attributes: ['idPessoa', 'nome', 'cpf', 'dtNascimento']
                        },
                        {
                            model: GrauParentescoModel,
                            as: 'grauParentesco',
                            attributes: ['idGrauParentesco', 'grauParentesco']
                        }
                    ]
                },
                {
                    model: NacionalidadeModel,
                    as: 'nacionalidade',
                    attributes: ['idNacionalidade', 'nacionalidade']
                },
                {
                    model: PessoaModel,
                    as: 'responsavel',
                    attributes: ['idPessoa', 'nome']
                },
                {
                    model: PessoaModel,
                    as: 'secretaria',
                    attributes: ['idPessoa', 'nome']
                }
            ]
        });

        const donatariosValue = donatarios.map(d => {
            const json = d.toJSON();
            return {
                ...json,
                dependentes: json.dependentes.map(d => ({
                    grauParentesco: d.grauParentesco.grauParentesco,
                    idGrauParentesco: d.grauParentesco.idGrauParentesco,
                    idDependente: d.idDependente,
                    idPessoa: d.pessoa.idPessoa,
                    nome: d.pessoa.nome,
                    dtNascimento: d.pessoa.dtNascimento
                })),
                pessoa: formatarPessoa(json.pessoa)
            };
        })

        return donatariosValue
    }
}

module.exports = new DonatarioController();