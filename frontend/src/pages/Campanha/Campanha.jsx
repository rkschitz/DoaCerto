import { useEffect, useState, useRef, useContext } from "react";
import { buscarCampanhas, editarCampanha } from "../../api/campanha";
import { AuthContext } from "../../auth/Context";
import RadioGroup from "../../components/RadioButton/RadioButton";
import { Button } from "react-bootstrap";
import ModalCampanha from "./ModalCampanha";
import styles from './Campanha.module.css';

export default function Campanha() {
    const [campanhas, setCampanhas] = useState([]);
    const [campanhaSelecionada, setCampanhaSelecionada] = useState(null);
    const [buscarAtivas, setBuscarAtivas] = useState(true);
    const [show, setShow] = useState(false);

    const { id, role } = useContext(AuthContext);
    const carregou = useRef(false);

    async function buscar() {
        const response = await buscarCampanhas(id, buscarAtivas);
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
        if (!carregou.current) {
            buscar();
            carregou.current = true;
        }
        console.log(role)
    }, []);

    useEffect(() => {
        if (carregou.current) {
            buscar();
        }
    }, [buscarAtivas]);

    return (
        <div className={styles.paginaCampanha}>
            <h1 className={styles.tituloCampanha}>Campanha</h1>
            <Button onClick={() => { setCampanhaSelecionada(null); setShow(true) }}>Adicionar campanha</Button>

            <div className={styles.filtroCampanha}>
                <RadioGroup
                    title="Filtro"
                    options={[
                        { value: true, label: "Ativa" },
                        { value: false, label: "Inativa" }
                    ]}
                    selectedValue={buscarAtivas}
                    onChange={(e) => setBuscarAtivas(e.target.value === "true")}
                />
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
                            Selecionar
                        </button>
                    </div>
                ))}
            </div>

            <ModalCampanha
                show={show}
                setShow={setShow}
                campanhaSelecionada={campanhaSelecionada}
                onCampanhaAtualizada={buscar}
                onCampanhaCriada={buscar}
            />
        </div>
    );
}
