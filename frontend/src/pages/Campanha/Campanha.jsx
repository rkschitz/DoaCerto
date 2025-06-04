import { useEffect, useState, useRef, useContext } from "react";
import { buscarCampanhas, editarCampanha } from "../../api/campanha";
import { AuthContext } from "../../auth/Context";
import RadioGroup from "../../components/RadioButton/RadioButton";
import { Button } from "react-bootstrap";
import ModalCampanha from "./ModalCampanha";
import styles from './Campanha.module.css';
import SelectSituacaoCampanha from "../../components/Selects/SelectSituacaoCampanha/SelectSituacaoCampanha";

export default function Campanha() {
    const [campanhas, setCampanhas] = useState([]);
    const [campanhaSelecionada, setCampanhaSelecionada] = useState(null);
    const [show, setShow] = useState(false);
    const [filtros, setFiltros] = useState({ativos: true})

    const { id, role } = useContext(AuthContext);
    const carregou = useRef(false);

    async function buscar() {
        const response = await buscarCampanhas({ idOrganizacao: id, ativos: filtros?.ativos, titulo: filtros?.titulo });
        setCampanhas(response.data);
    }

    async function handleSituacao(campanha) {
        campanha.ieSituacao != "I" ? campanha.ieSituacao = "I" : campanha.ieSituacao = "A";
        const response = await editarCampanha(campanha);
        if (response.status === 200) {
            setCampanhas((prevCampanhas) =>
                prevCampanhas.filter((c) => c.idCampanha !== campanha.idCampanha)
            );
        }
    }

    useEffect(() => {
        console.log(filtros)
        if (!carregou.current) {
            buscar();
            carregou.current = true;
        }
    }, []);

    return (
        <div className={styles.paginaCampanha}>
            <h1 className={styles.tituloCampanha}>Campanha</h1>
            {/* <div className={styles.filtroCampanha}>
                <RadioGroup
                    title="Filtro"
                    options={[
                        { value: true, label: "Ativa" },
                        { value: false, label: "Inativa" }
                    ]}
                    selectedValue={buscarAtivas}
                    onChange={(e) => setBuscarAtivas(e.target.value === "true")}
                />
            </div> */}
            <div className={styles.header}>
                <div className={styles.titulo}>Donatários</div>
                <SelectSituacaoCampanha
                    onChange={(e) => { setFiltros({ ...filtros, ativos: e }); buscar() }}
                    value={filtros?.ativos}
                />
                <input type="text" value={filtros?.titulo} onChange={(e) => setFiltros({ ...filtros, titulo: e.target.value })} />
                <Button onClick={() => buscar()}>Buscar</Button>
                <div>
                    <Button onClick={() => setShow(true)}>Adicionar campanha</Button>
                </div>
            </div>
            <p className={styles.descricaoPagina}>Essa é a página de campanha.</p>
            <div className={styles.listaCampanhas}>
                {campanhas.map((campanha) => (
                    <div key={campanha.idCampanha} className={styles.cardCampanha}>
                        <h2>{campanha.titulo}</h2>
                        <p>{campanha.descricao}</p>
                        <Button className={styles.btnSituacao} onClick={() => handleSituacao(campanha)}>
                            {campanha.ieSituacao === 'A' ? 'Inativar' : 'Ativar'} campanha
                        </Button>

                        <div className={styles.metasContainer}>
                            {campanha.metas?.map((meta, index) => (
                                <div key={index} className={styles.metaCard}>
                                    <p><strong>Meta:</strong> {meta.meta}</p>
                                    <p><strong>Alimento:</strong> {meta.alimento} {meta.unidadeMedida}</p>
                                    <p><strong>Quantidade doada:</strong> {meta.quantidadeDoada}</p>
                                    <p><strong>Quantidade faltante:</strong> {meta.quantidadeFaltante}</p>
                                </div>
                            ))}
                        </div>

                        <button
                            className={styles.btnSelecionar}
                            onClick={() => {
                                setCampanhaSelecionada(campanha);
                                setShow(true);
                            }}
                        >
                            Editar campanha
                        </button>
                    </div>
                ))}
            </div>

            <ModalCampanha
                show={show}
                setShow={setShow}
                campanhaSelecionada={campanhaSelecionada}
                onSubmit={buscar}
                onCancel={() => { buscar(); setCampanhaSelecionada(null) }}
            />
        </div>
    );
}
