import { useEffect, useState } from "react";
import { Row, Form, FloatingLabel, Col } from "react-bootstrap";
import CustomModal from "../../components/Modal/Modal";
import { criarOrganizacao, editarOrganizacao, validarDadoOrganizacao } from "../../api/organizacao";
import InputMask from "react-input-mask";
import InputTelefone from "../../components/Inputs/InputTelefone/InputTelefone";
import InputEmail from "../../components/Inputs/InputEmail/InputEmail";
import SelectPessoa from "../../components/Selects/SelectPessoa/SelectPessoa";
import { toast } from "react-toastify";
import { cnpj } from 'cpf-cnpj-validator';

const defaultState = {
    organizacao: "",
    cnpj: "",
    telefone: "",
    email: "",
    endereco: {
        cep: "",
        rua: "",
        complemento: "",
        numero: "",
        bairro: "",
        cidade: "",
        estado: "",
        pais: ""
    }
};

export default function OrganizacaoModal({
    show,
    setShow,
    organizacaoSelecionada,
    onSubmit,
    onCancel
}) {
    const [organizacao, setOrganizacao] = useState(defaultState);
    const [emailDisponivel, setEmailDisponivel] = useState(true);

    useEffect(() => {
        if (show) {
            if (organizacaoSelecionada) {
                setOrganizacao({
                    idOrganizacao: organizacaoSelecionada.idOrganizacao || "",
                    organizacao: organizacaoSelecionada.organizacao || "",
                    cnpj: organizacaoSelecionada.cnpj || "",
                    telefone: organizacaoSelecionada.telefone || "",
                    email: organizacaoSelecionada.email || "",
                    // nomeSecretaria: organizacaoSelecionada.nomeSecretaria || "",
                    // secretaria: organizacaoSelecionada.idSecretaria || "",
                    endereco: {
                        cep: organizacaoSelecionada.endereco?.cep || "",
                        rua: organizacaoSelecionada.endereco?.rua || "",
                        complemento: organizacaoSelecionada.endereco?.complemento || "",
                        numero: organizacaoSelecionada.endereco?.numero || "",
                        bairro: organizacaoSelecionada.endereco?.bairro || "",
                        cidade: organizacaoSelecionada.endereco?.cidade || "",
                        estado: organizacaoSelecionada.endereco?.estado || "",
                        pais: organizacaoSelecionada.endereco?.pais || ""
                    }
                });
            } else {
                setOrganizacao(defaultState);
            }
        }

    }, [show, organizacaoSelecionada]);

    const validarDado = async (param) => {
        const response = await validarDadoOrganizacao(param);
        if (response.data.disponivel) {
            setEmailDisponivel(true)
        } else {
            setEmailDisponivel(false)
        }
    }

    const buscarEndereco = async (CEP) => {
        try {
            const response = await fetch(`https://viacep.com.br/ws/${CEP}/json/`).then((res) => res.json());

            if (response.erro) {
                alert("CEP não encontrado.");
                return;
            } else {
                setOrganizacao({
                    ...organizacao, endereco: {
                        cep: response.cep,
                        rua: response.logradouro.replace("Rua", ""),
                        bairro: response.bairro,
                        cidade: response.localidade,
                        estado: response.estado,
                        pais: "Brasil",
                    }
                })
            }
        } catch (e) {
            return toast('Erro ao buscar endereço');
        }
    }

    const handleClose = () => {
        setShow(false);
        setOrganizacao(defaultState);
        setEmailDisponivel(true)
        onCancel?.()
    };

    const salvar = async () => {
        const organizacaoParaSalvar = {
            ...organizacao,
            cnpj: organizacao.cnpj.replace(/\D/g, ""),
            telefone: organizacao.telefone.replace(/\D/g, ""),
        };

        if (!cnpj.isValid(organizacaoParaSalvar.cnpj)) {
            return toast.error('CNPJ inválido')
        }

        try {
            const response = organizacaoSelecionada?.idOrganizacao ? await editarOrganizacao(organizacaoParaSalvar) : await criarOrganizacao(organizacaoParaSalvar)
            toast(response.data.message);
            onSubmit?.(response.data);
            handleClose();
        } catch (e) {
            toast.error(e.response.data.error)
        }
    };


    const submitText = organizacaoSelecionada ? "Salvar" : "Cadastrar";
    const isSubmitDisabled =
        !organizacao.organizacao ||
        !organizacao.cnpj ||
        !organizacao.telefone ||
        !organizacao.email ||
        // !organizacao.secretaria ||
        !organizacao.endereco.cep ||
        !organizacao.endereco.numero ||
        !organizacao.endereco.complemento ||
        !emailDisponivel;

    return (
        <CustomModal
            show={show}
            setShow={setShow}
            title={
                organizacaoSelecionada ? "Editar Organização" : "Adicionar Organização"
            }
            submitText={submitText}
            submitDisable={isSubmitDisabled}
            resetText="Cancelar"
            handleSubmit={salvar}
            handleClose={handleClose}
        >
            <Row className="mb-3">
                <FloatingLabel controlId="floatingInputOrganizacao" label="Organização">
                    <Form.Control
                        type="text"
                        placeholder="Organização"
                        value={organizacao.organizacao}
                        onChange={(e) =>
                            setOrganizacao({ ...organizacao, organizacao: e.target.value })
                        }
                    />
                </FloatingLabel>
            </Row>
            <Row className="mb-3">
                <FloatingLabel controlId="floatingInputCnpj" label="CNPJ">
                    <InputMask mask="99.999.999/9999-99"
                        value={organizacao.cnpj}
                        onChange={(e) => setOrganizacao({ ...organizacao, cnpj: e.target.value })}
                    >
                        {({ inputProps }) => (
                            <Form.Control
                                {...inputProps}
                                type="text"
                                placeholder="CNPJ"
                            />
                        )}
                    </InputMask>
                </FloatingLabel>
            </Row>
            <Row className="mb-3">
                <InputTelefone
                    value={organizacao.telefone}
                    onChange={(value) => setOrganizacao({ ...organizacao, telefone: value })}
                />
            </Row>
            <Row className="mb-3">
                <InputEmail
                    value={organizacao.email}
                    onChange={(value) => { setOrganizacao({ ...organizacao, email: value }); setEmailDisponivel(true); }}
                    onBlur={() => {
                        if (organizacao.email) {
                            validarDado({ email: organizacao.email });
                        }
                    }}
                />
                {emailDisponivel === false && <span className="text-danger">Email não disponivel</span>}
            </Row>
            {/* <Row className="mb-3">
                <SelectPessoa
                    value={organizacao.nomeSecretaria}
                    onChange={(value) => setOrganizacao({ ...organizacao, secretaria: value.idPessoa })}
                    label="Secretaria"
                />
            </Row> */}
            <Row className="mb-3">
                <FloatingLabel controlId="floatingInputCep" label="CEP">
                    <Form.Control
                        type="text"
                        placeholder="CEP"
                        value={organizacao.endereco?.cep}
                        onChange={(e) => {
                            const novoCep = e.target.value;
                            setOrganizacao((prev) => ({
                                ...prev,
                                endereco: { ...prev.endereco, cep: novoCep }
                            }));

                            if (novoCep.length === 8) {
                                buscarEndereco(novoCep);
                            }
                        }}
                        onBlur={(e) => {
                            const cep = e.target.value;
                            if (cep.length === 8) {
                                buscarEndereco(cep);
                            }
                        }}
                    />
                </FloatingLabel>
            </Row>
            <Row className="mb-3">
                <Col md={6}>
                    <FloatingLabel controlId="floatingInputRua" label="Rua">
                        <Form.Control
                            type="text"
                            placeholder="Rua"
                            value={organizacao.endereco?.rua}
                            onChange={(e) => setOrganizacao({ ...organizacao, endereco: { ...organizacao.endereco, rua: e.target.value } })}
                            disabled
                        />
                    </FloatingLabel>
                </Col>
                <Col md={6}>
                    <FloatingLabel controlId="floatingInputNumero" label="Número">
                        <Form.Control
                            type="text"
                            placeholder="Número"
                            value={organizacao.endereco?.numero}
                            onChange={(e) => setOrganizacao({ ...organizacao, endereco: { ...organizacao.endereco, numero: e.target.value } })}
                        />
                    </FloatingLabel>
                </Col>
            </Row>
            <Row className="mb-3">
                <Col md={6}>
                    <FloatingLabel controlId="floatingInputBairro" label="Bairro">
                        <Form.Control
                            type="text"
                            placeholder="Bairro"
                            value={organizacao.endereco?.bairro}
                            onChange={(e) => setOrganizacao({ ...organizacao, endereco: { ...organizacao.endereco, bairro: e.target.value } })}
                            disabled
                        />
                    </FloatingLabel>
                </Col>
                <Col md={6}>
                    <FloatingLabel controlId="floatingInputCidade" label="Cidade">
                        <Form.Control
                            type="text"
                            placeholder="Cidade"
                            value={organizacao.endereco?.cidade}
                            onChange={(e) => setOrganizacao({ ...organizacao, endereco: { ...organizacao.endereco, cidade: e.target.value } })}
                            disabled
                        />
                    </FloatingLabel>
                </Col>
            </Row>
            <Row className="mb-3">
                <Col md={6}>
                    <FloatingLabel controlId="floatingInputEstado" label="Estado">
                        <Form.Control
                            type="text"
                            placeholder="Estado"
                            value={organizacao.endereco?.estado}
                            onChange={(e) => setOrganizacao({ ...organizacao, endereco: { ...organizacao.endereco, estado: e.target.value } })}
                            disabled
                        />
                    </FloatingLabel>
                </Col>
                <Col md={6}>
                    <FloatingLabel controlId="floatingInputPais" label="Complemento">
                        <Form.Control
                            type="text"
                            placeholder="Complemento"
                            value={organizacao.endereco?.complemento}
                            onChange={(e) => setOrganizacao({ ...organizacao, endereco: { ...organizacao.endereco, complemento: e.target.value } })}
                        />
                    </FloatingLabel>
                </Col>
            </Row>
        </CustomModal>
    );
}
