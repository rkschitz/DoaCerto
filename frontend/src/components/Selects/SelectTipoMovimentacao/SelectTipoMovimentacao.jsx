import React, { useEffect, useState } from "react";
import Select from "../Select/Select";

export default function SelectTipoMovimentacao({ onChange, value }) {
    const [opcoes, setOpcoes] = useState([]);

    const buscarOpcoes = async () => {
        setOpcoes([
            { value: 'E', descricao: 'Entrada' },
            { value: 'S', descricao: 'Saida' }
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
            label="Tipo da movimentação"
        />
    )
}