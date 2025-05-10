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

const defaultState = {
    idPessoa: null,
    dependentes: []
}

export default function ModalDonatario({
    show,
    setShow,
    donatarioSelecionado,
    onSubmit,
    onCancel
}) {
    // const [selectedDonatario, setSelectedDonatario] = useState(defaultState);
    const [donatario, setDonatario] = useState(defaultState)
    const [dependentes, setDependentes] = useState([]);
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
                    alert("Donatário cadastrado com sucesso!");
                } else {
                    alert("Erro ao cadastrar donatário.");
                }
            } catch (error) {
                console.error("Erro ao cadastrar donatário:", error);
                alert("Erro ao cadastrar donatário.");
            }
        } else {
            try {
                const response = await editarDonatario(donatarioFinal);
                if (response.status === 200) {
                    alert("Donatário editado com sucesso!");
                } else {
                    alert("Erro ao editar donatário.");
                }
                console.log(response);
            } catch (e) {
                console.error("Erro ao editar donatário:", e);
                alert("Erro ao editar donatário.");
            }
        }
        onSubmit?.();
        setShow(false);
    };

    useEffect(() => {
        console.log(donatario)
    }, [donatario])

    function handleReset() {
        setDonatario(defaultState);
        setDependentes([]);
        onCancel?.();
        setShow(false);
    }

    const adicionarDependente = () => {
        const dependentesAtuais = donatario.dependentes || [];
        const novosDependentes = [...dependentesAtuais, { idPessoa: "", idade: "", idGrauParentesco: "" }];
        setDonatario({ ...donatario, dependentes: novosDependentes });
    };

    const atualizarDependente = (index, campo, valor) => {
        const novosDependentes = [...donatario.dependentes];
        novosDependentes[index][campo] = valor;
        setDonatario({ ...donatario, dependentes: novosDependentes });
    };

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
                                value={
                                    'Rua ' + donatario.pessoa?.endereco?.rua + ' ' +
                                    donatario.pessoa?.endereco?.numero + ' ' +
                                    donatario.pessoa?.endereco?.bairro + ' ' +
                                    donatario.pessoa?.endereco?.complemento
                                    || 'Rua ' + donatario.endereco?.rua + ' ' +
                                    donatario.endereco?.numero + ' ' +
                                    donatario.endereco?.bairro + ' ' +
                                    donatario.endereco?.complemento || ""
                                }
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

                <h5>Moradores na casa</h5>
                <button
                    type="button"
                    className="btn btn-primary mb-3"
                    onClick={adicionarDependente}
                >
                    Adicionar Morador
                </button>

                {donatario.dependentes.map((item, index) => (
                    <Row key={index} className="mb-3">
                        <Form.Group className="col">
                            <SelectPessoa
                                label={'Pessoa'}
                                onChange={(dependente) => { atualizarDependente(index, 'idPessoa', dependente.idPessoa) }}
                                value={item.pessoa?.nome}
                            />
                        </Form.Group>
                        <Form.Group className="col">
                            <FloatingLabel controlId="idadeDependente" label="Idade">
                                <Form.Control
                                    type="number"
                                    value={calcularIdade(item.pessoa?.dtNascimento)}
                                    onChange={(e) => atualizarDependente(index, 'idade', e.target.value)}
                                    disabled
                                />
                            </FloatingLabel>
                        </Form.Group>
                        <Form.Group className="col">
                            <SelectGrauParentesco
                                onChange={(grauParentesco) => {
                                    atualizarDependente(index, 'idGrauParentesco', grauParentesco)
                                }}
                                value={item.grauParentesco?.idGrauParentesco}
                                placeholder="Selecione o grau de parentesco"
                            />
                        </Form.Group>

                    </Row>
                    // <div key={index}>
                    //     <strong>Nome:</strong> {dependente?.nome || ""}{" "}
                    //     <strong>Idade:</strong> {dependente?.idade || ""}
                    //     <SelectGrauParentesco
                    //         onChange={(grauParentesco) => {
                    //             const updated = [...dependentes];
                    //             updated[index].idGrauParentesco = grauParentesco;
                    //             setDependentes(updated);
                    //         }}
                    //         value={dependente.idGrauParentesco || ""}
                    //         placeholder="Selecione o grau de parentesco"
                    //     />
                    //     <button
                    //         type="button"
                    //         className="btn btn-danger"
                    //         onClick={() => setDependentes(dependentes.filter((_, i) => i !== index))}
                    //     >
                    //         Remover
                    //     </button>
                    // </div>
                ))}
            </Form>
        </CustomModal >
    );

}