import { Row, Form, FloatingLabel, Col, Button } from "react-bootstrap";
import Localizador from "../Localizador/Localizador";
import { buscarPessoaPorNome } from "../../../api/pessoa";
import { useState, useEffect } from "react";
import PessoaModal from "../../../pages/Pessoa/ModalPessoa";
import formatarDataBR from "../../../utils/formatarDataBR";
import calcularIdade from "../../../utils/calcularIdade";

export default function PessoaLocalizador({ onSelect, show, setShow }) {
    const [pessoas, setPessoas] = useState([]);
    const [cpf, setCpf] = useState('');
    const [nome, setNome] = useState('');
    const [abrirModalPessoa, setAbrirModalPessoa] = useState(false);

    const colunasLista = ["Id", "Nome", "CPF", "Data de nascimento", "Sexo"];
    const [conteudoLista, setConteudoLista] = useState([])

    async function atualizarLista(nome, cpf) {
        const response = await buscarPessoaPorNome(nome, cpf);
        const responsePessoa = response.data.map((item) => ({
            idPessoa: item.idPessoa,
            nome: item.nome,
            cpf: item.cpf,
            dtNascimento: formatarDataBR(item.dtNascimento),
            sexo: item.sexo,
            idade: calcularIdade(item.dtNascimento),
            email: item.email,
            telefone: item.telefone,
        }));
        setConteudoLista(responsePessoa)
        setPessoas(response.data);
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
            conteudoLista={conteudoLista}
            show={show}
            setShow={setShow}
            submitText={"Selecionar"}
            onSelectItem={(pessoaSelecionada) => {
                const pessoaCompleta = pessoas.find(p => p.idPessoa === pessoaSelecionada.idPessoa);
                onSelect?.(pessoaCompleta);
                setConteudoLista(null)
            }}
            handleClose={() => { setConteudoLista(null); setShow(false) }}
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
                        <Button variant="secondary" onClick={() => setAbrirModalPessoa(true)}>
                            Nova pessoa
                        </Button>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Button onClick={(e) => buscarPessoa(e)} variant="primary">Buscar pessoas</Button>
                    </Col>
                </Row>
            </Form>

            <PessoaModal
                show={abrirModalPessoa}
                setShow={setAbrirModalPessoa}
                onSubmit={(pessoa) => atualizarLista(pessoa.nome, pessoa.cpf)}
            />
        </Localizador>
    );
}
