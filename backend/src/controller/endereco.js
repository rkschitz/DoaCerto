const EnderecoModel = require("../model/endereco")
const PaisModel = require("../model/pais")
const EstadoModel = require("../model/estado")
const CidadeModel = require("../model/cidade")
const BairroModel = require("../model/bairro")
const RuaModel = require("../model/rua")

class EnderecoController {
    async criar(endereco) {
            const cep = endereco?.cep;

            let rua = await RuaModel.findOne({ where: { CEP: String(cep) } });

            if (!rua) {
                const [pais] = await PaisModel.findOrCreate({
                    where: { pais: endereco.pais.trim() }
                });

                const [estado] = await EstadoModel.findOrCreate({
                    where: { estado: endereco.estado.trim(), idPais: pais.idPais }
                });

                const [cidade] = await CidadeModel.findOrCreate({
                    where: { cidade: endereco.cidade.trim(), idEstado: estado.idEstado }
                });

                const [bairro] = await BairroModel.findOrCreate({
                    where: { bairro: endereco.bairro.trim(), idCidade: cidade.idCidade }
                });

                const [ruaCriada] = await RuaModel.findOrCreate({
                    where: { rua: endereco.rua.trim(), idBairro: bairro.idBairro },
                    defaults: { CEP: cep }
                });

                rua = ruaCriada;
            }

            const enderecoCriado = await EnderecoModel.create({
                idRua: rua.idRua,
                numero: endereco.numero,
                complemento: endereco.complemento
            });
            return enderecoCriado;
        }
    
    async atualizarRuaDoEndereco(idEndereco, endereco) {
            try {
                const cep = endereco.cep;

                let rua = await RuaModel.findOne({ where: { CEP: cep } });

                if (!rua) {
                    const [pais] = await PaisModel.findOrCreate({
                        where: { pais: endereco.pais.trim() }
                    });

                    const [estado] = await EstadoModel.findOrCreate({
                        where: { estado: endereco.estado.trim(), idPais: pais.idPais }
                    });

                    const [cidade] = await CidadeModel.findOrCreate({
                        where: { cidade: endereco.cidade.trim(), idEstado: estado.idEstado }
                    });

                    const [bairro] = await BairroModel.findOrCreate({
                        where: { bairro: endereco.bairro.trim(), idCidade: cidade.idCidade }
                    });

                    const [novaRua] = await RuaModel.findOrCreate({
                        where: { rua: endereco.rua.trim(), idBairro: bairro.idBairro },
                        defaults: { CEP: cep }
                    });

                    rua = novaRua;
                }

                const enderecoExistente = await EnderecoModel.findByPk(idEndereco);
                if (!enderecoExistente) {
                    throw new Error("Endereço não encontrado.");
                }

                await enderecoExistente.update({
                    idRua: rua.idRua,
                    numero: endereco.numero,
                    complemento: endereco.complemento
                });

                return enderecoExistente;

            } catch (e) {
                return { mensagem: e.message };
            }
        }

    }

module.exports = new EnderecoController();