import { useEffect, useState } from "react";
import OrganizacaoModal from "./ModalOrganizacao";
import { buscarOrganizacoes, deletarOrganização } from "../../api/organizacao";
import { toast } from "react-toastify";
export default function Organizacao() {

    const [organizacoes, setOrganizacoes] = useState([]);
    const [abrirModal, setAbrirModal] = useState(false);
    const [organizacaoSelecionada, setOrganizacaoSelecionada] = useState(null);

    const listarOrganizacoes = async () => {
        const response = await buscarOrganizacoes();
        setOrganizacoes(response.data);
    }

    useEffect(() => {
        listarOrganizacoes();
    }, []);

    const handleDelete = async (idOrganizacao) => {
        try {
            const response = await deletarOrganização(idOrganizacao);
            toast(response.data.message)
            listarOrganizacoes();
        } catch (e) {
            toast.error(e.response.data.error);
        }
    }

    return (
        <div className="conteudo">
            <button onClick={() => {
                setAbrirModal(true);
                setOrganizacaoSelecionada(null);
            }} >Adicionar organização</button>
            <div className="lista">
                {organizacoes.map((organizacao) => (
                    <div key={organizacao.idOrganizacao} className="card">
                        <h2>{organizacao.organizacao}</h2>
                        <button onClick={() => {
                            setOrganizacaoSelecionada(organizacao);
                            setAbrirModal(true);
                        }}>Editar</button>
                        <button onClick={() => {
                            handleDelete(organizacao.idOrganizacao)
                        }}>Deletar</button>
                        <p>CNPJ: {organizacao.cnpj}</p>
                        <p>Telefone: {organizacao.telefone}</p>
                        <p>Email: {organizacao.email}</p>
                        <p>Situação: {organizacao.ieSituacao}</p>
                        <p>Secretária: {organizacao.nomeSecretaria}</p>
                        <p>Rua: {organizacao.endereco?.rua} Número: {organizacao.endereco?.numero} Complemento: {organizacao.endereco?.complemento} </p><br />
                        <p>Bairro: {organizacao.endereco?.bairro} Estado: {organizacao.endereco?.estado} Pais: {organizacao.endereco?.pais} </p>
                    </div>
                ))}
            </div>
            <OrganizacaoModal
                show={abrirModal}
                organizacaoSelecionada={organizacaoSelecionada}
                setShow={setAbrirModal}
                onSubmit={listarOrganizacoes}
                onCancel={() => setOrganizacaoSelecionada(null)}
            />
        </div>
    )
}