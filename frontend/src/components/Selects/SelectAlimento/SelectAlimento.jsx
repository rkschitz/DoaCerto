import { useEffect, useState } from "react"
import Select from "../Select/Select"
import { buscarAlimentosMovimentacao } from "../../../api/organizacao";

import React, { useContext } from "react";

export default function SelectAlimento({ onChange, value, disabled, ieMovimentacao }) {

    const [opcoes, setOpcoes] = useState([])

    const buscarOpcoes = async () => {
        const response = await buscarAlimentosMovimentacao({ ieMovimentacao });
        if (response.status === 200) {
            if (ieMovimentacao === 'E') {
                setOpcoes(response.data.map(item => ({ value: item.idAlimento, descricao: item.alimento })))
            } else {
                setOpcoes(response.data.map(item => ({ value: item.idAlimento, descricao: item.alimento + " " + item.saldo + " " + item.dsUnidadeMedida })))
            }
        } else {
            alert("Erro ao buscar opções de campanhas.")
        }
    }

    useEffect(() => {
        buscarOpcoes();

    }, [ieMovimentacao])

    return (
        <Select
            options={opcoes}
            onChange={onChange}
            value={value}
            label="Alimento"
            disabled={disabled}
        />
    )
}