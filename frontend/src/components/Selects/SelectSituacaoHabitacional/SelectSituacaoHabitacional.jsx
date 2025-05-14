import React, { useEffect, useState } from "react";
import Select from "../Select/Select";
import { buscarTodosSituacaoHabitacional } from "../../../api/situacaoHabitacional";

export default function SelectSituacaoHabitacional({ onChange, value }) {
    const [opcoes, setOpcoes] = useState([]);

    const buscarOpcoes = async () => {
        const response = await buscarTodosSituacaoHabitacional();
        if (response.status === 200) {
            setOpcoes(response.data.map(item => ({ value: item.idSituacaoHabitacional, descricao: item.situacaoHabitacional })));
        } else {
            alert("Erro ao buscar opções de situação habitacional.");
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
            label="Situação habitacional"
        />
    )
}