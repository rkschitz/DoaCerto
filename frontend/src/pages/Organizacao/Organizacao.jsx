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
            <button className={styles.btnAdicionar}
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



                        <div className={styles.cabecalho}>
                            <h2>{organizacao.organizacao}</h2>
                            <div className={styles.botoesAcoes}>
                                <button className={styles.btnDeletar} onClick={() => {
                                    handleDelete(organizacao.idOrganizacao)
                                }}>Deletar</button>
                                <button className={styles.btnEditar} onClick={() => {
                                    setOrganizacaoSelecionada(organizacao);
                                    setAbrirModal(true);
                                }}>Editar</button>
                            </div>
                        </div>




                        <p><strong>CNPJ:</strong> {organizacao.cnpj}</p>
                        <p><strong>Telefone:</strong> {organizacao.telefone}</p>
                        <p><strong>Email:</strong> {organizacao.email}</p>
                        <p><strong>IE:</strong> {organizacao.ieSituacao}</p>
                        <p><strong>Situação:</strong> {organizacao.ieSituacao}</p>
                        <p><strong>Secretária:</strong> {organizacao.secretaria?.nome}</p>
                        <p><strong>Rua:</strong> {organizacao.endereco?.rua} Número: {organizacao.endereco?.numero} Complemento: {organizacao.endereco?.complemento} </p><br />
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

