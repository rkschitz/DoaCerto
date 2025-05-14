const Alimento = require("./alimento");
const Donatario = require("./donatario");
const SituacaoHabitacional = require("./situacaoHabitacional");
const TipoAlimento = require("./tipoAlimento");
const SituacaoProfissional = require("./situacaoProfissional");
const Pessoa = require("./pessoa");
const Dependente = require("./dependente");
const Organizacao = require("./organizacao");
const GrauParentesco = require("./grauParentesco");
const UnidadeMedida = require("./unidadeMedida")
const Movimentacao = require("./movimentacao")
const MovimentacaoAlimento = require("./movimentacaoAlimento")
const Rua = require("./rua");
const Bairro = require("./bairro");
const Cidade = require("./cidade");
const Estado = require("./estado");
const Pais = require("./pais");
const Endereco = require("./endereco");
const Campanha = require("./campanha");
const Meta = require("./meta");

// 🥦 Relacionamento entre TipoAlimento e Alimento
TipoAlimento.hasMany(Alimento, { foreignKey: "idTipoAlimento" });
Alimento.belongsTo(TipoAlimento, { foreignKey: "idTipoAlimento" });

// 🏢 Relacionamento entre Pessoa e Organizacao
Organizacao.belongsTo(Pessoa, { as: "secretaria", foreignKey: "idSecretaria" });
Pessoa.hasMany(Organizacao, { as: "organizacoes", foreignKey: "idSecretaria" });

// // 🚨 Removido relacionamento duplicado entre Donatario e Pessoa
// Donatario.belongsTo(Pessoa, { foreignKey: "idPessoa" });

// 👶 Relacionamento entre Dependente e Pessoa (Dependente e Provedor)

//Relacionamento entre Donatario e Pessoa
Donatario.belongsTo(Pessoa, { foreignKey: "idPessoa" });
Pessoa.hasMany(Donatario, { foreignKey: "idPessoa" });

// 👥 Relacionamento entre Donatario e Pessoa (Responsável pela Visita)
Donatario.belongsTo(Pessoa, {
  as: "responsavel",
  foreignKey: "responsavelVisita",
});
Pessoa.hasMany(Donatario, {
  as: "visitasResponsaveis",
  foreignKey: "responsavelVisita",
});

// 🏢 Relacionamento entre Donatario e Organizacao
Donatario.belongsTo(Organizacao, {
  as: "organizacao",
  foreignKey: "idOrganizacao",
});
Organizacao.hasMany(Donatario, {
  as: "donatarios",
  foreignKey: "idOrganizacao",
});

// 🏠 Relacionamento entre Donatario e SituacaoHabitacional
Donatario.belongsTo(SituacaoHabitacional, {
  as: "situacaoHabitacional",
  foreignKey: "idSituacaoHabitacional",
});
SituacaoHabitacional.hasMany(Donatario, {
  as: "donatarios",
  foreignKey: "idSituacaoHabitacional",
});

// 👷‍♂️ Relacionamento entre Donatario e SituacaoProfissional
Donatario.belongsTo(SituacaoProfissional, {
  as: "situacaoProfissional",
  foreignKey: "idSituacaoProfissional",
});
SituacaoProfissional.hasMany(Donatario, {
  as: "donatarios",
  foreignKey: "idSituacaoProfissional",
});

// Um Donatario tem muitos Dependentes
Donatario.hasMany(Dependente, { as: "dependentes", foreignKey: "idProvedor" });

// Um Dependente pertence a um Donatario (o provedor)
Dependente.belongsTo(Donatario, {
  as: "provedor",
  foreignKey: "idProvedor",
  onDelete: "CASCADE",
});

// Um Dependente pertence a uma Pessoa (dados pessoais do dependente)
Dependente.belongsTo(Pessoa, { as: "pessoa", foreignKey: "idPessoa" });

Dependente.belongsTo(GrauParentesco, {
  as: "grauParentesco",
  foreignKey: "idGrauParentesco",
});

