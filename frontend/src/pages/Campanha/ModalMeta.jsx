import { useState } from "react";
import CustomModal from "../../components/Modal/Modal";

const defaultState = {
    titulo: null,
    descricao: null,
    dataInicio: null,
    dataFim: null,
    ieSituacao: null,
    idOrganizacao: null,
    metas: []
}

export default function ModalMeda() {
    const [show, setShow] = useState(false);
    const [campanhaSelecionada, setCampanhaSelecionada] = useState(null);
    const [campanha, setCampanha] = useState(defaultState);
    return (
        <CustomModal
            show={show}
            setShow={setShow}
            title={
                campanhaSelecionada ? "Editar Movimentação" : "Adicionar Movimentação"
            }
            submit={salvar}
            submitText={submitText}
            resetText="Cancelar"
            submitDisable={isSubmitDisabled}
            reset={handleClose}
        > </CustomModal>
    )
}