import { useEffect, useState, useRef, useContext } from "react";
import { buscarCampanhas, editarCampanha } from "../../api/campanha";
import { AuthContext } from "../../auth/Context";
import RadioGroup from "../../components/RadioButton/RadioButton";
import { Button } from "react-bootstrap";
import ModalCampanha from "./ModalCampanha";

export default function Campanha() {
    const [campanhas, setCampanhas] = useState([]);
    const [campanhaSelecionada, setCampanhaSelecionada] = useState(null);
    const [buscarAtivas, setBuscarAtivas] = useState(true);
    const [show, setShow] = useState(false);

    const { id, role } = useContext(AuthContext);
    const carregou = useRef(false);

    async function buscar() {
        const response = await buscarCampanhas({ idOrganizacao: id, ativos: buscarAtivas });
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
        <div>
            <h1>Campanha</h1>
            <Button onClick={(e) => { setCampanhaSelecionada(null); setShow(true) }}>Adicionar campanha</Button>
            <RadioGroup
                title="Filtro"
                options={[
                    { value: true, label: "Ativa" },
                    { value: false, label: "Inativa" }
                ]}
                selectedValue={buscarAtivas}
                onChange={(e) => setBuscarAtivas(e.target.value === "true")}
            />
            <p>Essa é a página de campanha.</p>
            {campanhas.map((campanha) => (
                <div key={campanha.idCampanha}>
                    <h2>{campanha.titulo}</h2>
                    <p>{campanha.descricao}</p>
                    <Button onClick={(e) => handleSituacao(campanha)}>{campanha.ieSituacao === 'A' ? 'Inativar' : 'Ativar'} campanha</Button>
                    {campanha.metas?.map((meta, index) => (
                        <div key={index}>
                            <p>Meta: {meta.meta}</p>
                            <p>Alimento: {meta.alimento} {meta.unidadeMedida}</p>
                            <p>Quantidade doada {meta.quantidadeDoada}</p>
                            <p>Quantidade faltante {meta.quantidadeFaltante}</p>
                        </div>
                    ))}
                    <button onClick={(e) => { setCampanhaSelecionada(campanha); setShow(true) }}>Selecionar</button>
                </div>
            ))}
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
