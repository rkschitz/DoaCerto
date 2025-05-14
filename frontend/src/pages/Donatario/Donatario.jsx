import { useEffect, useState } from "react";
import {
  criarDonatario,
  editarDonatario,
  excluirDonatario,
  buscarDonatariosAtivos,
} from "../../api/donatario";
import CustomModal from "../../components/Modal/Modal";
import { Form, FloatingLabel, Row, Col } from "react-bootstrap";
import PessoaLocalizador from "../../components/Localizadores/LocalizadorPessoa/LocalizadorPessoa";
import SituacaoProfissionalSelect from "../../components/Selects/SelectSituacaoProfissional/SelectSituacaoProfissional"
import SexoSelect from "../../components/Selects/SelectSexo/SelectSexo";
import SituacaoHabitacionalSelect from "../../components/Selects/SelectSituacaoHabitacional/SelectSituacaoHabitacional";
import RadioGroup from "../../components/RadioButton/RadioButton";
import calcularIdade from "../../utils/calcularIdade";
import GrauParentescoSelect from "../../components/Selects/SelectGrauParentesco/SelectGrauParentesco";
import formatarDataBR from "../../utils/formatarDataBR";
import styles from "./donatario.module.css";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { FaRegTrashAlt, FaRegEdit } from "react-icons/fa";
import ModalDonatario from "./ModalDonatario";

