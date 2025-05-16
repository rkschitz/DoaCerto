import { useEffect, useState, useRef } from "react";
import { buscarCampanhas } from "../../api/campanha";
import Logo from "../../img/logo-doa-certo.png";
import styles from "./home.module.css";
import { Link } from "react-router-dom"

export default function Home() {
  const [campanhas, setCampanhas] = useState([]);
  const carregou = useRef(false);

  async function buscar() {
    const response = await buscarCampanhas(null, true);
    setCampanhas(response.data);
  }

  useEffect(() => {
    if (!carregou.current) {
      buscar();
      carregou.current = true;
    }
  }, []);

  return (
    <div className={styles.body}>
      <header>
        <a href="/login">Fazer login</a>
      </header>

      <div className={styles.infosTop}>
        <div className={styles.sobre}>
          <div className={styles.textos}>
            <h1>Ajude quem precisa com doações de alimentos</h1>
            <h6>
              Unindo comunidades e igrejas para combater a fome. Faça parte
              desta missão e contribua com as campanhas ativas.
            </h6>
            <a href="/login"><button>Doar Agora</button></a>
          </div>

          <div className={styles.image}>
            <img src={Logo} alt="Logo" className={styles.logo} />
          </div>
        </div>
      </div>

      <div className={styles.center}>
        <h1>Campanhas em Andamento</h1>
        <p>
          Conheça as campanhas de arrecadação de alimentos que estão acontecendo
          agora e faça sua contribuição para ajudar quem mais precisa.
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
                  <span>
                    Meta
                    {meta.meta} {meta.unidadeMedida}
                  </span>
                  <span>
                    Faltando
                    {meta.quantidadeFaltante} {meta.unidadeMedida}
                  </span>
                </div>
              </div>
            ))}

            <p className={styles.contato}>Contato: (47) 90011-2233</p>
            <button className={styles.botaoDoar}>Doar Agora</button>
          </div>
        ))}
      </div>
    </div>
  );
}
