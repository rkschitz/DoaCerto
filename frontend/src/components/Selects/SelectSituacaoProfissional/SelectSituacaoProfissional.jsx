import React, { useEffect, useState } from "react";
import Select from "../Select/Select";
// import { buscarTodos } from "../../api/situacaoProfissional";

export default function SelectSituacaoProfissional({onChange,value }) {
    const [opcoes, setOpcoes] = useState([]);

    const buscarOpcoes = async () => {
        // const response = await buscarTodos();
        // if (response.status === 200) {
        //     setOpcoes(response.data.map(item => ({ value: item.idSituacaoProfissional, descricao: item.situacaoProfissional })));
        // } else {
        //     alert("Erro ao buscar opções de situação profissional.");
        // }

        setOpcoes([
            { value: 1, descricao: 'Ativo' },
            { value: 2, descricao: 'Inativo' },
            { value: 3, descricao: 'Aposentado' },
            { value: 4, descricao: 'Desempregado' },
        ]);
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