import { useEffect, useState } from "react";
import OrganizacaoModal from "./ModalOrganizacao";
import { buscarOrganizacoes, deletarOrganizacao } from "../../api/organizacao";
import { toast } from "react-toastify";
import styles from './Organizacao.module.css';

export default function Organizacao() {
    const [organizacoes, setOrganizacoes] = useState([]);
    const [abrirModal, setAbrirModal] = useState(false);
    const [organizacaoSelecionada, setOrganizacaoSelecionada] = useState(null);

    const listarOrganizacoes = async () => {
        try {
            const response = await buscarOrganizacoes();
            setOrganizacoes(response.data);
        } catch (error) {
            toast.error("Erro ao buscar organizações.");
        }
    };

    useEffect(() => {
        listarOrganizacoes();
    }, []);

    const handleDelete = async (idOrganizacao) => {
        try {
            const response = await deletarOrganizacao(idOrganizacao);
            toast.success(response.data.message);
            listarOrganizacoes();
        } catch (error) {
            toast.error(error.response?.data?.error || "Erro ao deletar organização.");
        }
    };

    return (
        <div className={styles.conteudo}>
            <button
                onClick={() => {
                    setAbrirModal(true);
                    setOrganizacaoSelecionada(null);
                }}
            >
                Adicionar organização
            </button>

            <div className={styles.lista}>
                {organizacoes.map((organizacao) => (
                     <div key={organizacao.idOrganizacao} className={styles.card}>
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
                        <p>IE: {organizacao.ieSituacao}</p>
                        <p>Situação: {organizacao.ieSituacao}</p>
                        <p>Secretária: {organizacao.secretaria?.nome}</p>
                        <p> Rua: {organizacao.endereco?.rua} Número: {organizacao.endereco?.numero} Complemento: {organizacao.endereco?.complemento} </p><br />
                        <p><strong>Bairro:</strong> {organizacao.endereco?.bairro}</p>
                        <p><strong>Estado:</strong> {organizacao.endereco?.estado}</p>
                        <p><strong>País:</strong> {organizacao.endereco?.pais}</p>
                    </div>
                ))}
            </div>

            <OrganizacaoModal
                show={abrirModal}
                organizacaoSelecionada={organizacaoSelecionada}
                setShow={setAbrirModal}
                onSubmit={() => {
                    listarOrganizacoes();
                    setOrganizacaoSelecionada(null);
                }}
                onCancel={() => setOrganizacaoSelecionada(null)}
            />
        </div>
    );
}
