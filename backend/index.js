const fs = require("fs");
const path = require("path");
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");

const database = require("./src/config/database");
const AlimentRouter = require("./src/routes/aliment");
const OrganizacaoRouter = require("./src/routes/organizacao");
const Organizacao = require("./src/model/organizacao");
const TipoAlimento = require("./src/model/tipoAlimento");
const Alimento = require("./src/model/alimento");
const SituacaoHabitacional = require("./src/model/situacaoHabitacional");
const SituacaoProfissional = require("./src/model/situacaoProfissional");
const OrganizacaoApi = require("./src/api/organizacao");

const DonatarioRouter = require("./src/routes/donatario");
const PessoaRouter = require("./src/routes/pessoa");
const GrauParentescoRouter = require("./src/routes/grauParentesco");
const MovimentacaoRouter = require("./src/routes/movimentacao")
const CampanhaRouter = require("./src/routes/campanha");
const UnidadeMedidaRouter = require("./src/routes/unidadeMedida")

const PessoaController = require("./src/controller/pessoa");
const OrganizacaoController = require("./src/controller/organizacao");
const DonatarioController = require("./src/controller/donatario");
const GrauParentesco = require("./src/model/grauParentesco");
const DependenteController = require("./src/controller/dependente");
const UnidadeMedidaController = require("./src/controller/unidadeMedida");
const MovimentacaoController = require("./src/controller/movimentacao");
const CampanhaController = require("./src/controller/campanha");

require("./src/model/association");
const app = express();
const corsOptions = {
  origin: "http://localhost:3001",
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: "Content-Type, Authorization",
};

app.use(cors(corsOptions));
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({ message: "OK" });
});

app.use("/api/v1/login", OrganizacaoApi.login);

app.use("/api/v1/aliment", AlimentRouter);
app.use("/api/v1/organizacao", OrganizacaoRouter);
app.use("/api/v1/donatario", DonatarioRouter);
app.use("/api/v1/pessoa", PessoaRouter);
app.use("/api/v1/grauParentesco", GrauParentescoRouter);
app.use("/api/v1/movimentacao", MovimentacaoRouter)
app.use("/api/v1/campanha", CampanhaRouter)
app.use("/api/v1/unidade_medida", UnidadeMedidaRouter)
const Dependente = require("./src/model/dependente");

