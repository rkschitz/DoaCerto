import { Row, Form, FloatingLabel, Col, Button } from "react-bootstrap";
import Localizador from "../Localizador/Localizador";
import { buscarDonatariosAtivos } from "../../../api/donatario";
import { useState, useEffect } from "react";
import PessoaModal from "../../../pages/Pessoa/ModalPessoa";
import formatarDataBR from "../../../utils/formatarDataBR";
import calcularIdade from "../../../utils/calcularIdade";
import ModalDonatario from "../../../pages/Donatario/ModalDonatario";

export default function LocalizadorDonatario({ onSelect, show, setShow }) {
    const [donatarios, setPessoas] = useState([]);
    const [cpf, setCpf] = useState('');
    const [nome, setNome] = useState('');
    const [abrirModalDonatario, setAbrirModalDonatario] = useState(false);

    const colunasLista = ["Id", "Nome", "CPF", "Data de nascimento", "Sexo"];

    async function atualizarLista(nome, cpf) {
        const response = await buscarDonatariosAtivos(nome, cpf);
        const responseDonatario = response.data.map((item) => ({
            idPessoa: item.idPessoa,
            nome: item.pessoa.nome,
            cpf: item.pessoa.cpf,
            dtNascimento: formatarDataBR(item.pessoa.dtNascimento),
            idade: calcularIdade(item.pessoa.dtNascimento),
            sexo: item.pessoa.sexo,
            email: item.pessoa.email,
            telefone: item.pessoa.telefone,
            idDonatario:item.idDonatario,
        }));
        setPessoas(responseDonatario);
    }

    async function buscarPessoa(e) {
        e.preventDefault();
        await atualizarLista(nome, cpf);
    }

    useEffect(() => {
        if (!show) {
            setNome('');
            setCpf('');
            setPessoas([]);
        }
    }, [show]);

    return (
        <Localizador
            colunasLista={colunasLista}
            conteudoLista={donatarios}
            show={show}
            setShow={setShow}
            onSelectItem={(donatario) => {
                onSelect?.(donatario);
            }}
        >
            <Form>
                <Row className="mb-3">
                    <Col md={4}>
                        <FloatingLabel controlId="floatingInputCpf" label="CPF" className="mb-3">
                            <Form.Control
                                type="text"
                                placeholder="CPF"
                                value={cpf}
                                onChange={(e) => setCpf(e.target.value)}
                            />
                        </FloatingLabel>
                    </Col>
                    <Col md={8}>
                        <FloatingLabel controlId="floatingInputNome" label="Nome" className="mb-3">
                            <Form.Control
                                type="text"
                                placeholder="Nome"
                                value={nome}
                                onChange={(e) => setNome(e.target.value)}
                            />
                        </FloatingLabel>
                    </Col>
                    <Col md={4}>
                        <Button variant="secondary" onClick={() => setAbrirModalDonatario(true)}>
                            Novo donatario
                        </Button>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Button onClick={(e) => buscarPessoa(e)} variant="primary">Buscar donatarios</Button>
                    </Col>
                </Row>
            </Form>
            <ModalDonatario
                show={abrirModalDonatario}
                setShow={setAbrirModalDonatario}
                donatarioCriada={(donatario) => atualizarLista(donatario.nome, donatario.cpf)}
            />
        </Localizador>
    );
}
