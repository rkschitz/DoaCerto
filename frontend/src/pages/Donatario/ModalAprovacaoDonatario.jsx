import { FloatingLabel, Form, Row } from "react-bootstrap";
import CustomModal from "../../components/Modal/Modal";
import SelectPessoa from "../../components/Selects/SelectPessoa/SelectPessoa";
import { useEffect, useState } from "react";
import { editarDonatario } from "../../api/donatario";
import { toast } from "react-toastify";

const defaultState = {
    responsavelVisita: null,
    dataVisita: null,
    observacao: null
}

export default function ModalAprovacaoDonatario({ show, setShow, donatarioSelecionado, onDonatarioAprovado }) {

    const [donatario, setDonatario] = useState(defaultState);

    async function handleSubmit() {
        try {
            const response = await editarDonatario(donatario);
            if (response.data.sucesso) {
                toast(response.data.mensagem);
                onDonatarioAprovado?.(response.data);
            }
        } catch (e) {
            toast.error(e.response.data.error);
        }
    }

    const reset = () => {
        setDonatario(defaultState)
    }

    useEffect(() => {
        if (donatarioSelecionado?.idDonatario) {
            setDonatario(donatarioSelecionado);
            setDonatario({ ...donatarioSelecionado, situacaoCadastral: 'A' })
        }
    }, [donatarioSelecionado]);

    const submitDisable = !donatario?.responsavelVisita || !donatario?.dataVisita;

    return (
        <CustomModal
            show={show}
            setShow={setShow}
            title={'Aprovação do donatário'}
            submitText='Salvar'
            submit={handleSubmit}
            reset={reset}
            submitDisable={submitDisable}
        >
            <Row className="mb-3">
                <SelectPessoa
                    label={'Responsável pela visita'}
                    onChange={(e) => setDonatario({ ...donatario, responsavelVisita: e.idPessoa })}
                    value={donatario.responsavelVisita}
                />
            </Row>
            <Row className="mb-3">
                <FloatingLabel label="Data da visita">
                    <Form.Control
                        type="date"
                        placeholder="Data da visita"
                        value={donatario.dataVisita}
                        onChange={(e) => setDonatario({ ...donatario, dataVisita: e.target.value })}
                    />
                </FloatingLabel>
            </Row>
            <Row className="mb-3">
                <FloatingLabel label="Observações">
                    <Form.Control
                        as="textarea"
                        placeholder="Observações"
                        style={{ height: '100px' }}
                        value={donatario.observacao}
                        onChange={(e) => setDonatario({ ...donatario, observacao: e.target.value })}
                    />
                </FloatingLabel>
            </Row>


        </CustomModal>

    )
}