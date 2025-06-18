import { useEffect, useState } from "react"
import { toast } from "react-toastify";
import { buscarAlimentosMovimentacao } from "../../api/organizacao";

export default function Estoque() {
    const [alimentos, setAlimentos] = useState([]);

    const listar = async () => {
        try {
            const response = await buscarAlimentosMovimentacao()
            setAlimentos(response.data)
            console.log(response)
        } catch (e) {
            toast.error(e.response.data.error)
        }
    }

    useEffect(() => {
        listar();
    }, [])

    return (
        <div className="">
            AAAA
            {alimentos.map((item) => {
                return (
                    <p>Alimento: {item.alimento}
                       Saldo: {item.saldo}
                       Total entrada: {item.total_entradas}
                       Total saida: {item.total_saidas}
                       Unidade de medida: {item.dsUnidadeMedida}</p>)
            })}
        </div>
    )
}