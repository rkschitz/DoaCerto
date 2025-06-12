import { useEffect, useState } from "react";
import { buscarPessoas, deletarPessoa } from "../../api/pessoa";
import formatarDataBR from "../../utils/formatarDataBR";
import ModalPessoa from "./ModalPessoa";
import styles from "./pessoa.module.css";
import { toast } from "react-toastify";

export default function Pessoa() {
  const [pessoas, setPessoas] = useState([]);
  const [abrirModalPessoa, setAbrirModalPessoa] = useState(false);
  const [pessoaSelecionada, setPessoaSelecionada] = useState(null);

  const listarPessoas = async () => {
    try {
      const response = await buscarPessoas();
      const lista = response.data ?? response;
      setPessoas(Array.isArray(lista) ? lista : []);
    } catch (err) {
      console.error("Erro ao buscar pessoas:", err);
    }
  };

  const handleDelete = async (idPessoa) => {
    try {
      const response = await deletarPessoa(idPessoa);
      setPessoas(pessoas.filter((pessoa) => pessoa.idPessoa !== idPessoa));
      toast(response.data.message);
    } catch (e) {
      toast.error(e.response.data.error)
    }
  };

  useEffect(() => {
    listarPessoas();
  }, []);

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
    <div className={styles.containerPessoa}>
      <div className={styles.header}>
        <h1>Gerenciar Pessoas</h1>
        <button
          className={styles.addButton}
          onClick={() => setAbrirModalPessoa(true)}
        >
          Adicionar Pessoa
        </button>
      </div>

      <div className={styles.cardsGrid}>
        {pessoas.map((pessoa) => (
          <div key={pessoa.idPessoa} className={styles.card}>
              <div className={styles.cardAcoes}>
                <h2 className={styles.nome}>{pessoa.nome}</h2>
                <div className={styles.botoesAcoes}>
                  <button
                    className={styles.editarButton}
                    onClick={() => {
                      setPessoaSelecionada(pessoa);
                      setAbrirModalPessoa(true);
                    }}
                  >
                    Editar
                  </button>
                  <button
                    className={styles.excluirButton}
                    onClick={() => handleDelete(pessoa.idPessoa)}
                  >
                    Excluir
                  </button>
                </div>
              </div>
            <div className={styles.info}>
              <p>
                <strong>CPF:</strong> {cpfMask(pessoa.cpf)}
              </p>
              <p>
                <strong>Telefone:</strong> {foneMask(pessoa.telefone)}
              </p>
              <p>
                <strong>Email:</strong> {pessoa.email}
              </p>
              <p>
                <strong>Data de Nascimento:</strong>{" "}
                {formatarDataBR(pessoa.dtNascimento)}
              </p>
              <p>
                <strong>Sexo:</strong>{" "}
                {pessoa.sexo === "M" ? "Masculino" : "Feminino"}
              </p>
              <p> <strong>Rua:</strong> {pessoa.endereco?.rua} Número: {pessoa.endereco?.numero} Complemento: {pessoa.endereco?.complemento} </p><br />
              <p> <strong>Bairro:</strong> {pessoa.endereco?.bairro} <strong>Estado:</strong> {pessoa.endereco?.estado} <strong>Pais:</strong> {pessoa.endereco?.pais} </p>
            </div>
          </div>
        ))}
      </div>

      <ModalPessoa
        show={abrirModalPessoa}
        setShow={setAbrirModalPessoa}
        pessoaSelecionada={pessoaSelecionada}
        onSubmit={listarPessoas}
        onCancel={() => { listarPessoas(); setPessoaSelecionada(null) }}
      />
    </div >
  );
}
