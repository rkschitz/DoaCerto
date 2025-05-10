import { useEffect, useState } from "react";
import { buscarMovimentacoes } from "../../api/movimentacao"; 
import formatarDataBRCHora from "../../utils/formatarDataBRCHora"; 
import { useTable, useSortBy, usePagination } from 'react-table'; 
import { Button } from "react-bootstrap"; 
import MovimentacaoModal from "./ModalMovimentacao"; 
import styles from "./movimentacao.module.css"; 
import React from "react";

// Componente principal da página de movimentações
export default function Movimentacao() {
  // Estados para armazenar dados e controle do modal
  const [movimentacoes, setMovimentacoes] = useState([]);
  const [show, setShow] = useState(false);
  const [movimentacaoSelecionada, setMovimentacaoSelecionada] = useState(null);

  // Função assíncrona que busca as movimentações da API
  async function listarMovimentacoes() {
    try {
      const response = await buscarMovimentacoes();
      console.log(response.data);
      setMovimentacoes(response.data); // Atualiza o estado com os dados recebidos
    } catch (e) {
      console.error(e); // Exibe erros no console
    }
  }

  // useEffect executa a busca ao carregar o componente
  useEffect(() => {
    listarMovimentacoes();
  }, []);

  const columns = React.useMemo( // useMemo otimiza a criação de colunas
    () => [
      {
        Header: "Tipo", 
        accessor: "ieMovimentacao", 
      },
      {
        Header: "Data",
        accessor: "dtMovimentacao",
        Cell: ({ value }) => formatarDataBRCHora(value), 
      },
      {
        Header: "Campanha",
        accessor: "tituloCampanha",
      },
      {
        Header: "Doador",
        accessor: "nomeDoador",
      },
      {
        Header: "Donatário",
        accessor: "nomeDonatario",
      },
      {
        Header: "Ações",
        accessor: "acoes",
        Cell: ({ row }) => (
          <Button
            variant="primary"
            onClick={() => {
              setMovimentacaoSelecionada(row.original); // Define a movimentação para edição
              setShow(true); // Exibe o modal
            }}
          >
            Editar
          </Button>
        ),
      },
    ],
    []
  );

  // Configuração da tabela com react-table
  const {
    getTableProps, // Props da <table>
    getTableBodyProps, // Props do <tbody>
    headerGroups, // Grupos de cabeçalho para renderização do <thead>
    page, // Linhas da página atual (importante para paginação)
    prepareRow, // Prepara a linha para renderização
    state: { pageIndex, pageSize }, // Estado da tabela (índice da página e tamanho)
    canPreviousPage, canNextPage, // Booleans de controle de navegação
    pageCount, // Número total de páginas
    gotoPage, nextPage, previousPage, setPageSize, // Funções de navegação e ajuste de tamanho de página
  } = useTable(
    {
      columns,
      data: movimentacoes,
      initialState: { pageIndex: 0 }, // Começa na primeira página
    },
    useSortBy, // Habilita ordenação
    usePagination // Habilita paginação
  );

  return (
    <div className={styles.containerMovimentacao}>
      {/* Cabeçalho da página */}
      <div className={styles.header}>
        <h1>Gerenciar Movimentações</h1>
        <button
          className={styles.addButton}
          onClick={() => {
            setShow(true); // Abre modal para nova movimentação
            setMovimentacaoSelecionada(null); // Limpa seleção anterior
          }}
        >
          Nova Movimentação
        </button>
      </div>

      {/* Tabela */}
      <table {...getTableProps()} className="table table-striped table-bordered">
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {column.render('Header')} {/* Título da coluna */}
                  <span>
                    {column.isSorted
                      ? column.isSortedDesc
                        ? ' 🔽' // Ordenação decrescente
                        : ' 🔼' // Ordenação crescente
                      : ''}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map(row => {
            prepareRow(row); // Prepara os dados da linha
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => (
                  <td {...cell.getCellProps()}>{cell.render('Cell')}</td> // Renderiza cada célula
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Paginação */}
      <div className={styles.pagination}>
        <button
          className={styles.paginationButton}
          onClick={() => gotoPage(0)}
          disabled={!canPreviousPage}
        >
          {'<<'} {/* Primeira página */}
        </button>
        <button
          className={styles.paginationButton}
          onClick={() => previousPage()}
          disabled={!canPreviousPage}
        >
          {'<'} {/* Página anterior */}
        </button>
        <button
          className={styles.paginationButton}
          onClick={() => nextPage()}
          disabled={!canNextPage}
        >
          {'>'} {/* Próxima página */}
        </button>
        <button
          className={styles.paginationButton}
          onClick={() => gotoPage(pageCount - 1)}
          disabled={!canNextPage}
        >
          {'>>'} {/* Última página */}
        </button>

        {/* Exibe página atual e total */}
        <span>
          Página {pageIndex + 1} de {pageCount}
        </span>

        {/* Seleciona quantidade de itens por página */}
        <select
          value={pageSize}
          onChange={e => setPageSize(Number(e.target.value))}
        >
          {[5, 10, 15, 20].map(size => (
            <option key={size} value={size}>
              Mostrar {size}
            </option>
          ))}
        </select>
      </div>

      {/* Modal de criação/edição */}
      <MovimentacaoModal
        show={show}
        setShow={setShow}
        movimentacaoSelecionada={movimentacaoSelecionada}
        onCancel={() => setMovimentacaoSelecionada(null)}
        onMovimentacaoAtualizada={listarMovimentacoes} // Recarrega os dados após salvar
      />
    </div>
  );
}
