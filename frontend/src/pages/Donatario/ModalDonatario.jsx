import { useEffect, useState } from "react";
import { Form, Row, Col, FloatingLabel } from "react-bootstrap";
import CustomModal from "../../components/Modal/Modal";
import SelectSexo from "../../components/Selects/SelectSexo/SelectSexo";
import SelectSituacaoHabitacional from "../../components/Selects/SelectSituacaoHabitacional/SelectSituacaoHabitacional";
import SelectSituacaoProfissional from "../../components/Selects/SelectSituacaoProfissional/SelectSituacaoProfissional";
import SelectGrauParentesco from "../../components/Selects/SelectGrauParentesco/SelectGrauParentesco";
import RadioGroup from "../../components/RadioButton/RadioButton";
import SelectPessoa from "../../components/Selects/SelectPessoa/SelectPessoa";
import formatarDataBR from "../../utils/formatarDataBR";
import { criarDonatario, editarDonatario } from "../../api/donatario";
import calcularIdade from "../../utils/calcularIdade";
import { toast } from "react-toastify";
import { Button } from "react-bootstrap";

const defaultState = {
    idPessoa: null,
    cras: null,
    cadastroCras: null,
    outroLocal: null,
    endereco: { enderecoCompleto: null },
    dependentes: []
}

