import React, { useState, useContext } from "react";
import styles from "./login.module.css";
import { AuthContext } from "../../auth/Context.jsx";
import { loginOrganizacao } from "../../api/organizacao.jsx";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { IoMdEyeOff, IoMdEye } from "react-icons/io";
import Logo from "../../img/logo-doa-certo.png";

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [mostrarSenha, setMostrarSenha] = useState(false);

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const submitLogin = async (e) => {
    e.preventDefault();

    if (!email || !senha) {
      return alert("Informe o e-mail e a senha para continuar!");
    }

    try {
      const response = await loginOrganizacao(email, senha);
      if (response.data.token) {
        login(response.data.token);
        return navigate("/");
      }
    } catch (e) {
      toast.error(e.response.data.error);
    }
  };

  return (
    <div className={styles.fundoLogin}>
      <div className={styles.cartaoLogin}>
        <div className={styles.areaLogo}>
          <img src={Logo} alt="Logo" className={styles.logo} />

          <span className={styles.textoLogo}>Doa Certo</span>
        </div>

        <h2 className={styles.titulo}>Bem-vindo de volta</h2>
        <p className={styles.subTitulo}>
          Faça login em sua conta para continuar
        </p>
        <form className={styles.formularioLogin}>
          <label className={styles.tipo}>Email</label>
          <div className={styles.grupoInput}>
            <FaEnvelope className={styles.icone} />
            <input
              type="email"
              placeholder="seu@email.com"
              className={styles.campoInput}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <label className={styles.tipo}>Senha</label>
          <div className={styles.grupoInput}>
            <FaLock className={styles.icone} />
            <input
              type={mostrarSenha ? "text" : "password"}
              placeholder="********"
              className={styles.campoInput}
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />
            {mostrarSenha ? (
              <IoMdEye
                className={styles.iconeDireita}
                onClick={() => setMostrarSenha(false)}
              />
            ) : (
              <IoMdEyeOff
                className={styles.iconeDireita}
                onClick={() => setMostrarSenha(true)}
              />
            )}
          </div>
          <div className={styles.opcoes}>
            <a href="#" className={styles.esqueciSenha}>
              Esqueceu a senha?
            </a>
          </div>

          <button
            type="submit"
            className={styles.botaoEntrar}
            onClick={submitLogin}
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}
