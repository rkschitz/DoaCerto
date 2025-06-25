import { useState } from "react";
import { Form, Button } from "react-bootstrap";
import CustomModal from "../../Modal/Modal";

export default function Localizador({ children, show, setShow, submit, submitText, conteudoLista, colunasLista, onSelectItem, handleClose }) {
    const [selecionado, setSelecionado] = useState(null);

    function handleOk() {
        if (selecionado && onSelectItem) {
            onSelectItem(selecionado);
            setShow(false);
        }
    }

    return (
        <CustomModal
            show={show}
            setShow={setShow}
            handleSubmit={handleOk}
            handleClose={handleClose}
            disabled={!selecionado}
            submitText={submitText}
        >
            <Form onSubmit={submit}>
                {children}
            </Form>
            {
                Array.isArray(colunasLista) && Array.isArray(conteudoLista) && (
                    <table className="table mt-3">
                        <thead>
                            <tr>
                                {colunasLista.map((coluna, index) => (
                                    <th key={index}>{coluna}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {conteudoLista.map((item, index) => {
                                const selecionadoRow = item === selecionado;
                                return (
                                    <tr
                                        key={index}
                                        onClick={() => setSelecionado(item)}
                                        style={{
                                            cursor: "pointer",
                                        }}
                                    >
                                        {colunasLista.map((_, i) => (
                                            <td
                                                key={i}
                                                style={{
                                                    backgroundColor: selecionadoRow ? "#8b5cf6" : "transparent",
                                                    color: selecionadoRow ? "#fff" : "inherit" // opcional: texto branco quando selecionado
                                                }}
                                            >
                                                {Object.values(item)[i]}
                                            </td>
                                        ))}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )
            }
        </CustomModal >
    );
}
