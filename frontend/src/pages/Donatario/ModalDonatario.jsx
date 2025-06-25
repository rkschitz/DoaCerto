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
import SelectNacionalidade from "../../components/Selects/SelectNacionalidade/SelectNacionalidade";

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

    useEffect(() => {
        if (show) {
            if (donatarioSelecionado?.idDonatario) {
                setDonatario(donatarioSelecionado);
            } else {
                setDonatario(defaultState);
            }
        }
    }, [show, donatarioSelecionado]);

    const salvar = async () => {
        const donatarioFinal = {
            ...donatario,
            idPessoa: donatario.pessoa?.idPessoa,
        }

        try {
            const response = donatarioSelecionado ? await editarDonatario(donatarioFinal) : await criarDonatario(donatarioFinal);
            toast(response.data.message);
            handleClose()
            onSubmit?.(response.data);
        } catch (e) {
            toast.error(e.response.data.message);
        }
    };

    function handleClose() {
        setShow(false);
        setDonatario(defaultState);
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
            show={show}
            setShow={setShow}
            title={donatarioSelecionado ? "Editar Pessoa" : "Cadastrar Pessoa"}
            submitText={donatarioSelecionado ? "Salvar Alterações" : "Cadastrar"}
            resetText="Cancelar"
            handleSubmit={salvar}
            handleClose={handleClose}
        >
            <Form>
                <Row>
                    <Col md={6}>
                        <div className="mb-3">
                            <SelectPessoa
                                label={'Nome'}
                                value={donatario.pessoa?.nome || donatario.nome}
                                onChange={(pessoa) => { setDonatario({ ...donatario, pessoa }); }}
                            />
                        </div>

                        <div style={{ marginBottom: '1rem' }}>
                            <FloatingLabel controlId="inputCPF" label="CPF">
                                <Form.Control
                                    type="text"
                                    placeholder="CPF"
                                    value={donatario.pessoa?.cpf || donatario.cpf || ""}
                                    disabled
                                />
                            </FloatingLabel>
                        </div>

                        <div className="mb-3">
                            <FloatingLabel controlId="inputNascimento" label="Data de nascimento">
                                <Form.Control
                                    type="text"
                                    value={formatarDataBR(donatario.pessoa?.dtNascimento) || formatarDataBR(donatario.dtNascimento) || ""}
                                    disabled
                                />
                            </FloatingLabel>
                        </div>

                        <div className="mb-3">
                            <SelectSexo
                                value={donatario.pessoa?.sexo || donatario.sexo || ""}
                                onChange={(sexo) => setDonatario({ ...donatario, sexo })}
                                disabled
                            />
                        </div>

                        <Row>
                            <Col md={8} className="mb-3">
                                <SelectSituacaoProfissional
                                    value={donatario.idSituacaoProfissional || ""}
                                    onChange={(situacao) => setDonatario({ ...donatario, idSituacaoProfissional: situacao })}
                                />
                            </Col>
                        </Row>

                    </Col>

                    <Col md={6}>
                        <div className="mb-3">
                            <FloatingLabel controlId="inputCidade" label="Cidade">
                                <Form.Control
                                    type="text"
                                    value={donatario.pessoa?.endereco?.cidade || donatario.endereco?.cidade || ""}
                                    disabled
                                    placeholder="Cidade"
                                />
                            </FloatingLabel>
                        </div>

                        <div className="mb-3">
                            <FloatingLabel controlId="inputEndereco" label="Endereço">
                                <Form.Control
                                    type="text"
                                    value={donatario.pessoa?.endereco?.enderecoCompleto || donatario.endereco?.enderecoCompleto || ""}
                                    placeholder="Endereço"
                                    disabled
                                />
                            </FloatingLabel>
                        </div>

                        <div className="mb-3">
                            <FloatingLabel controlId="inputTelefone" label="Telefone">
                                <Form.Control
                                    type="text"
                                    value={donatario.pessoa?.telefone || donatario.telefone || ""}
                                    disabled
                                />
                            </FloatingLabel>
                        </div>

                        <div className="mb-3">
                            <SelectNacionalidade
                                onChange={(nacionalidade) => { setDonatario({ ...donatario, idNacionalidade: nacionalidade }); }}
                                value={donatario.idNacionalidade}
                            />
                        </div>

                        <Row>
                            <Col md={6} className="mb-3">
                                <SelectSituacaoHabitacional
                                    value={donatario.idSituacaoHabitacional || ""}
                                    onChange={(situacao) => setDonatario({ ...donatario, idSituacaoHabitacional: situacao })}
                                />
                            </Col>
                        </Row>
                    </Col>
                </Row>

                <Row>
                    <RadioGroup
                        title="Cadastro CRAS?"
                        options={[
                            { label: "Sim", value: "1" },
                            { label: "Não", value: "0" },
                            { label: "Outro local", value: "2" },
                        ]}
                        selectedValue={donatario.cras}
                        onChange={(e) => setDonatario({ ...donatario, cras: e.target.value })}
                    />
                </Row>

                {(donatario.cras !== "0" || !donatario.cras) &&
                    <Row className="mb-3" style={{ maxWidth: '66vh' }}>
                        <FloatingLabel controlId="inputCadastroCrasOUOutroLocal" label={donatario.cras === "1" ? 'Cadastro cras' : 'Outro local'}>
                            <Form.Control
                                type="text"
                                value={donatario.cras === "1" ? donatario.cadastroCras : donatario.outroLocal || ""}
                                onChange={(e) => setDonatario({
                                    ...donatario,
                                    [donatario.cras === "1" ? 'cadastroCras' : 'outroLocal']: e.target.value,
                                })}
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
                                onChange={(e) => setDonatario({ ...donatario, tempoResidencia: e.target.value })}
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
                                onChange={(e) => setDonatario({ ...donatario, rendaFamiliar: e.target.value })}
                            />
                        </FloatingLabel>
                    </Col>
                </Row>

                <Row>
                    <Col md={12} className="mb-3">
                        <RadioGroup
                            title="Alguém com doença grave ou que esteja acamado reside na mesma casa?"
                            options={[
                                { label: "Sim", value: "1" },
                                { label: "Não", value: "0" },
                            ]}
                            selectedValue={donatario.enfermoNaCasa || "0"}
                            onChange={(e) => setDonatario({
                                ...donatario,
                                enfermoNaCasa: e.target.value,
                                situacaoEnfermo: e.target.value === "1" ? donatario.situacaoEnfermo : "",
                            })}
                        />
                    </Col>
                </Row>

                <Row>
                    <Col md={12} className="mb-3">
                        <FloatingLabel controlId="inputSituacaoEnfermo" label="Situação do enfermo">
                            <Form.Control
                                type="text"
                                value={donatario.situacaoEnfermo || ""}
                                onChange={(e) => setDonatario({ ...donatario, situacaoEnfermo: e.target.value })}
                                disabled={!donatario.enfermoNaCasa || donatario.enfermoNaCasa === "0"}
                            />
                        </FloatingLabel>
                    </Col>
                </Row>

                <Row>
                    <Col md={12} className="mb-3">
                        <SelectPessoa
                            label={"Secretária responsável pelo cadastro"}
                            onChange={(secretaria) => setDonatario({ ...donatario, secretaria })}
                            value={donatario.secretaria?.nome || donatario.secretaria}
                        />
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
                        <Form.Group className="col mt-3">
                            <SelectPessoa
                                label={'Pessoa'}
                                onChange={(dependente) => {
                                    atualizarDependente(index, 'idPessoa', dependente.idPessoa);
                                    atualizarDependente(index, 'dtNascimento', dependente.dtNascimento);
                                }}
                                value={item?.nome}
                            />
                        </Form.Group>
                        <Form.Group className="col mt-3">
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
                        <Button className="mt-4" onClick={() => removerDependente(index)}>Remover Dependente</Button>
                    </Row>
                ))}
            </Form>

        </CustomModal >
    );

}