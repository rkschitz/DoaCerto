import { useEffect, useState } from "react";
import { buscarMovimentacoes, excluirMovimentacao } from "../../api/movimentacao";
import formatarDataBRCHora from "../../utils/formatarDataBRCHora";
import MovimentacaoModal from "./ModalMovimentacao";
import { toast } from "react-toastify";
import { useTable, useSortBy, usePagination } from 'react-table';
import { Button } from "react-bootstrap";
import styles from "./movimentacao.module.css";
import React from "react";

export default function Movimentacao() {
  const [movimentacoes, setMovimentacoes] = useState([]);
  const [show, setShow] = useState(false);
  const [movimentacaoSelecionada, setMovimentacaoSelecionada] = useState(null);

  async function listarMovimentacoes() {
    try {
      const response = await buscarMovimentacoes();
      console.log(response.data);
      setMovimentacoes(response.data);
    } catch (e) {
      console.error(e);
    }
  }

  async function excluirMovimentacaoSelecionada(movimentacao) {
    try {
      if (!window.confirm('Deseja realmente excluir a movimentação?')) {
        return;
      }
      const response = await excluirMovimentacao(movimentacao.idMovimentacao);
      if (response.status === 200) {
        toast(response.data.message);
        listarMovimentacoes();
      }
    } catch (e) {
      toast.error(e.message);
    }
  }

  useEffect(() => {
    listarMovimentacoes();
  }, []);

  const columns = React.useMemo(
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
              setMovimentacaoSelecionada(row.original);
              setShow(true);
            }}
          >
            Editar
          </Button>
        ),
      },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    state: { pageIndex, pageSize },
    canPreviousPage, canNextPage,
    pageCount,
    gotoPage, nextPage, previousPage, setPageSize,
  } = useTable(
    {
      columns,
      data: movimentacoes,
      initialState: { pageIndex: 0 },
    },
    useSortBy,
    usePagination
  );

  return (
    <div className={styles.containerMovimentacao}>
      <div className={styles.header}>
        <h1>Gerenciar Movimentações</h1>
        <button
          className={styles.addButton}
          onClick={() => {
            setShow(true); 
            setMovimentacaoSelecionada(null);
          }}
        >
          Nova Movimentação
        </button>
      </div>

      <table {...getTableProps()} className="table table-striped table-bordered">
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {column.render('Header')}
                  <span>
                    {column.isSorted
                      ? column.isSortedDesc
                        ? ' 🔽'
                        : ' 🔼'
                      : ''}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map(row => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => (
                  <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className={styles.pagination}>
        <button
          className={styles.paginationButton}
          onClick={() => gotoPage(0)}
          disabled={!canPreviousPage}
        >
          {'<<'}
        </button>
        <button
          className={styles.paginationButton}
          onClick={() => previousPage()}
          disabled={!canPreviousPage}
        >
          {'<'}
        </button>
        <button
          className={styles.paginationButton}
          onClick={() => nextPage()}
          disabled={!canNextPage}
        >
          {'>'}
        </button>
        <button
          className={styles.paginationButton}
          onClick={() => gotoPage(pageCount - 1)}
          disabled={!canNextPage}
        >
          {'>>'}
        </button>

        <span>
          Página {pageIndex + 1} de {pageCount}
        </span>

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

      <MovimentacaoModal
        show={show}
        setShow={setShow}
        movimentacaoSelecionada={movimentacaoSelecionada}
        onCancel={(e) => setMovimentacaoSelecionada({})}
        onMovimentacaoAtualizada={(e) => listarMovimentacoes()}
        onMovimentacaoCriada={(e) => listarMovimentacoes()}
      />
    </div>
  );
}
