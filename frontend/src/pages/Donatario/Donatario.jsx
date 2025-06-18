import { useEffect, useState } from "react";
import { excluirDonatario, buscarDonatarios, } from "../../api/donatario";
import PessoaLocalizador from "../../components/Localizadores/LocalizadorPessoa/LocalizadorPessoa";
import calcularIdade from "../../utils/calcularIdade";
import formatarDataBR from "../../utils/formatarDataBR";
import styles from "./donatario.module.css";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { FaRegTrashAlt, FaRegEdit, FaCheck, FaTimes } from "react-icons/fa";
import ModalDonatario from "./ModalDonatario";
import ModalAprovacaoDonatario from "./ModalAprovacaoDonatario";
import { toast } from "react-toastify";
import SelectSituacaoDonatario from "../../components/Selects/SelectSituacaoDonatario/SelectSituacaoDonatario";
import ModalReprovacaoDonatario from "./ModalReprovacaoDonatario";
import MovimentacaoModal from "../Movimentacao/ModalMovimentacao";
import ModalHistoricoDoacoes from "./ModalHistoricoDoacoes";
import { Button } from "react-bootstrap";

export default function Donatario() {
  const [donatarios, setDonatarios] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [openLocalizadorPessoa, setOpenLocalizadorPessoa] = useState(false);
  const [selectedDonatario, setSelectedDonatario] = useState(null);
  const [expandirDonatario, setExpandirDonatario] = useState(null);
  const [abrirModalAprovacao, setAbrirModalAprovacao] = useState(false);
  const [abrirModalReprovacao, setAbrirModalReprovacao] = useState(false);
  const [filtros, setFiltros] = useState({ situacaoCadastral: 'A', nome: null });
  const [abrirModalMovimentacao, setAbrirModalMovimentacao] = useState(false);
  const [movimentacao, setMovimentacao] = useState(null);
  const [abrirModalHistoricoDoacoes, setAbrirModalHistoricoDoacoes] = useState(false);

  const toggleExpand = (index) => {
    setExpandirDonatario(expandirDonatario === index ? null : index);
  };

  async function listar() {
    try {
      const response = await buscarDonatarios({
        situacaoCadastral: filtros?.situacaoCadastral,
        nome: filtros?.nome
      });
      setDonatarios(response.data);
    } catch (error) {
      toast.error("Erro ao buscar donatários:", error);
    }
  }

  useEffect(() => {
    listar();
  }, [filtros]);

  const handleDelete = async (idDonatario) => {
    if (window.confirm("Você tem certeza que deseja excluir esse donatário?")) {
      try {
        const response = await excluirDonatario(idDonatario);
        toast(response.data.message)
      } catch (e) {
        toast.error(e.response.data.error)
      }
      listar(filtros?.situacaoCadastral);
    }
  };

  const handleAddNew = () => {
    setSelectedDonatario(null);
    setOpenModal(true);
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
    <div className={styles.paginaDonatario}>
      <div className={styles.containerDonatarios}>
        <div className={styles.header}>
          <div className={styles.titulo}>Donatários</div>
          <SelectSituacaoDonatario
            onChange={(e) => { setFiltros({ ...filtros, situacaoCadastral: e }) }}
            value={filtros?.situacaoCadastral}
          />
          <input type="text" value={filtros?.nome} onChange={(e) => setFiltros({ ...filtros, nome: e.target.value })} />
          <Button className={styles.btnBuscar} onClick={() => listar(filtros?.situacaoCadastral, filtros?.nome)}>Buscar</Button>
          <div>
            <button className={styles.buttonAdicionar} onClick={handleAddNew}>
              Adicionar novo donatário
            </button>
          </div>
        </div>

        <div className={styles.conteudo}>
          <div className={styles.conteudo}>
            {donatarios.map((donatario, index) => (
              <div key={index} className={styles.cardDonatario}>
                <div className={styles.cardHeader}>
                  <h2>{donatario?.pessoa?.nome}</h2>
                  <div className={styles.actions}>
                    {donatario.situacaoCadastral === "A" && <button className={styles.btnCesta} onClick={() => {
                      setMovimentacao({
                        ieMovimentacao: 'S',
                        idDonatario: donatario.idDonatario,
                        idCampanha: null,
                        idDoador: null,
                        alimentos: [{
                          idAlimento: 1,
                          quantidade: 1,
                          idUnidadeMedida: 1,
                        }],
                        dataMovimentacao: formatarDataBR(new Date()),
                      });; setAbrirModalMovimentacao(true)
                    }}><FaCheck /> Registrar entrega de cesta</button>}
                    {(donatario.situacaoCadastral === "P" || donatario.situacaoCadastral === "R") &&
                      <button className={styles.btnAprovar}
                        onClick={() => {
                          setSelectedDonatario(donatario); setAbrirModalAprovacao(true)
                        }}
                      >
                        <FaCheck /> Aprovar cadastro
                      </button>}
                    {donatario.situacaoCadastral === "P" &&
                      <button className={styles.btnReprovar}
                        onClick={() => { setSelectedDonatario(donatario); setAbrirModalReprovacao(true) }}
                      >
                        <FaTimes /> Reprovar cadastro
                      </button>}

                    <button
                      className={styles.actionEditar}
                      onClick={() => { setSelectedDonatario(donatario); setOpenModal(true) }}
                    >
                      <FaRegEdit /> Editar
                    </button>
                    <button
                      className={styles.actionExcluir}
                      onClick={() => handleDelete(donatario.idDonatario)}
                    >
                      <FaRegTrashAlt /> Excluir
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
                      <p>
                        <strong>Nacionalidade:</strong>{" "}
                        {donatario.nacionalidade?.nacionalidade}
                      </p>
                    </div>

                    <div className={styles.section}>
                      <h4>Contato</h4>
                      <p>
                        <strong>Telefone:</strong>{" "}
                        {foneMask(donatario.pessoa.telefone)}
                      </p>
                      <p>
                        <strong>Endereço:</strong>
                        {donatario.pessoa?.endereco?.enderecoCompleto}
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
                        {donatario.situacaoProfissional?.situacaoProfissional}
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
                        <strong>Data da visita:</strong>{" "}
                        {formatarDataBR(donatario?.dataVisita)}
                      </p>
                    </div>
                    <button onClick={() => { setSelectedDonatario(donatario); setAbrirModalHistoricoDoacoes(true) }}>Histórico de doações</button>
                  </div>
                )}
              </div>
            ))}
          </div>

          <PessoaLocalizador
            onSelect={(pessoa) => setSelectedDonatario({
              ...selectedDonatario,
              idPessoa: pessoa.idPessoa,
              nome: pessoa.nome,
              CPF: pessoa.cpf,
              dtNascimento: pessoa.dtNascimento,
              email: pessoa.email,
              sexo: pessoa.sexo,
              telefone: pessoa.telefone,
            })}
            show={openLocalizadorPessoa}
            setShow={setOpenLocalizadorPessoa}
          />
          <ModalDonatario
            show={openModal}
            setShow={setOpenModal}
            donatarioSelecionado={selectedDonatario}
            onSubmit={() => { listar(); setSelectedDonatario(null) }}
            onCancel={() => setSelectedDonatario(null)}
          />
          <ModalAprovacaoDonatario
            show={abrirModalAprovacao}
            setShow={setAbrirModalAprovacao}
            donatarioSelecionado={selectedDonatario}
            onSubmit={() => listar()}
            onCancel={() => setSelectedDonatario(null)}
          />
          <ModalReprovacaoDonatario
            show={abrirModalReprovacao}
            setShow={setAbrirModalReprovacao}
            donatarioSelecionado={selectedDonatario}
            onSubmit={() => listar()}
            onCancel={() => setSelectedDonatario(null)}
          />
          <MovimentacaoModal
            show={abrirModalMovimentacao}
            setShow={setAbrirModalMovimentacao}
            movimentacaoSelecionada={movimentacao}
          />
          <ModalHistoricoDoacoes
            show={abrirModalHistoricoDoacoes}
            setShow={setAbrirModalHistoricoDoacoes}
            donatarioSelecionado={selectedDonatario}
          />
        </div>
      </div>
    </div>
  );
}
