import { useState } from "react";
import Select from "../Select/Select";
import { buscarTodosGrauParentesco } from "../../../api/grauParentesco";
import { useEffect } from "react";

export default function SelectGrauParentesco({ onChange, value }) {

    const [opcoes, setOpcoes] = useState([]);

    const buscarOpcoes = async () => {
        const response = await buscarTodosGrauParentesco();
        if (response.status === 200) {
            setOpcoes(response.data.map(item => ({ value: item.idGrauParentesco, descricao: item.grauParentesco })));
        } else {
            alert("Erro ao buscar opções de grau de parentesco.");
        }

    }

    useEffect(() => {
        buscarOpcoes();
    }, []);

    return (
        <Select
            options={opcoes}
            onChange={onChange}
            value={value}
            label="Selecione o grau de parentesco"
        />
    )
}