// GrauParentesco possui muitos Dependentes (1:N)
GrauParentesco.hasMany(Dependente, { as: "dependentes", foreignKey: "idGrauParentesco", });

MovimentacaoAlimento.belongsTo(Movimentacao, { foreignKey: "idMovimentacao", as: "movimentacao", onDelete: 'CASCADE' });

// MovimentacaoAlimento belongs to Alimento
MovimentacaoAlimento.belongsTo(Alimento, { foreignKey: "idAlimento", as: "alimento", });

// MovimentacaoAlimento belongs to UnidadeMedida
MovimentacaoAlimento.belongsTo(UnidadeMedida, { foreignKey: "idUnidadeMedida", as: "unidade_medida", });

// Opcional: reverse relations, caso precise acessar os MovimentacaoAlimento a partir dos outros modelos
Movimentacao.hasMany(MovimentacaoAlimento, { foreignKey: "idMovimentacao", as: "alimentos", });

Alimento.hasMany(MovimentacaoAlimento, { foreignKey: "idAlimento", as: "alimentos", });

UnidadeMedida.hasMany(MovimentacaoAlimento, { foreignKey: "idUnidadeMedida", as: "movimentacao_alimento", });

Rua.belongsTo(Bairro, { foreignKey: "idBairro" });
Bairro.hasMany(Rua, { foreignKey: "idBairro" });

Bairro.belongsTo(Cidade, { foreignKey: "idCidade" });
Cidade.hasMany(Bairro, { foreignKey: "idCidade" });

Cidade.belongsTo(Estado, { foreignKey: "idEstado" });
Estado.hasMany(Cidade, { foreignKey: "idEstado" });

Estado.belongsTo(Pais, { foreignKey: "idPais" });
Pais.hasMany(Estado, { foreignKey: "idPais" });

Endereco.belongsTo(Rua, { foreignKey: "idRua" });
Rua.hasMany(Endereco, { foreignKey: "idRua" });

Pessoa.belongsTo(Endereco, { foreignKey: 'idEndereco', as: 'endereco', });
Endereco.hasMany(Pessoa, { foreignKey: 'idEndereco', as: 'pessoas', });

Organizacao.belongsTo(Endereco, { foreignKey: 'idEndereco', as: 'endereco', });
Endereco.hasMany(Organizacao, { foreignKey: 'idEndereco', as: 'organizacoes', });

Campanha.belongsTo(Organizacao, { foreignKey: 'idOrganizacao', as: 'organizacao', });
Organizacao.hasMany(Campanha, { foreignKey: 'idOrganizacao', as: 'campanhas', });

Movimentacao.belongsTo(Campanha, { foreignKey: 'idCampanha', as: 'campanha', });
Campanha.hasMany(Movimentacao, { foreignKey: 'idCampanha', as: 'campanhas', });

Movimentacao.belongsTo(Donatario, { foreignKey: 'idDonatario' });
Donatario.hasMany(Movimentacao, { foreignKey: 'idDonatario' });

Movimentacao.belongsTo(Pessoa, { foreignKey: 'idDoador', as: 'doador' })
Pessoa.hasMany(Movimentacao, { foreignKey: 'idPessoa', as: 'doadores' });

Meta.belongsTo(Campanha, { foreignKey: 'idCampanha', as: 'campanha' });
Campanha.hasMany(Meta, { foreignKey: 'idCampanha', as: 'metas' });

Meta.belongsTo(Alimento, { foreignKey: 'idAlimento', as: 'alimento' });
Alimento.hasMany(Meta, { foreignKey: 'idAlimento', as: 'metas' });

Meta.belongsTo(UnidadeMedida, { foreignKey: 'idUnidadeMedida', as: 'unidade_medida' });
UnidadeMedida.hasMany(Meta, { foreignKey: 'idUnidadeMedida', as: 'metas' });
