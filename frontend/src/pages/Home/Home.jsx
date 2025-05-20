import { useEffect, useState, useRef } from "react";
import { buscarCampanhas } from "../../api/campanha";


export default function Home() {
    const [campanhas, setCampanhas] = useState([]);
    const carregou = useRef(false);

    async function buscar() {
        const response = await buscarCampanhas({ativos: true});
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
            <a href="/login">Fazer login</a>
            <h1>Campanha</h1>
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
                </div>
            ))}
        </div>
    );
}
