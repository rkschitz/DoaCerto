import React from "react";
import styles from "./registrar.module.css";
import { registerPerson } from "../../api/person.jsx";
import { useState, useContext } from "react";
import { AuthContext } from "../../auth/Context.jsx";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function CadastroPessoa() {
  const [name, setName] = useState('');
  const [CPF, setCPF] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [number, setTelefone] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [role, setRole] = useState('U');

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const submitRegistro = async (e) => {
    e.preventDefault();

    if (!name || !CPF || !email || !password || !number || !birthdate || !role) {
      return alert('Preencha todos os campos para continuar!');
    }

    try {
      const response = await registerPerson({CPF, name, email, password, number, birthdate, role});
      
      if (response.data.token) {
        login(response.data.token);
        return navigate('/');
      }
      return toast.error(response.data.mensagem);

    } catch (error) {
      if (error.response.status === 403) {
        return alert("Sem permissão.");
      }
      if (error.response.status === 401 || error.response.status === 404) {
        return alert('Email ou password inválido, tente novamente!');
      }
      return alert('Erro inesperado, tente novamente mais tarde!');
    }

  }

  return (
    <>
      <title>DoaCerto - Registro</title>
      <div>
        <div className={styles.pageCentral}>
          <div className={styles.backgroundHeader}>
            <h1>
              <b>Resgistre-se como</b> Organização
            </h1>
          </div>
          <div className={styles.form}>
            <div className={styles.formContainer}>
              <form>
                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label>Nome</label>
                    <input type="text" placeholder="Nome Completo"
                      value={name} onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  {/* <div className={styles.formGroup}>
                    <label>CEP</label>
                    <input type="text" placeholder="00000-000" />
                  </div> */}
                  <div className={styles.formGroup}>
                    <label>CPF</label>
                    <input type="text" placeholder="00.000.000/0000-00"
                      value={CPF} onChange={(e) => setCPF(e.target.value)}
                    />
                  </div>
                  {/* <div className={styles.formGroup}>
                    <label>Estado</label>
                    <input type="text" placeholder="Estado" />
                  </div> */}
                  <div className={styles.formGroup}>
                    <label>Email</label>
                    <input type="email" placeholder="Email"
                      value={email} onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  {/* <div className={styles.formGroup}>
                    <label>Cidade</label>
                    <input type="text" placeholder="Cidade" />
                  </div> */}
                  <div className={styles.formGroup}>
                    <label>Senha</label>
                    <input type="password" placeholder="Senha"
                      value={password} onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  {/* <div className={styles.formGroup}>
                    <label>Complemento</label>
                    <input type="text" placeholder="Complemento" />
                  </div> */}
                  <div className={styles.formGroup}>
                    <label>Número de Telefone</label>
                    <input type="tel" placeholder="Número"
                      value={number} onChange={(e) => setTelefone(e.target.value)}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Data de Nascimento</label>
                    <input type="date"
                      value={birthdate} onChange={(e) => setBirthdate(e.target.value)}
                    />
                  </div>
                </div>
                <div className={styles.submitContainer}>
                  <button type="submit" className={styles.submitBtn} onClick={submitRegistro}>
                    Finalizar
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};