const createTables = async () => {
  try {
    await database.db.sync({ force: true, logging: console.log });

    const cypherSenha = await bcrypt.hash("admin", 10);

    await Organizacao.create({
      organizacao: "admin",
      email: "admin",
      senha: cypherSenha,
      role: "A",
    });

    console.log("Todas as tabelas foram criadas com sucesso!");

    const filePath = path.join(__dirname, "src/data/alimentos.json");
    const alimentos = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    const situacaoHabitacionalPath = path.join(
      __dirname,
      "src/data/situacaoHabitacional.json"
    );
    const situacaoHabitacionaljson = JSON.parse(
      fs.readFileSync(situacaoHabitacionalPath, "utf-8")
    );
    const situacaoProfissionalPath = path.join(
      __dirname,
      "src/data/situacaoProfissional.json"
    );
    const situacaoProfissionaljson = JSON.parse(
      fs.readFileSync(situacaoProfissionalPath, "utf-8")
    );
    const pessoasPath = path.join(__dirname, "src/data/pessoas.json");
    const pessoasJson = JSON.parse(fs.readFileSync(pessoasPath, "utf-8"));
    const organizacoesPath = path.join(__dirname, "src/data/organizacoes.json");
    const organizacoesJson = JSON.parse(
      fs.readFileSync(organizacoesPath, "utf-8")
    );
    const donatariosPath = path.join(__dirname, "src/data/donatarios.json");
    const donatariosJson = JSON.parse(fs.readFileSync(donatariosPath, "utf-8"));
    const grauParentescoPath = path.join(
      __dirname,
      "src/data/grauParentesco.json"
    );
    const grauParentescoJson = JSON.parse(
      fs.readFileSync(grauParentescoPath, "utf-8")
    );
    const dependentePath = path.join(__dirname, "src/data/dependentes.json");
    const dependentesJson = JSON.parse(
      fs.readFileSync(dependentePath, "utf-8")
    );
    const unidadeMedidaPath = path.join(
      __dirname,
      "src/data/unidadeMedida.json"
    );
    const unidadeMedidaJson = JSON.parse(
      fs.readFileSync(unidadeMedidaPath, "utf-8")
    );

    const movimentacaoPath = path.join(__dirname, "src/data/movimentacao.json");
    const movimentacaoJson = JSON.parse(
      fs.readFileSync(movimentacaoPath, "utf-8")
    )

    const campanhaPath = path.join(__dirname, "src/data/campanha.json");
    const campanhaJson = JSON.parse(
      fs.readFileSync(campanhaPath, "utf-8")
    )

    // Cadastrar tipos de alimentos sem repetir
    const tiposCadastrados = {};
    for (const alimento of alimentos) {
      if (!tiposCadastrados[alimento.tipoAlimento]) {
        const tipo = await TipoAlimento.create({
          tipoAlimento: alimento.tipoAlimento,
        });
        tiposCadastrados[alimento.tipoAlimento] = tipo.idTipoAlimento;
      }
    }

    // Cadastrar alimentos com o ID correto do tipo
    for (const alimento of alimentos) {
      await Alimento.create({
        alimento: alimento.alimento,
        idTipoAlimento: tiposCadastrados[alimento.tipoAlimento], // Relaciona corretamente
      });
    }
    console.log("Tipos de alimentos e alimentos cadastrados com sucesso!");

    for (const situacaoHabitacional of situacaoHabitacionaljson) {
      await SituacaoHabitacional.create(situacaoHabitacional);
    }

    console.log("Situação habitacional cadastrada com sucesso!");

    for (const situacaoProfissional of situacaoProfissionaljson) {
      await SituacaoProfissional.create(situacaoProfissional);
    }

    console.log("Situação profissional cadastrada com sucesso!");

    for (const pessoa of pessoasJson) {
      await PessoaController.criar(
        pessoa.nome,
        pessoa.cpf,
        pessoa.telefone,
        pessoa.email,
        pessoa.dtNascimento,
        pessoa.sexo,
        pessoa.endereco
      );
    }
    console.log("Pessoas criadas");

    for (const organizacao of organizacoesJson) {
      await OrganizacaoController.criar(
        organizacao.organizacao,
        organizacao.cnpj,
        organizacao.telefone,
        organizacao.email,
        organizacao.idSecretaria,
        organizacao.endereco,
      );
    }

    console.log("Organizações criadas");

    for (const grauParentesco of grauParentescoJson) {
      await GrauParentesco.create(grauParentesco);
    }

    console.log("Grau de parentesco criado");

    for (const donatario of donatariosJson) {
      await DonatarioController.criar(
        donatario.idPessoa,
        donatario.idSituacaoHabitacional,
        donatario.tempoResidencia,
        donatario.rendaFamiliar,
        donatario.idSituacaoProfissional,
        donatario.cadastroCrass,
        donatario.outroLocal,
        donatario.enfermoEmCasa,
        donatario.enfermoEmCasa,
        donatario.dataCadastro,
        donatario.idOrganizacao,
        donatario.responsavelVisita,
        donatario.observacao,
        donatario.dtEntragaCesta,
        donatario.dependentes
      );
    }

    console.log("Donatários criados");

    for (const dependente of dependentesJson) {
      await DependenteController.criar(
        dependente.idPessoa,
        dependente.idProvedor,
        dependente.idGrauParentesco
      );
    }

    console.log("Dependentes criados");

    for (const unidadeMedida of unidadeMedidaJson) {
      await UnidadeMedidaController.criar(unidadeMedida.dsUnidadeMedida);
    }

    console.log("Unidade de medidas criadas");

    for (const campanha of campanhaJson) {
      await CampanhaController.criar(
        campanha.titulo,
        campanha.descricao,
        campanha.dtInicio,
        campanha.dtFinal,
        campanha.idOrganizacao
      );
    }

    console.log("Campanhas criadas");

    for (const movimentacao of movimentacaoJson) {
      await MovimentacaoController.criar(
        movimentacao.ieMovimentacao,
        movimentacao.idOrganizacao,
        movimentacao.idDoador,
        movimentacao.idDonatario,
        movimentacao.idCampanha,
        movimentacao.alimentos
      );
    }

    console.log("Movimentações criadas");

  } catch (error) {
    console.error(`Erro ao inicializar o banco de dados: ${error}`);
  }
};

createTables().then(() => {
  if (!process.env.TEST) {
    app.listen(3000, () => {
      console.log("Server running on port 3000");
    });
  }
});

module.exports = app;
