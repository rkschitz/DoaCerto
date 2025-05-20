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
        nacionalidade,
        secretariaCadastro) {
        try {
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
                    nacionalidade,
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
                        return { mensagem: e.message }
                    }
                }
            }
            return { donatarioValue, sucesso: true, mensagem: "Donatário criado com sucesso." };
        } catch (e) {
            return { mensagem: e.message };
        }
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
        dataVisita,
        situacaoCadastral,
        observacao,
        dependentes = []
    ) {
        try {
            const donatarioAtual = await DonatarioModel.findOne({ where: { idDonatario } });
            if (!donatarioAtual) {
                return { mensagem: "Donatário não encontrado." };
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
            }, {
                where: { idDonatario }
            });

            const dependentesAtuais = await DependenteModel.findAll({
                where: { idProvedor: idDonatario }
            });

            console.log('DependendentesAtuais:', dependentesAtuais)
            for (const a of dependentesAtuais) {
                console.log('Dependente Atual:', a.dataValues)
            }
            for (const b of dependentes) {
                console.log('Dependente Novo:', b)
            }

            // 1. Atualizar ou criar
            const novosIds = [];

            for (const dependente of dependentes) {
                if (dependente.idDependente) {
                    await DependenteController.editar(
                        dependente.idDependente,
                        dependente.idGrauParentesco,
                        dependente.idPessoa
                    );
                    novosIds.push(dependente.idDependente);
                } else {
                    const novo = await DependenteController.criar(
                        dependente.idPessoa,
                        idDonatario,
                        dependente.idGrauParentesco
                    );
                    novosIds.push(novo.idDependente);
                }
            }

            const dependentesAtualIds = dependentesAtuais.map(d => d.idDependente);
            const idsParaExcluir = dependentesAtualIds.filter(id => !novosIds.includes(id));

            for (const id of idsParaExcluir) {
                await DependenteController.excluir(id);
            }

            return { donatarioValue, sucesso: true, mensagem: "Donatário atualizado com sucesso." };
        } catch (e) {
            return { mensagem: e.message };
        }
    }

    async excluir(idDonatario) {
        try {
            const donatarioValue = await DonatarioModel.destroy({
                where: { idDonatario }
            });
            if (!donatarioValue) {
                return { mensagem: "Donatário não encontrado." };
            }
            return { mensagem: "Donatário excluído com sucesso." };
        } catch (e) {
            return { mensagem: e.message };
        }
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
                }
            ]
        });

        return donatarios.map(d => {
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
    }
}

module.exports = new DonatarioController();