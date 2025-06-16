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
import formatarDataInput from "../../utils/formatarDataInput";

const defaultState = {
    ieMovimentacao: null,
    idCampanha: null,
    idDoador: null,
    idDonatario: null,
    alimentos: []
};

export default function MovimentacaoModal({
    show,
    setShow,
    movimentacaoSelecionada,
    onSubmit,
    onCancel,
}) {
    const [movimentacao, setMovimentacao] = useState(defaultState);
    const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);

    useEffect(() => {
        if (show) {
            if (movimentacaoSelecionada?.idMovimentacao) {
                setMovimentacao({
                    ...movimentacaoSelecionada,
                    dataMovimentacao: formatarDataInput(movimentacaoSelecionada.dataMovimentacao),
                    dataValidade: formatarDataInput(movimentacaoSelecionada.dataValidade)
                });
            } else {
                setMovimentacao(defaultState);
            }
        }
    }, [show, movimentacaoSelecionada]);


    const handleClose = () => {
        setMovimentacao(defaultState);
        setShow(false);
        onCancel?.();
    };

    const salvar = async () => {
        try {
            const response = movimentacaoSelecionada?.idMovimentacao ? await editarMovimentacao(movimentacao) : await criarMovimentacao(movimentacao);
            toast(response.data.message)
            handleClose();
            onSubmit?.();
        } catch (e) {
            toast.error(e.response.data.message)
        }

    }

    const submitText = movimentacaoSelecionada ? "Salvar" : "Cadastrar";


    useEffect(() => {
        if (!movimentacao?.idMovimentacaoAlimento) {
            let disable = false;

            if (movimentacao.alimentos.length === 0) {
                disable = true;
            } else {
                for (const item of movimentacao.alimentos) {
                    const algumVazioOuInvalido =
                        !item.idAlimento ||
                        !item.idUnidadeMedida ||
                        !item.quantidade ||
                        Number(item.quantidade) <= 0;

                    if (algumVazioOuInvalido) {
                        disable = true;
                        break;
                    }
                }
            }

            setIsSubmitDisabled(disable);
        } else {
            const quantidadeInvalida = !movimentacao.quantidade || Number(movimentacao.quantidade) <= 0;
            setIsSubmitDisabled(quantidadeInvalida);
        }
    }, [movimentacao]);



    const adicionarAlimento = () => {
        const alimentosAtuais = movimentacao.alimentos || [];
        const novosAlimentos = [...alimentosAtuais, { idAlimento: "", idUnidadeMedida: "", quantidade: "", dataValidade: "" }];
        setMovimentacao({ ...movimentacao, alimentos: novosAlimentos });
    };

    const atualizarAlimento = (index, campo, valor) => {
        const novosAlimentos = [...movimentacao.alimentos];
        novosAlimentos[index][campo] = valor;
        setMovimentacao({ ...movimentacao, alimentos: novosAlimentos });
    };

    const removerAlimento = (index) => {
        const novosAlimentos = [...movimentacao.alimentos];
        novosAlimentos.splice(index, 1);
        setMovimentacao({ ...movimentacao, alimentos: novosAlimentos });
    }

    return (
        <CustomModal
            show={show}
            setShow={setShow}
            title={
                movimentacaoSelecionada ? "Editar Movimentação" : "Adicionar Movimentação"
            }
            handleSubmit={salvar}
            handleClose={handleClose}
            submitText={submitText}
            resetText="Cancelar"
            submitDisable={isSubmitDisabled}
        >
            <Row className="mb-3">
                <SelectTipoMovimentacao
                    onChange={(ieMovimentacao) => setMovimentacao({ ...movimentacao, ieMovimentacao })}
                    value={movimentacao.ieMovimentacao}
                    disabled={movimentacaoSelecionada?.idMovimentacao}
                />
            </Row>
            <Row className="mb-3">
                <FloatingLabel label="Data da movimentação">
                    <Form.Control type="date"
                        placeholder="Data da movimentação"
                        value={movimentacao.dataMovimentacao}
                        onChange={(e) => setMovimentacao({ ...movimentacao, dataMovimentacao: e.target.value })}
                    />
                </FloatingLabel>
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
                    disabled={!movimentacao.ieMovimentacao || movimentacao.ieMovimentacao === 'S'}
                />
            </Row>
            <Row className="mb-3">
                <SelectDonatario
                    onChange={(donatario) => setMovimentacao({ ...movimentacao, idDonatario: donatario.idDonatario })}
                    value={movimentacao.nomeDonatorio}
                    disabled={!movimentacao.ieMovimentacao || movimentacao.ieMovimentacao === 'E'}
                />
            </Row>
            {!movimentacao?.idMovimentacaoAlimento ? (<>
                <h5>Alimentos</h5>
                {movimentacao.alimentos?.map((item, index) => (
                    <Row key={index} className="mb-3">
                        <SelectAlimento
                            onChange={(alimento) => { atualizarAlimento(index, 'idAlimento', alimento); }}
                            value={item.idAlimento}
                            ieMovimentacao={movimentacao.ieMovimentacao}
                            disabled={movimentacaoSelecionada?.idMovimentacao}
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
                        {movimentacao?.ieMovimentacao === 'E' &&
                            <FloatingLabel label="Data de validade" className="col">
                                <Form.Control
                                    type="date"
                                    placeholder="Data de validade"
                                    value={item.dataValidade}
                                    onChange={(e) => atualizarAlimento(index, "dataValidade", e.target.value)}
                                />
                            </FloatingLabel>
                        }
                        <Button onClick={(e) => removerAlimento(index)}>Remover Alimento</Button>
                    </Row>
                ))}

                <Button onClick={adicionarAlimento}
                    disabled={!movimentacao.ieMovimentacao}
                >Adicionar alimento</Button>
            </>) :
                <Row className="mb-3">
                    <SelectAlimento
                        onChange={(alimento) => setMovimentacao({ ...movimentacao, idAlimento: alimento })}
                        value={movimentacao.idAlimento}
                        ieMovimentacao={movimentacao.ieMovimentacao}
                        disabled={movimentacaoSelecionada?.idMovimentacao}
                    />
                    <Form.Group className="col">
                        <SelectUnidadeMedida
                            value={
                                movimentacao.idUnidadeMedida
                            }
                            onChange={(unidadeMedida) => setMovimentacao({ ...movimentacao, idUnidadeMedida: unidadeMedida })}
                        />
                    </Form.Group>
                    <Form.Group className="col">
                        <Form.Control
                            type="number"
                            placeholder="Quantidade"
                            value={movimentacao.quantidade}
                            onChange={(e) => setMovimentacao({ ...movimentacao, quantidade: e.target.value })}
                        />
                    </Form.Group>
                    {movimentacao?.ieMovimentacao === 'E' &&
                        <FloatingLabel label="Data de validade" className="col">
                            <Form.Control
                                type="date"
                                placeholder="Data de validade"
                                value={movimentacao.dataValidade}
                                onChange={(e) => setMovimentacao({ ...movimentacao, dataValidade: e.target.value })}
                            />
                        </FloatingLabel>
                    }
                </Row>
            }
        </CustomModal >
    );
}
