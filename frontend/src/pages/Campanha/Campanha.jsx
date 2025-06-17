import { useEffect, useState, useContext } from "react";
import { buscarCampanhas, editarCampanha } from "../../api/campanha";
import { AuthContext } from "../../auth/Context";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { Button } from "react-bootstrap";
import ModalCampanha from "./ModalCampanha";
import styles from "./Campanha.module.css";
import SelectSituacaoCampanha from "../../components/Selects/SelectSituacaoCampanha/SelectSituacaoCampanha";

export default function Campanha() {
  const [campanhas, setCampanhas] = useState([]);
  const [campanhaSelecionada, setCampanhaSelecionada] = useState(null);
  const [show, setShow] = useState(false);
  const [filtros, setFiltros] = useState({});
  const [expandirCampanha, setExpandirCampanha] = useState(null);

  const { id } = useContext(AuthContext);

  async function buscar(p_filtros = filtros) {
    const response = await buscarCampanhas({
      idOrganizacao: id,
      ativos: p_filtros?.ativos ?? true,
      titulo: p_filtros?.titulo,
    });
    setCampanhas(response.data);
  }

  const toggleExpand = (index) => {
    setExpandirCampanha(expandirCampanha === index ? null : index);
  };

  async function handleSituacao(campanha) {
    campanha.ieSituacao = campanha.ieSituacao !== "I" ? "I" : "A";
    const response = await editarCampanha(campanha);
    if (response.status === 200) {
      setCampanhas((prev) =>
        prev.filter((c) => c.idCampanha !== campanha.idCampanha)
      );
    }
  }

  useEffect(() => {
    buscar();
  }, []);

  return (
    <div className={styles.paginaCampanha}>
      <h1 className={styles.tituloCampanha}>Campanha</h1>

      <div className={styles.header}>
        <SelectSituacaoCampanha
          onChange={(e) => {
            const novoFiltro = { ...filtros, ativos: e };
            setFiltros(novoFiltro);
            buscar(novoFiltro);
          }}
          value={filtros?.ativos}
        />
        <div className={styles.filtros}>
          <input
            type="text"
            placeholder="Título da campanha"
            value={filtros?.titulo || ""}
            onChange={(e) => setFiltros({ ...filtros, titulo: e.target.value })}
          />
          <Button onClick={() => buscar()}>Buscar</Button>
          <Button onClick={() => setShow(true)}>Adicionar campanha</Button>
        </div>
      </div>

      <div className={styles.listaCampanhas}>
        {campanhas.map((campanha, index) => (
          <div key={campanha.idCampanha} className={styles.cardCampanha}>
            <div className={styles.cardHeader}>
              <div className={styles.cardInfo}>
                <h2>{campanha.titulo}</h2>
                <p>{campanha.descricao}</p>
              </div>
              <div className={styles.cardActions}>
                <button
                  className={
                    campanha.ieSituacao === "A"
                      ? styles.btnInativar
                      : styles.btnAtivar
                  }
                  onClick={() => handleSituacao(campanha)}
                >
                  {campanha.ieSituacao === "A" ? "Inativar" : "Ativar"} campanha
                </button>
                <button
                  className={styles.btnSelecionar}
                  onClick={() => {
                    setCampanhaSelecionada(campanha);
                    setShow(true);
                  }}
                >
                  Editar campanha
                </button>
                <button
                  className={styles.expandirButton}
                  onClick={() => toggleExpand(index)}
                >
                  {expandirCampanha === index ? (
                    <IoIosArrowUp />
                  ) : (
                    <IoIosArrowDown />
                  )}
                </button>
              </div>
            </div>

            {expandirCampanha === index && (
              <div className={styles.metasContainer}>
                {campanha.metas?.map((meta, i) => (
                  <div key={i} className={styles.metaCard}>
                    <p>
                      <strong>Meta:</strong> {meta.meta}
                    </p>
                    <p>
                      <strong>Alimento:</strong> {meta.alimento}{" "}
                      {meta.unidadeMedida}
                    </p>
                    <p>
                      <strong>Quantidade doada:</strong> {meta.quantidadeDoada}
                    </p>
                    <p>
                      <strong>Quantidade faltante:</strong>{" "}
                      {meta.quantidadeFaltante}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <ModalCampanha
        show={show}
        setShow={setShow}
        campanhaSelecionada={campanhaSelecionada}
        onSubmit={buscar}
        onCancel={() => {
          buscar();
          setCampanhaSelecionada(null);
        }}
      />
    </div>
  );
}
