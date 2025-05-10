import { useEffect, useState } from "react";
import { Row, Form, FloatingLabel, Col } from "react-bootstrap";
import CustomModal from "../../components/Modal/Modal";
import { criarOrganizacao, editarOrganizacao } from "../../api/organizacao";
import PessoaLocalizador from "../../components/Localizadores/LocalizadorPessoa/LocalizadorPessoa";
import SelectAlimento from "../../components/Selects/SelectAlimento/SelectAlimento";

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
    onCancel,
    onOrganizacaoCriada,
    onOrganizacaoAtualizada,
}) {
    const [organizacao, setOrganizacao] = useState(defaultState);
    const [openLocalizadorPessoa, setOpenLocalizadorPessoa] = useState(false);

    useEffect(() => {
        if (show) {
            if (organizacaoSelecionada) {
                setOrganizacao({
                    idOrganizacao: organizacaoSelecionada.idOrganizacao || "",
                    organizacao: organizacaoSelecionada.organizacao || "",
                    cnpj: organizacaoSelecionada.cnpj || "",
                    telefone: organizacaoSelecionada.telefone || "",
                    email: organizacaoSelecionada.email || "",
                    secretaria: organizacaoSelecionada.secretaria.nome || "",
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
            console.log(e)
        }
    }

    const handleClose = () => {
        setShow(false);
        setOrganizacao(defaultState);
        onCancel?.();
    };

    const salvar = async () => {
        try {
            let response;
            if (organizacaoSelecionada?.idOrganizacao) {
                console.log(organizacao)
                response = await editarOrganizacao(organizacao
                );
                onOrganizacaoAtualizada?.(response.data);
            } else {
                response = await criarOrganizacao(organizacao);
                onOrganizacaoCriada?.(response.data);
            }
            handleClose();
        } catch (err) {
            console.error("Erro ao salvar organização:", err);
        }
    };

    const submitText = organizacaoSelecionada ? "Salvar" : "Cadastrar";
    const isSubmitDisabled =
        !organizacao.organizacao ||
        !organizacao.cnpj ||
        !organizacao.telefone;
    // !organizacao.email ||
    // !organizacao.secretaria?.nome;

    return (
        <CustomModal
            show={show}
            setShow={setShow}
            title={
                organizacaoSelecionada ? "Editar Organização" : "Adicionar Organização"
            }
            submit={salvar}
            submitText={submitText}
            resetText="Cancelar"
            submitDisable={isSubmitDisabled}
            reset={handleClose}
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
                    <Form.Control
                        type="text"
                        placeholder="CNPJ"
                        value={organizacao.cnpj}
                        onChange={(e) => setOrganizacao({ ...organizacao, cnpj: e.target.value })}
                    />
                </FloatingLabel>
            </Row>
            <Row className="mb-3">
                <FloatingLabel controlId="floatingInputTelefone" label="Telefone">
                    <Form.Control
                        type="text"
                        placeholder="Telefone"
                        value={organizacao.telefone}
                        onChange={(e) => setOrganizacao({ ...organizacao, telefone: e.target.value })}
                    />
                </FloatingLabel>
            </Row>
            <Row className="mb-3">
                <FloatingLabel controlId="floatingInputEmail" label="Email">
                    <Form.Control
                        type="email"
                        placeholder="Email"
                        value={organizacao.email}
                        onChange={(e) => setOrganizacao({ ...organizacao, email: e.target.value })}
                    />
                </FloatingLabel>
            </Row>
            <Row className="mb-3">
                <FloatingLabel controlId="floatingInput" label="Secretaria">
                    <Form.Control
                        type="text"
                        placeholder="Secretaria"
                        value={organizacao.secretaria?.nome}
                        onClick={() => {
                            setOpenLocalizadorPessoa(true);
                        }}
                    />
                </FloatingLabel>
            </Row>
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
                    <FloatingLabel controlId="floatingInputPais" label="País">
                        <Form.Control
                            type="text"
                            placeholder="País"
                            value={organizacao.endereco?.pais}
                            onChange={(e) => setOrganizacao({ ...organizacao, endereco: { ...organizacao.endereco, pais: e.target.value } })}
                            disabled
                        />
                    </FloatingLabel>
                </Col>
            </Row>
        </CustomModal>
    );
}
