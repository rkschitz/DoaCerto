import React, { useEffect, useState } from "react";
import Select from "../Select/Select";
import { buscarTodosSituacaoProfissional } from "../../../api/situacaoProfissional"

export default function SelectSituacaoProfissional({ onChange, value }) {
    const [opcoes, setOpcoes] = useState([]);

    const buscarOpcoes = async () => {
        const response = await buscarTodosSituacaoProfissional();
        if (response.status === 200) {
            console.log(response)
            setOpcoes(response.data.map(item => ({ value: item.idSituacaoProfissional, descricao: item.situacaoProfissional })));
        } else {
            alert("Erro ao buscar opções de situação profissional.");
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
            label="Situação profissional"
        />
    )
}