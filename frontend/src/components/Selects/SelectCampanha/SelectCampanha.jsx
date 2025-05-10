import { useEffect, useState } from "react"
import Select from "../Select/Select"
import { buscarCampanhasAtivas } from "../../../api/campanha"
export default function SelectCampanha({ onChange, value, disabled }) {

    const [opcoes, setOpcoes] = useState([])

    const buscarOpcoes = async () => {
        const response = await buscarCampanhasAtivas();
        if (response.status === 200) {
            setOpcoes(response.data.map(item => ({ value: item.idCampanha, descricao: item.titulo })))
        } else {
            alert("Erro ao buscar opções de campanhas.")
        }
    }


    useEffect(() => {
        buscarOpcoes()
    }, [])

    return (
        <Select
            options={opcoes}
            onChange={onChange}
            value={value}
            label="Campanha"
            disabled={disabled}
        />
    )
}