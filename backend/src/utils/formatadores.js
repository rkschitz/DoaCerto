const enderecoModel = require('../model/endereco');
const ruaModel = require('../model/rua');
const bairroModel = require('../model/bairro');
const cidadeModel = require('../model/cidade');
const estadoModel = require('../model/estado');
const paisModel = require('../model/pais');

// Função
function formatarPessoa(p) {
    const e = p.endereco;
    const r = e?.rua;
    const b = r?.bairro;
    const c = b?.cidade;
    const est = c?.estado;
    const pais = est?.pais;

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
            pais: pais?.pais,
            enderecoCompleto: e.rua ? `${r?.rua}, ${e?.numero} ${e?.complemento ? `, ${e?.complemento}` : ''} - ${b?.bairro}, ${c?.cidade} - ${est?.estado}`: null,
        } : null
    };
}

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

module.exports = {
    formatarPessoa,
    includeEnderecoCompleto
};
