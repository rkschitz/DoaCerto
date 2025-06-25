import { useEffect, useState } from "react";
import CustomModal from "../../components/Modal/Modal";
import { Button, FloatingLabel, Form, Row } from "react-bootstrap";
import SelectAlimento from "../../components/Selects/SelectAlimento/SelectAlimento";
import SelectUnidadeMedida from "../../components/Selects/SelectUnidadeMedida/SelectUnidadeMedida";
import { criarCampanha, editarCampanha } from "../../api/campanha";
import { toast } from 'react-toastify';
import formatarDataInput from "../../utils/formatarDataInput";
import styles from "./Campanha.module.css";

const defaultState = {
    titulo: null,
    descricao: null,
    dtInicio: null,
    dtFinal: null,
    ieSituacao: null,
    metas: []
}

export default function ModalCampanha({ show, setShow, campanhaSelecionada, onCancel, onSubmit }) {
    const [campanha, setCampanha] = useState(defaultState);

    useEffect(() => {
        if (campanhaSelecionada) {
            setCampanha({
                ...campanhaSelecionada,
                dtInicio: formatarDataInput(campanhaSelecionada.dtInicio),
                dtFinal: formatarDataInput(campanhaSelecionada.dtFinal)
            });
        } else {
            setCampanha(defaultState);
        }
    }, [campanhaSelecionada]);

    async function handleSubmit() {
        try {
            const response = campanhaSelecionada ? await editarCampanha(campanha) : await criarCampanha(campanha)
            toast(response.data.message)
            onSubmit?.(response.data)
            handleClose();
        } catch (e) {
            toast.error(e.response.data.error)
        }
    }

    function handleClose() {
        setCampanha(defaultState);
        setShow(false);
        onCancel?.()
    }

    const isSubmitDisabled = !campanha.titulo || !campanha.descricao;

    const adicionarAlimento = () => {
        const metasAtuais = campanha.metas || [];
        const novasMetas = [...metasAtuais, { meta: "", idAlimento: "", idUnidadeMedida: "" }];
        setCampanha({ ...campanha, metas: novasMetas });
    };

    const atualizarAlimento = (index, campo, valor) => {
        const novasMetas = [...campanha.metas];
        novasMetas[index][campo] = valor;
        setCampanha({ ...campanha, metas: novasMetas });
    };

    const removerAlimento = (index) => {
        const novasMetas = [...campanha.metas];
        novasMetas.splice(index, 1);
        setCampanha({ ...campanha, metas: novasMetas });
    }

    return (
        <CustomModal
            show={show}
            title={
                campanhaSelecionada ? "Editar Campanha" : "Adicionar Campanha"
            }
            submitText={campanhaSelecionada ? "Salvar" : "Adicionar"}
            resetText="Cancelar"
            submitDisable={isSubmitDisabled}
            handleSubmit={handleSubmit}
            handleClose={handleClose}
        >
            <Row className="mb-3">
                <FloatingLabel controlId="inputTitulo" label="Titulo">
                    <Form.Control
                        type="text"
                        value={campanha.titulo}
                        onChange={(e) => setCampanha({ ...campanha, titulo: e.target.value })}
                        placeholder="Titulo da Campanha"
                    />
                </FloatingLabel>
            </Row>
            <Row className="mb-3">
                <FloatingLabel controlId="inputDescricao" label="Descricao">
                    <Form.Control
                        type="text"
                        value={campanha.descricao}
                        onChange={(e) => setCampanha({ ...campanha, descricao: e.target.value })}
                        placeholder="Descricao da Campanha"
                    />
                </FloatingLabel>
            </Row>
            <Row className="mb-3">
                <FloatingLabel controlId="inputDataInicio" label="Data Inicio">
                    <Form.Control
                        type="date"
                        value={campanha.dtInicio}
                        onChange={(e) => setCampanha({ ...campanha, dtInicio: e.target.value })}
                        placeholder="Data inicial da Campanha"
                    />
                </FloatingLabel>
            </Row>
            <Row className="mb-3">
                <FloatingLabel controlId="inputDataFinal" label="Data Final">
                    <Form.Control
                        type="date"
                        value={campanha.dtFinal}
                        onChange={(e) => setCampanha({ ...campanha, dtFinal: e.target.value })}
                        placeholder="Data final da Campanha"
                    />
                </FloatingLabel>
            </Row>
            <h2>Metas</h2>
            {campanha.metas?.map((item, index) => (
                <Row key={index} className="mb-3">
                    <SelectAlimento
                        onChange={(alimento) => { atualizarAlimento(index, 'idAlimento', alimento); }}
                        value={item.idAlimento}
                        ieMovimentacao={'E'}
                    />
                    <Form.Group className="col">
                        <SelectUnidadeMedida
                            value={
                                item.idUnidadeMedida
                            }
                            onChange={(unidadeMedida) => atualizarAlimento(index, "idUnidadeMedida", unidadeMedida)}
                        />
                    </Form.Group>
                    <Form.Group className="col">
                        <Form.Control
                            type="number"
                            placeholder="Quantidade"
                            value={item.meta}
                            onChange={(e) => atualizarAlimento(index, "meta", e.target.value)}
                            className="mt-4"
                        />
                    </Form.Group>
                    <button onClick={(e) => removerAlimento(index)} className={styles.aaa}>Remover Alimento</button>
                </Row>
            ))}
            <Button onClick={adicionarAlimento}
            >Adicionar alimento</Button>
        </CustomModal>
    )
}