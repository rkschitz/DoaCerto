import { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { buscarCampanhas } from "../../api/campanha";
import Logo from "../../img/logo-doa-certo.png";
import styles from "./home.module.css";
import { Link } from "react-router-dom";

export default function Home() {
  const [campanhas, setCampanhas] = useState([]);
  const carregou = useRef(false);
  const navigate = useNavigate();
  const location = useLocation();

  async function buscar() {
    const response = await buscarCampanhas({ ativos: true });
    setCampanhas(response.data);
  }

  useEffect(() => {
    if (!carregou.current) {
      buscar();
      carregou.current = true;
    }
  }, []);

  return (
    <div>
      <header className={styles.header}>
        <img src={Logo} alt="Logo" className={styles.logo} />
        <div className={styles.authButtons}>
          <div className={styles.dropdown}>
            <button className={styles.loginBtn}>Registrar-se</button>
            <div className={styles.dropdownOptions}>
              <button
                className={styles.btnAuth}
                onClick={() => navigate("/registerDoador")}
              >
                Doador
              </button>
              <button
                className={styles.btnAuth}
                onClick={() => navigate("/registerPerson")}
              >
                Organização
              </button>
            </div>
          </div>
          <button
            className={styles.loginBtn}
            onClick={() => navigate("/login")}
          >
            Login
          </button>
        </div>
      </header>

      <div className={styles.body}>
        <div className={styles.infosTop}>
          <div className={styles.sobre}>
            <div className={styles.textos}>
              <h1>Ajude quem precisa com doações de alimentos</h1>
              <h6>
                Unindo comunidades e igrejas para combater a fome. Faça parte
                desta missão e contribua com as campanhas ativas.
              </h6>
            </div>

            <div className={styles.image}>
              <img src={Logo} alt="Logo" className={styles.logo2} />
            </div>
          </div>
        </div>

        <div className={styles.center}>
          <h1>Campanhas em Andamento</h1>
          <p>
            Conheça as campanhas de arrecadação de alimentos que estão
            acontecendo agora e faça sua contribuição para ajudar quem mais
            precisa.
          </p>
        </div>

        <div className={styles.container}>
          {campanhas.map((campanha) => (
            <div className={styles.campanha} key={campanha.idCampanha}>
              <h2>{campanha.titulo}</h2>
              <p>{campanha.descricao}</p>

              {campanha.metas?.map((meta, index) => (
                <div key={index}>
                  <p>
                    <span className={styles.unidade}>Alimento:</span>{" "}
                    {meta.alimento} {meta.unidadeMedida}
                  </p>

                  <div className={styles.metasInfo}>
                    <div className={styles.card}>
                      <div className={styles.cardTitulo}>Meta</div>
                      <div className={styles.cardValor}>
                        {Number(meta.meta).toLocaleString("pt-BR", {
                          minimumFractionDigits: 3,
                        })}{" "}
                        {meta.unidadeMedida}
                      </div>
                    </div>
                    <div className={styles.card}>
                      <div className={styles.cardTitulo}>Faltando</div>
                      <div className={styles.cardValor}>
                        {Number(meta.quantidadeFaltante).toLocaleString(
                          "pt-BR",
                          { minimumFractionDigits: 3 }
                        )}{" "}
                        {meta.unidadeMedida}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <p className={styles.contato}>Contato: (47) 90011-2233</p>
            </div>
          ))}
        </div>
        <div className={styles.footer}>
          <h1>Faça a Diferença Hoje</h1>
          <p>
            Junte-se a nós nesta missão de ajudar quem mais precisa. Sua doação
          </p>
          <a>pode transformar vidas e trazer esperança.</a>
        </div>
      </div>
    </div>
  );
}
