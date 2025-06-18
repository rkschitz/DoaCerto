import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap"
import { buscarMovimentacoes } from "../../api/movimentacao";
import { toast } from "react-toastify";
import formatarDataBR from "../../utils/formatarDataBR";

export default function ModalHistoricoDoacoes({ show, setShow, donatarioSelecionado }) {

    const [historico, setHistorico] = useState([]);

    const handleClose = () => setShow(false);
    const title = "Histórico de Doações";

    const listar = async () => {
        try {
            const response = await buscarMovimentacoes({
                idDonatario: donatarioSelecionado.idDonatario,
                idOrganizacao: donatarioSelecionado.idOrganizacao,
                ieMovimentacao: 'S'
            });
            if (response.data.sucesso) {
                return setHistorico(response.data.data);
            } else {
                toast.error(response.data.mensagem);
            }
        } catch (e) {
            toast.error(e.mensagem);
        }
    }

    useEffect(() => {
        listar();
    }, [show])

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <table>
                    <thead>
                        <tr>
                            <th>Data</th>
                            <th>Alimento</th>
                            <th>Quantidade</th>
                            <th>Unidade</th>
                        </tr>
                    </thead>
                    <tbody>
                        {historico?.map((item, indexItem) => (
                            item.alimentos?.map((ali, indexAli) => (
                                <tr key={`${indexItem}-${indexAli}`}>
                                    <td>{formatarDataBR(item.dataMovimentacao)}</td>
                                    <td>{ali.alimento}</td>
                                    <td>{ali.quantidade}</td>
                                    <td>{ali.unidadeMedida}</td>
                                </tr>
                            ))
                        ))}

                    </tbody>
                </table>
            </Modal.Body>
        </Modal>
    )
}