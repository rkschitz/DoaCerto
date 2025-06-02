import { useEffect, useState } from "react";
import OrganizacaoModal from "./ModalOrganizacao";
import { buscarOrganizacoes } from "../../api/organizacao";
import styles from './Organizacao.module.css';

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

    return (
        <div className={styles.conteudo}>
            <button onClick={() => {
                setAbrirModal(true);
                setOrganizacaoSelecionada(null);
            }} >Adicionar organização</button>
            <OrganizacaoModal
                show={abrirModal}
                organizacaoSelecionada={organizacaoSelecionada}
                setShow={setAbrirModal}
            />
            <div className={styles.lista}>
                {organizacoes.map((organizacao) => (
                    <div key={organizacao.idOrganizacao} className={styles.card}>
                        <h2>{organizacao.organizacao}</h2>
                        <button onClick={() => {
                            setOrganizacaoSelecionada(organizacao);
                            setAbrirModal(true);
                        }}>Editar</button>
                        <p>CNPJ: {organizacao.cnpj}</p>
                        <p>Telefone: {organizacao.telefone}</p>
                        <p>Email: {organizacao.email}</p>
                        <p>IE: {organizacao.ieSituacao}</p>
                        <p>Secretária: {organizacao.secretaria?.nome}</p>
                        <p> Rua: {organizacao.endereco?.rua} Número: {organizacao.endereco?.numero} Complemento: {organizacao.endereco?.complemento} </p><br />
                        <p><strong>Bairro:</strong> {organizacao.endereco?.bairro}</p>
                        <p><strong>Estado:</strong> {organizacao.endereco?.estado}</p>
                        <p><strong>País:</strong> {organizacao.endereco?.pais}</p>

                    </div>
                ))}
            </div>
        </div>
    )
}