export default function Donatario() {
  const [donatarios, setDonatarios] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [openLocalizadorPessoa, setOpenLocalizadorPessoa] = useState(false);
  const [selectedDonatario, setSelectedDonatario] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [dependentes, setDependentes] = useState([]);
  const [localizadorPara, setLocalizadorPara] = useState("donatario");
  const [expandirDonatario, setExpandirDonatario] = useState(null);

  const toggleExpand = (index) => {
    setExpandirDonatario(expandirDonatario === index ? null : index);
  };

  async function listar() {
    try {
      const response = await buscarDonatariosAtivos();
      setDonatarios(response.data);
      console.log(response)
    } catch (error) {
      console.error("Erro ao buscar donatários:", error);
    }
  }
  useEffect(() => {
    listar();
  }, []);

  const adicionarDependenteAut = async () => {
    const novoDonatario = {
      idPessoa: 2,
      idSituacaoHabitacional: 1,
      tempoResidencia: "2 meses",
      rendaFamiliar: 2000,
      idSituacaoProfissional: 1,
      cadastroCras: false,
      outroLocal: null,
      enfermoNaCasa: false,
      situacaoEnfermo: null,
      idOrganizacao: 2,
      responsavelVisita: 1,
      observacao: "observações",
      dtEntregaCesta: "2023-10-01",
      nacionalidade: "Brasileiro",
      dependentes: [
        {
          idPessoa: 3,
          idade: 10,
          idGrauParentesco: 1,
        },
        {
          idPessoa: 4,
          idade: 5,
          idGrauParentesco: 2,
        },
      ],
    };

    const response = await criarDonatario(novoDonatario);
  };

  const handleSubmit = async () => {
    const donatarioFinal = { ...selectedDonatario, dependentes };

    if (!isEditMode) {
      try {
        const response = await criarDonatario(donatarioFinal);
        if (response.status === 200) {
          alert("Donatário cadastrado com sucesso!");
        } else {
          alert("Erro ao cadastrar donatário.");
        }
      } catch (error) {
        console.error("Erro ao cadastrar donatário:", error);
        alert("Erro ao cadastrar donatário.");
      }
    } else {
      try {
        const response = await editarDonatario(donatarioFinal);
        if (response.status === 200) {
          alert("Donatário editado com sucesso!");
        } else {
          alert("Erro ao editar donatário.");
        }
        console.log(response);
      } catch (e) {
        console.error("Erro ao editar donatário:", e);
        alert("Erro ao editar donatário.");
      }
    }
    setOpenModal(false);
    setSelectedDonatario(null);
    setIsEditMode(false);
    setDependentes([]);
    listar();
  };

  const handleReset = () => {
    setOpenModal(false);
    setSelectedDonatario(null);
    setIsEditMode(false);
    setDependentes([]);
  };

  const handleDelete = async (idDonatario) => {
    if (window.confirm("Você tem certeza que deseja excluir esse donatário?")) {
      const response = await excluirDonatario(idDonatario);
      if (response.status === 200) {
        alert("Donatário excluído com sucesso!");
      } else {
        alert("Erro ao excluir donatário.");
      }
      listar();
    }
  };

  const handleEdit = (person) => {
    setSelectedDonatario(person);
    setDependentes(
      person.dependentes.map((dependente) => ({
        idDependente: dependente.idDependente,
        idPessoa: dependente.pessoa.idPessoa,
        nome: dependente.pessoa.nome,
        idGrauParentesco: dependente.grauParentesco.idGrauParentesco,
      }))
    );
    setIsEditMode(true);
    setOpenModal(true);
  };

  const limparFormulario = () => {
    setSelectedDonatario({
      idPessoa: "",
      nome: "",
      CPF: "",
      dtNascimento: "",
      idSituacaoHabitacional: "",
      tempoResidencia: "",
      rendaFamiliar: "",
      idSituacaoProfissional: "",
      cadastroCras: false,
      outroLocal: "",
      enfermoNaCasa: false,
      situacaoEnfermo: "",
      responsavelVisita: 1,
      observacao: "",
      dtEntregaCesta: "",
      dependentes: [],
    });
  };

  const handleAddNew = () => {
    limparFormulario();
    setIsEditMode(false);
    setOpenModal(true);
    setDependentes([]);
  };

  const cpfMask = (value) => {
    if (!value) return "";
    return value
      .replace(/\D/g, "")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})/, "$1-$2")
      .replace(/(-\d{2})\d+?$/, "$1");
  };

  const foneMask = (value) => {
    if (!value) return "";
    return value
      .replace(/\D/g, "")
      .replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3")
      .replace(/(-\d{4})\d+?$/, "$1");
  };

  return (
    <div className={styles.containerDonatarios}>
      <div className={styles.header}>
        <div className={styles.titulo}>Donatários</div>
        <div>
          <button className={styles.buttonAdicionar} onClick={handleAddNew}>
            Adicionar novo donatário
          </button>
          <button
            className={styles.buttonAdicionar}
            onClick={adicionarDependenteAut}
          >
            Adicionar automático
          </button>
        </div>
      </div>

      <div className={styles.conteudo}>
        {/* {donatarios.map((donatario, index) => ( */}
        <div className={styles.conteudo}>
          {donatarios.map((donatario, index) => (
            <div key={index} className={styles.cardDonatario}>
              <div className={styles.cardHeader}>
                <h2>{donatario?.pessoa?.nome}</h2>

                <div className={styles.actions}>
                  <button
                    className={styles.actionExcluir}
                    onClick={() => handleDelete(donatario.idDonatario)}
                  >
                    <FaRegTrashAlt /> Excluir
                  </button>
                  <button
                    className={styles.actionEditar}
                    onClick={() => { setSelectedDonatario(donatario); setOpenModal(true) }}
                  >
                    <FaRegEdit /> Editar
                  </button>
                  <button
                    className={styles.expandirButton}
                    onClick={() => toggleExpand(index)}
                  >
                    {expandirDonatario === index ? (
                      <IoIosArrowUp />
                    ) : (
                      <IoIosArrowDown />
                    )}
                  </button>
                </div>
              </div>

              {expandirDonatario === index && (
                <div className={styles.cardContent}>
                  <div className={styles.section}>
                    <h4>Informações Pessoais</h4>
                    <p>
                      <strong>CPF:</strong> {cpfMask(donatario.pessoa.cpf)}
                    </p>
                    <p>
                      <strong>Data de nascimento:</strong>{" "}
                      {formatarDataBR(donatario.pessoa.dtNascimento)}
                    </p>
                    <p>
                      <strong>Sexo:</strong>{" "}
                      {donatario.pessoa.sexo === "M"
                        ? "Masculino"
                        : "Feminino"}
                    </p>
                  </div>

                  <div className={styles.section}>
                    <h4>Contato</h4>
                    <p>
                      <strong>Telefone:</strong>{" "}
                      {foneMask(donatario.pessoa.telefone)}
                    </p>
                    <p>
                      <strong>Endereço:</strong> Rua {donatario.pessoa?.endereco?.rua} {donatario.pessoa?.endereco?.numero}, {donatario.pessoa?.endereco?.bairro}, {donatario.pessoa?.endereco?.cidade} - {donatario.pessoa?.endereco?.estado}
                    </p>
                  </div>

                  <div className={styles.section}>
                    <h4>Condição Social</h4>
                    <p>
                      <strong>Renda Familiar:</strong>{" "}
                      {donatario.rendaFamiliar}
                    </p>
                    <p>
                      <strong>Cadastro no CRAS:</strong>{" "}
                      {donatario.cadastroCras ? "Sim" : "Não"}
                    </p>
                    <p>
                      <strong>Situação Profissional:</strong>{" "}
                      {donatario.situacaoProfissional.situacaoProfissional}
                    </p>
                  </div>

                  <div className={styles.section}>
                    <h4>Moradores</h4>
                    <table className={styles.tableMoradores}>
                      <thead>
                        <tr>
                          <th>Nome</th>
                          <th>Idade</th>
                          <th>Grau de Parentesco</th>
                        </tr>
                      </thead>
                      <tbody>
                        {donatario.dependentes.map((dep, i) => (
                          <tr key={i}>
                            <td>{dep?.nome}</td>
                            <td>
                              {calcularIdade(dep?.dtNascimento)}
                            </td>
                            <td>{dep?.grauParentesco}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className={styles.footerInfo}>
                    <p>
                      <strong>Data do Cadastro:</strong>{" "}
                      {formatarDataBR(donatario.dataCadastro)}
                    </p>
                    <p>
                      <strong>Secretária:</strong>{" "}
                      {donatario?.organizacao?.secretaria?.nome}
                    </p>
                    <p>
                      <strong>Responsável pela Visita:</strong>{" "}
                      {donatario?.responsavel?.nome}
                    </p>
                    <p>
                      <strong>Observações:</strong> {donatario?.observacao}
                    </p>
                    <p>
                      <strong>Entrega da Cesta:</strong>{" "}
                      {donatario?.dtEntregaCesta}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        {/* ))} */}

        <PessoaLocalizador
          onSelect={(pessoa) => {
            if (localizadorPara === "donatario") {
              setSelectedDonatario({
                ...selectedDonatario,
                idPessoa: pessoa.idPessoa,
                nome: pessoa.nome,
                CPF: pessoa.cpf,
                dtNascimento: pessoa.dtNascimento,
                email: pessoa.email,
                sexo: pessoa.sexo,
                telefone: pessoa.telefone,
              });
            } else {
              const novoDependente = {
                idPessoa: pessoa.idPessoa,
                nome: pessoa.nome,
                idade: pessoa.idade,
                grauParentesco: pessoa.grauParentesco || "",
              };
              setDependentes((prev) => [...prev, novoDependente]);
            }
          }}
          show={openLocalizadorPessoa}
          setShow={setOpenLocalizadorPessoa}
        />
        <ModalDonatario
          show={openModal}
          setShow={setOpenModal}
          donatarioSelecionado={selectedDonatario}
          onSubmit={listar}
        />
      </div>
    </div>
  );
}
