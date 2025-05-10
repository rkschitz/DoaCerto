import { useState } from "react";
import Select from "../Select/Select";
import { useEffect } from "react";
import { buscarTodosUnidadeMedida } from "../../../api/unidadeMedida";

export default function SelectUnidadeMedida({ onChange, value }) {

    const [opcoes, setOpcoes] = useState([]);

    const buscarOpcoes = async () => {
        const response = await buscarTodosUnidadeMedida();
        if (response.status === 200) {
            setOpcoes(response.data.map(item => ({ value: item.idUnidadeMedida, descricao: item.dsUnidadeMedida })));
        } else {
            alert(response)
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
            placeholder="Unidade de medida"
        />
    )
}

