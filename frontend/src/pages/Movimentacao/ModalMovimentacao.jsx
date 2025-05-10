import { use, useEffect, useState } from "react";
import { Row, Form, FloatingLabel, Button, Col } from "react-bootstrap";
import CustomModal from "../../components/Modal/Modal";
import { criarMovimentacao, editarMovimentacao } from "../../api/movimentacao";
import PessoaLocalizador from "../../components/Localizadores/LocalizadorPessoa/LocalizadorPessoa";
import SelectCampanha from "../../components/Selects/SelectCampanha/SelectCampanha";
import SelectTipoMovimentacao from "../../components/Selects/SelectTipoMovimentacao/SelectTipoMovimentacao";
import SelectPessoa from "../../components/Selects/SelectPessoa/SelectPessoa";
import SelectAlimento from "../../components/Selects/SelectAlimento/SelectAlimento";
import SelectUnidadeMedida from "../../components/Selects/SelectUnidadeMedida/SelectUnidadeMedida";
import SelectDonatario from "../../components/Selects/SelectDonatario/SelectDonatario";
import { toast } from 'react-toastify'

const defaultState = {
    ieMovimentacao: null,
    idCampanha: null,
    idDoador: null,
    idDonatario: null,
    alimentos: [] // <- Adicione isso
};

export default function MovimentacaoModal({
    show,
    setShow,
    movimentacaoSelecionada,
    onCancel,
    onMovimentacaoCriada,
    onMovimentacaoAtualizada
}) {
    const [movimentacao, setMovimentacao] = useState(defaultState);

    useEffect(() => {
        if (show) {
            if (movimentacaoSelecionada) {
                console.log(movimentacaoSelecionada)
                setMovimentacao(movimentacaoSelecionada);
            } else {
                setMovimentacao(defaultState);
            }
        }

    }, [show, movimentacaoSelecionada]);

    const handleClose = () => {
        setMovimentacao(defaultState);
        onCancel?.();
    };

    const salvar = async () => {
        if (movimentacaoSelecionada) {
            try {
                console.log(movimentacao)
                const response = await editarMovimentacao(movimentacao);
                console.log(response)
                if (response.status === 200) {
                    toast(response.data.message)
                    onMovimentacaoAtualizada?.(response.data);
                }
            } catch (e) {
                toast.error(e)
            }
        } else {
            try {
                const response = await criarMovimentacao(movimentacao);
                if (response.status === 200) {
                    toast('Movimentação registrada com sucesso')
                }
            } catch (e) {
                toast.error(e.message)
            }
        }
    }

    const submitText = movimentacaoSelecionada ? "Salvar" : "Cadastrar";
    const isSubmitDisabled = !movimentacao.ieMovimentacao

    const adicionarAlimento = () => {
        const alimentosAtuais = movimentacao.alimentos || [];
        const novosAlimentos = [...alimentosAtuais, { idAlimento: "", idUnidadeMedida: "", quantidade: "" }];
        setMovimentacao({ ...movimentacao, alimentos: novosAlimentos });
    };

    const atualizarAlimento = (index, campo, valor) => {
        const novosAlimentos = [...movimentacao.alimentos];
        novosAlimentos[index][campo] = valor;
        setMovimentacao({ ...movimentacao, alimentos: novosAlimentos });
    };

    return (
        <CustomModal
            show={show}
            setShow={setShow}
            title={
                movimentacaoSelecionada ? "Editar Movimentação" : "Adicionar Movimentação"
            }
            submit={salvar}
            submitText={submitText}
            resetText="Cancelar"
            submitDisable={isSubmitDisabled}
            reset={handleClose}
        >
            <Row className="mb-3">
                <SelectTipoMovimentacao
                    onChange={(ieMovimentacao) => setMovimentacao({ ...movimentacao, ieMovimentacao })}
                    value={movimentacao.ieMovimentacao}
                />
            </Row>
            <Row className="mb-3">
                <SelectCampanha
                    onChange={(campanha) => setMovimentacao({ ...movimentacao, idCampanha: campanha })}
                    value={movimentacao.idCampanha}
                />
            </Row>
            <Row className="mb-3">
                <SelectPessoa label='Doador' onChange={(doador) => setMovimentacao({ ...movimentacao, idDoador: doador.idPessoa })}
                    value={movimentacao.nomeDoador}
                />
            </Row>
            <Row className="mb-3">
                <SelectDonatario
                    onChange={(donatario) => setMovimentacao({ ...movimentacao, idDonatario: donatario.idDonatario })}
                    value={movimentacao.nomeDonatorio}
                />
            </Row>
            <h5>Moradores na casa</h5>
            {movimentacao.alimentos?.map((item, index) => (
                <Row key={index} className="mb-3">
                    <SelectAlimento
                        onChange={(alimento) => { atualizarAlimento(index, 'idAlimento', alimento); }}
                        value={item.idAlimento}
                        ieMovimentacao={movimentacao.ieMovimentacao}
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
                            value={item.quantidade}
                            onChange={(e) => atualizarAlimento(index, "quantidade", e.target.value)}
                        />
                    </Form.Group>
                </Row>
            ))}
            <Button onClick={adicionarAlimento}
                disabled={!movimentacao.ieMovimentacao}
            >Adicionar alimento</Button>

        </CustomModal >
    );
}
