import { useState } from "react";
import Select from "../Select/Select";
import { buscarTodosNacionalidade } from "../../../api/nacionalidade";
import { useEffect } from "react";
import { toast } from "react-toastify";

export default function SelectNacionalidade({ onChange, value }) {

    const [opcoes, setOpcoes] = useState([]);

    const buscarOpcoes = async () => {
        try {
            const response = await buscarTodosNacionalidade();
            setOpcoes(response.data.map(item => ({ value: item.idNacionalidade, descricao: item.nacionalidade })));
        } catch (e) {
            toast.error("Erro ao buscar nacionalidade: ", e.response.data.message)
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
            label="Selecione nacionalidade"
        />
    )
}