export default function ModalDonatario({
    show,
    setShow,
    donatarioSelecionado,
    onSubmit,
    onCancel
}) {
    const [donatario, setDonatario] = useState(defaultState)
    const [isEditMode, setIsEditMode] = useState(false);

    useEffect(() => {
        if (donatarioSelecionado?.idDonatario) {
            setDonatario(donatarioSelecionado);
            setIsEditMode(true);
        } else {
            setDonatario(defaultState);
            setIsEditMode(false);
        }
    }, [show, donatarioSelecionado]);

    const handleSubmit = async () => {
        const donatarioFinal = {
            ...donatario,
            idPessoa: donatario.pessoa?.idPessoa,
        }
        if (!isEditMode) {
            try {
                const response = await criarDonatario(donatarioFinal);
                if (response.status === 200) {
                    toast("Donatário cadastrado com sucesso!");
                } else {
                    toast.error("Erro ao cadastrar donatário.");
                }
            } catch (error) {
                toast("Erro ao cadastrar donatário." + error);
            }
        } else {
            try {
                const response = await editarDonatario(donatarioFinal);
                if (response.status === 200) {
                    toast("Donatário editado com sucesso!");
                } else {
                    toast.error("Erro ao editar donatário.");
                }
            } catch (e) {
                toast.error("Erro ao editar donatário." + e);
            }
        }
        handleReset()
    };

    function handleReset() {
        setDonatario(defaultState);
        setShow(false);
        onCancel?.();
    }

    const adicionarDependente = () => {
        const dependentesAtuais = donatario.dependentes || [];
        const novosDependentes = [...dependentesAtuais, { idPessoa: "", idGrauParentesco: "", dtNascimento: "" }];
        setDonatario({ ...donatario, dependentes: novosDependentes });
    };

    const atualizarDependente = (index, campo, valor) => {
        const novosDependentes = [...donatario.dependentes];
        novosDependentes[index][campo] = valor;
        setDonatario({ ...donatario, dependentes: novosDependentes });
    };

    const removerDependente = (index) => {
        const novosDependentes = [...donatario.dependentes];
        novosDependentes.splice(index, 1);
        setDonatario({ ...donatario, dependentes: novosDependentes });
    }

    return (
        <CustomModal
            title={isEditMode ? "Editar Pessoa" : "Cadastrar Pessoa"}
            submit={handleSubmit}
            reset={handleReset}
            submitText={isEditMode ? "Salvar Alterações" : "Cadastrar"}
            resetText="Cancelar"
            show={show}
            setShow={setShow}
        >
            <Form>
                <Row>
                    <Col md={6} className="mb-3">
                        <SelectPessoa
                            label={'Nome'}
                            value={donatario.pessoa?.nome || donatario.nome}
                            onChange={(pessoa) => { setDonatario({ ...donatario, pessoa }); }}
                        />
                    </Col>
                </Row>

                <Row>
                    <Col md={6} className="mb-3">
                        <FloatingLabel controlId="inputCPF" label="CPF">
                            <Form.Control
                                type="text"
                                placeholder="CPF"
                                value={
                                    donatario.pessoa?.cpf || donatario.cpf || ""
                                }
                                disabled
                            />
                        </FloatingLabel>
                    </Col>

                    <Col md={6} className="mb-3">
                        <FloatingLabel controlId="inputNascimento" label="Data de nascimento">
                            <Form.Control
                                type="text"
                                value={formatarDataBR(donatario.pessoa?.dtNascimento) || formatarDataBR(donatario.dtNascimento) || ""}
                                disabled
                            />
                        </FloatingLabel>
                    </Col>
                </Row>

                <Row>
                    <Col md={6} className="mb-3">
                        <FloatingLabel controlId="inputCidade" label="Cidade">
                            <Form.Control
                                type="text"
                                value={donatario.pessoa?.endereco?.cidade || donatario.endereco?.cidade || ""}
                                disabled
                                placeholder="cidade"
                            />
                        </FloatingLabel>
                    </Col>

                    <Col md={6} className="mb-3">
                        <FloatingLabel controlId="inputNacionalidade" label="Nacionalidade">
                            <Form.Control
                                type="text"
                                value={donatario.nacionalidade || ""}
                                onChange={(e) =>
                                    setDonatario({
                                        ...donatario,
                                        nacionalidade: e.target.value,
                                    })
                                }
                            />
                        </FloatingLabel>
                    </Col>
                </Row>

                <Row>
                    <Col md={6} className="mb-3">
                        <SelectSexo
                            value={donatario.pessoa?.sexo || donatario.sexo || ""}
                            onChange={(sexo) =>
                                setDonatario({ ...donatario, sexo })
                            }
                            disabled
                        />
                    </Col>
                </Row>

                <Row>
                    <Col md={6} className="mb-3">
                        <FloatingLabel controlId="inputEndereco" label="Endereço">
                            <Form.Control
                                type="text"
                                value={donatario.pessoa?.endereco?.enderecoCompleto || donatario.endereco?.enderecoCompleto || null}
                                placeholder="Endereço"
                                disabled
                            />
                        </FloatingLabel>
                    </Col>
                </Row>

                <Row>
                    <Col md={6} className="mb-3">
                        <SelectSituacaoHabitacional
                            value={donatario.idSituacaoHabitacional || ""}
                            onChange={(situacao) =>
                                setDonatario({
                                    ...donatario,
                                    idSituacaoHabitacional: situacao,
                                })
                            }
                        />
                    </Col>
                </Row>
                <Row>
                    <RadioGroup
                        title="Cadastro CRAS?"
                        options={[{ label: "Sim", value: "1" }, { label: "Não", value: "0" }, { label: "Outro local", value: "2" }]}
                        selectedValue={donatario.cras}
                        onChange={(e) =>
                            setDonatario({
                                ...donatario,
                                cras: e.target.value,
                            })
                        }
                    />
                </Row>
                {(donatario.cras != 0 || !donatario.cras) &&
                    < Row className="mb-3">
                        < FloatingLabel controlId="inputCadastroCrasOUOutroLocal" label={donatario.cras === "1" ? 'Cadastro cras' : 'Outro local'}>
                            <Form.Control
                                type="text"
                                value={donatario.cras === "1" ? donatario.cadastroCras : donatario.outroLocal || ""}
                                onChange={(e) =>
                                    setDonatario({
                                        ...donatario,
                                        [donatario.cras === "1" ? 'cadastroCras' : 'outroLocal']: e.target.value,
                                    })
                                }
                            />
                        </FloatingLabel>
                    </Row>
                }

                <Row>
                    <Col md={8} className="mb-3">
                        <FloatingLabel controlId="inputTempoResidencia" label="Há quanto tempo reside no local?">
                            <Form.Control
                                type="text"
                                value={donatario.tempoResidencia || ""}
                                onChange={(e) =>
                                    setDonatario({
                                        ...donatario,
                                        tempoResidencia: e.target.value,
                                    })
                                }
                            />
                        </FloatingLabel>
                    </Col>
                </Row>

                <Row>
                    <Col md={8} className="mb-3">
                        <FloatingLabel controlId="inputTelefone" label="Telefone">
                            <Form.Control
                                type="text"
                                value={donatario.pessoa?.telefone || donatario.telefone || ""}
                                disabled
                            />
                        </FloatingLabel>
                    </Col>
                </Row>

                <Row>
                    <Col md={8} className="mb-3">
                        <FloatingLabel controlId="inputRendaFamiliar" label="Renda familiar">
                            <Form.Control
                                type="text"
                                value={donatario.rendaFamiliar || ""}
                                onChange={(e) =>
                                    setDonatario({
                                        ...donatario,
                                        rendaFamiliar: e.target.value,
                                    })
                                }
                            />
                        </FloatingLabel>
                    </Col>
                </Row>

                <Row>
                    <Col md={8} className="mb-3">
                        <SelectSituacaoProfissional
                            value={donatario.idSituacaoProfissional || ""}
                            onChange={(situacao) =>
                                setDonatario({
                                    ...donatario,
                                    idSituacaoProfissional: situacao,
                                })
                            }
                        />
                    </Col>
                </Row>

                <Row>
                    <Col md={14} className="mb-3">
                        <RadioGroup
                            title="Alguém com doença grave ou que esteja acamado reside na mesma casa?"
                            options={[
                                { label: "Sim", value: "1" },
                                { label: "Não", value: "0" },
                            ]}
                            selectedValue={donatario.enfermoNaCasa || "0"}
                            onChange={(e) =>
                                setDonatario({
                                    ...donatario,
                                    enfermoNaCasa: e.target.value,
                                    situacaoEnfermo: e.target.value === "1" ? donatario.situacaoEnfermo : "",
                                })
                            }
                        />
                    </Col>
                </Row>

                <Row>
                    <Col md={14} className="mb-3">
                        <FloatingLabel controlId="inputSituacaoEnfermo" label="Situação do enfermo">
                            <Form.Control
                                type="text"
                                value={donatario.situacaoEnfermo || ""}
                                onChange={(e) =>
                                    setDonatario({
                                        ...donatario,
                                        situacaoEnfermo: e.target.value,
                                    })
                                }
                                disabled={!donatario.enfermoNaCasa || donatario.enfermoNaCasa === "0"}
                            />
                        </FloatingLabel>
                    </Col>
                </Row>
                <Row>
                    <Col md={14} className="mb-3">
                        <SelectPessoa onChange={(secretaria) => setDonatario({ ...donatario, secretariaCadastro: secretaria.idPessoa })} />
                    </Col>
                </Row>

                <h5>Moradores na casa</h5>
                <button
                    type="button"
                    className="btn btn-primary mb-3"
                    onClick={adicionarDependente}
                >
                    Adicionar Morador
                </button>

                {donatario?.dependentes.map((item, index) => (
                    <Row key={index} className="mb-3">
                        <Form.Group className="col">
                            <SelectPessoa
                                label={'Pessoa'}
                                onChange={(dependente) => {
                                    atualizarDependente(index, 'idPessoa', dependente.idPessoa)
                                    atualizarDependente(index, 'dtNascimento', dependente.dtNascimento)
                                }}
                                value={item?.nome}
                            />
                        </Form.Group>
                        <Form.Group className="col">
                            <FloatingLabel controlId="idadeDependente" label="Idade">
                                <Form.Control
                                    type="number"
                                    value={calcularIdade(item.dtNascimento)}
                                    disabled
                                />
                            </FloatingLabel>
                        </Form.Group>
                        <Form.Group className="col">
                            <SelectGrauParentesco
                                onChange={(grauParentesco) => {
                                    atualizarDependente(index, 'idGrauParentesco', grauParentesco);
                                }}
                                value={item.idGrauParentesco}
                                placeholder="Selecione o grau de parentesco"
                            />
                        </Form.Group>
                        <Button onClick={(e) => removerDependente(index)}>Remover Dependente</Button>
                    </Row>
                ))}
            </Form>
        </CustomModal >
    );

}