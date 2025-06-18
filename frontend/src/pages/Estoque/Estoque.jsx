import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { buscarAlimentosMovimentacao } from "../../api/organizacao";
import styles from "./Estoque.module.css";

export default function Estoque() {
  const [alimentos, setAlimentos] = useState([]);

  const listar = async () => {
    try {
      const response = await buscarAlimentosMovimentacao();
      setAlimentos(response.data);
    } catch (e) {
      toast.error(e?.response?.data?.error || "Erro ao buscar alimentos.");
    }
  };

  useEffect(() => {
    listar();
  }, []);

  return (
    <div className={styles.estoqueContainer}>
      <h2 className={styles.estoqueTitle}>Estoque de Alimentos</h2>
      <p className={styles.estoqueSubtitle}>
        Gerencie seu inventário de forma inteligente
      </p>

      <div className={styles.searchFilter}>
        <input
          className={styles.searchInput}
          placeholder="Buscar alimentos..."
        />
        <button className={styles.filterButton}>Filtros</button>
      </div>

      <div className={styles.alimentosContainer}>
        {alimentos.length === 0 ? (
          <p className={styles.estoqueEmpty}>Nenhum alimento encontrado.</p>
        ) : (
          alimentos.map((item, index) => (
            <div key={index} className={styles.alimentoCard}>
              <div className={styles.cardHeader}>
                <p className={styles.alimentoNome}>{item.alimento}</p>
                {item.saldo <= 5 && (
                  <span className={styles.statusBaixo}>Baixo</span>
                )}
              </div>
              <p className={styles.cardInfoLabel}>
                <strong>Saldo Atual:</strong> {item.saldo}
              </p>
              <div className={styles.progressBarContainer}>
                <div
                  className={styles.progressBar}
                  style={{ width: `${Math.min(item.saldo, 100)}%` }}
                ></div>
              </div>
              <div className={styles.cardStats}>
                <div>
                  <p>Entradas</p>
                  <span className={styles.cardInfoGreen}>
                    {item.total_entradas}
                  </span>
                </div>
                <div>
                  <p>Saídas</p>
                  <span className={styles.cardInfoRed}>
                    {item.total_saidas}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className={styles.addItemSection}>
        <p>Adicione mais itens ao seu estoque</p>
      </div>
    </div>
  );
}
