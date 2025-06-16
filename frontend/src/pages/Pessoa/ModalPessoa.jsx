import { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import CustomModal from "../../components/Modal/Modal";
import { criarPessoa, editarPessoa } from "../../api/pessoa";
import { Form, FloatingLabel } from "react-bootstrap";
import { toast } from "react-toastify";
import InputMask from "react-input-mask";
import InputTelefone from "../../components/Inputs/InputTelefone/InputTelefone";
import { cpf as cpfValidator } from 'cpf-cnpj-validator';


const defaultState = {
  nome: "",
  cpf: "",
  telefone: "",
  email: "",
  dtNascimento: "",
  sexo: "",
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
}

export default function PessoaModal({
  show,
  setShow,
  pessoaSelecionada,
  onSubmit,
  onCancel
}) {
  const [pessoa, setPessoa] = useState(defaultState);

  useEffect(() => {
    if (show) {
      if (pessoaSelecionada) {
        setPessoa({
          nome: pessoaSelecionada.nome || "",
          cpf: pessoaSelecionada.cpf || "",
          telefone: pessoaSelecionada.telefone || "",
          email: pessoaSelecionada.email || "",
          dtNascimento: pessoaSelecionada.dtNascimento || "",
          sexo: pessoaSelecionada.sexo || "",
          idPessoa: pessoaSelecionada.idPessoa,
          endereco: {
            cep: pessoaSelecionada.endereco?.cep || "",
            rua: pessoaSelecionada.endereco?.rua || "",
            complemento: pessoaSelecionada.endereco?.complemento || "",
            numero: pessoaSelecionada.endereco?.numero || "",
            bairro: pessoaSelecionada.endereco?.bairro || "",
            cidade: pessoaSelecionada.endereco?.cidade || "",
            estado: pessoaSelecionada.endereco?.estado || "",
            pais: pessoaSelecionada.endereco?.pais || ""
          }
        });
      } else {
        setPessoa(defaultState);
      }
    }
  }, [show, pessoaSelecionada]);

  const buscarEndereco = async (CEP) => {
    try {
      const response = await fetch(`https://viacep.com.br/ws/${CEP}/json/`).then((res) => res.json());

      if (response.erro) {
        alert("CEP não encontrado.");
        return;
      } else {
        setPessoa({
          ...pessoa, endereco: {
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
      toast.error(e)
    }
  }

  const handleClose = () => {
    setShow(false);
    setPessoa(defaultState);
    onCancel?.();
  };

  const salvar = async () => {
    const pessoaParaSalvar = {
      ...pessoa,
      cpf: pessoa.cpf.replace(/\D/g, ""),
      telefone: pessoa.telefone.replace(/\D/g, ""),
    };

    if (!cpfValidator.isValid(pessoaParaSalvar.cpf)) {
      return toast.error('CPF inválido.')
    }

    try {
      const response = pessoaSelecionada ? await editarPessoa(pessoaParaSalvar) : await criarPessoa(pessoaParaSalvar);
      toast(response.data.message)
      onSubmit?.(response.data)
      handleClose();
    } catch (e) {
      toast.error(e.response.data.error);
    }
  };

  const title = pessoaSelecionada ? "Edição de Pessoa" : "Cadastro de Pessoa";
  const submitText = pessoaSelecionada ? "Salvar" : "Cadastrar";

  const isSubmitDisabled =
    !pessoa.nome || !pessoa.cpf || !pessoa.dtNascimento || !pessoa.sexo;

  return (
    <CustomModal
      show={show}
      title={title}
      submitText={submitText}
      resetText="Cancelar"
      submitDisable={isSubmitDisabled}
      handleSubmit={salvar}
      handleClose={handleClose}
    >
      <Row className="mb-3">
        <FloatingLabel controlId="floatingInputNome" label="Nome">
          <Form.Control
            type="text"
            placeholder="Nome"
            value={pessoa.nome}
            onChange={(e) => setPessoa({ ...pessoa, nome: e.target.value })}
          />
        </FloatingLabel>
      </Row>
      <Row>
        <FloatingLabel controlId="floatingInputCpf" label="CPF" className="mb-3">
          <InputMask mask="999.999.999-99"
            value={pessoa.cpf}
            onChange={(e) => setPessoa({ ...pessoa, cpf: e.target.value })}
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
          value={pessoa.telefone}
          onChange={(e) => setPessoa({ ...pessoa, telefone: e })}
        />
      </Row>
      <Row>
        <FloatingLabel controlId="floatingInputEmail" label="Email" className="mb-3">
          <Form.Control
            type="email"
            placeholder="Email"
            value={pessoa.email}
            onChange={(e) => setPessoa({ ...pessoa, email: e.target.value })}
          />
        </FloatingLabel>
      </Row>
      <Row>
        <FloatingLabel controlId="floatingInputDataNascimento" label="Data de Nascimento" className="mb-3">
          <Form.Control
            type="date"
            placeholder="Data de Nascimento"
            value={pessoa.dtNascimento}
            onChange={(e) => setPessoa({ ...pessoa, dtNascimento: e.target.value })}
          />
        </FloatingLabel>
      </Row>
      <Row className="mb-3">
        <FloatingLabel controlId="floatingSelectSexo" label="Sexo">
          <Form.Select
            aria-label="Floating label select example"
            value={pessoa.sexo}
            onChange={(e) => setPessoa({ ...pessoa, sexo: e.target.value })}
          >
            <option value="">Selecione</option>
            <option value="M">Masculino</option>
            <option value="F">Feminino</option>
          </Form.Select>
        </FloatingLabel>
      </Row>
      <Row className="mb-3">
        <FloatingLabel controlId="floatingInputCep" label="CEP">
          <Form.Control
            type="text"
            placeholder="CEP"
            value={pessoa.endereco?.cep}
            onChange={(e) => {
              const novoCep = e.target.value;
              setPessoa((prev) => ({
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
              value={pessoa.endereco?.rua}
              onChange={(e) => setPessoa({ ...pessoa, endereco: { ...pessoa.endereco, rua: e.target.value } })}
              disabled
            />
          </FloatingLabel>
        </Col>
        <Col md={6}>
          <FloatingLabel controlId="floatingInputNumero" label="Número">
            <Form.Control
              type="text"
              placeholder="Número"
              value={pessoa.endereco?.numero}
              onChange={(e) => setPessoa({ ...pessoa, endereco: { ...pessoa.endereco, numero: e.target.value } })}
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
              value={pessoa.endereco?.bairro}
              onChange={(e) => setPessoa({ ...pessoa, endereco: { ...pessoa.endereco, bairro: e.target.value } })}
              disabled
            />
          </FloatingLabel>
        </Col>
        <Col md={6}>
          <FloatingLabel controlId="floatingInputCidade" label="Cidade">
            <Form.Control
              type="text"
              placeholder="Cidade"
              value={pessoa.endereco?.cidade}
              onChange={(e) => setPessoa({ ...pessoa, endereco: { ...pessoa.endereco, cidade: e.target.value } })}
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
              value={pessoa.endereco?.estado}
              onChange={(e) => setPessoa({ ...pessoa, endereco: { ...pessoa.endereco, estado: e.target.value } })}
              disabled
            />
          </FloatingLabel>
        </Col>
        <Col md={6}>
          <FloatingLabel controlId="floatingInputPais" label="Complemento">
            <Form.Control
              type="text"
              placeholder="País"
              value={pessoa.endereco?.complemento}
              onChange={(e) => setPessoa({ ...pessoa, endereco: { ...pessoa.endereco, complemento: e.target.value } })}
            />
          </FloatingLabel>
        </Col>
      </Row>
    </CustomModal>
  );
}
