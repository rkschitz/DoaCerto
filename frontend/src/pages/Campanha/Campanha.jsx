import { useEffect, useState, useRef, useContext } from "react";
import { buscarCampanhas } from "../../api/campanha";
import { AuthContext } from "../../auth/Context";
import RadioGroup from "../../components/RadioButton/RadioButton";

export default function Campanha() {
    const [campanhas, setCampanhas] = useState([]);
    const [campanhaSelecionada, setCampanhaSelecionada] = useState(null);
    const [buscarAtivas, setBuscarAtivas] = useState(true);

    const { id } = useContext(AuthContext);
    const carregou = useRef(false);

    async function buscar() {
        const response = await buscarCampanhas(id, buscarAtivas);
        setCampanhas(response.data);
    }

    useEffect(() => {
        if (!carregou.current) {
            buscar();
            carregou.current = true;
        }
    }, []);

    useEffect(() => {
        if (carregou.current) {
            buscar();
        }
    }, [buscarAtivas]);

    return (
        <div>
            <h1>Campanha</h1>
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
                    {campanha.metas?.map((meta, index) => (
                        <div key={index}>
                            <p>Meta: {meta.meta}</p>
                            <p>Alimento: {meta.alimento} {meta.unidadeMedida}</p>
                            <p>Quantidade doada {meta.quantidadeDoada}</p>
                            <p>Quantidade faltante {meta.quantidadeFaltante}</p>
                        </div>
                    ))}
                    <button onClick={() => setCampanhaSelecionada(campanha)}>Selecionar</button>
                </div>
            ))}
        </div>
    );
}
