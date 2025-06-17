import { useEffect, useState } from "react";
import { buscarMovimentacoes, excluirMovimentacaoAlimento } from "../../api/movimentacao";
import formatarDataBRCHora from "../../utils/formatarDataBRCHora";
import MovimentacaoModal from "./ModalMovimentacao";
import { toast } from "react-toastify";
import { useTable, useSortBy, usePagination } from 'react-table';
import { Button } from "react-bootstrap";
import styles from "./movimentacao.module.css";
import React from "react";
import formatarDataBR from "../../utils/formatarDataBR";

export default function Movimentacao() {
  const [movimentacoes, setMovimentacoes] = useState([]);
  const [show, setShow] = useState(false);
  const [movimentacaoSelecionada, setMovimentacaoSelecionada] = useState({});

  async function listarMovimentacoes() {
    try {
      const response = await buscarMovimentacoes();
      setMovimentacoes(response.data);
    } catch (e) {
      toast.error(e.response.data.error);
    }
  }

  async function excluirMovimentacaoSelecionada(movimentacao) {
    try {
      if (!window.confirm('Deseja realmente excluir a movimentação?')) {
        return;
      }
      const response = await excluirMovimentacaoAlimento(movimentacao.idMovimentacaoAlimento);
      if (response.status === 200) {
        toast(response.data.message);
      }
    } catch (e) {
      toast.error(e.response.data.message);
    }
    listarMovimentacoes();
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
        accessor: "dataMovimentacao",
        Cell: ({ value }) => formatarDataBR(value),
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
        Header: "Item",
        accessor: "alimento",
      },
      {
        Header: "Quantidade",
        accessor: "quantidade",
      },
      {
        Header: "Unidade",
        accessor: "unidadeMedida",
      },
      {
        Header: "Validade",
        accessor: "dataValidade",
        Cell: ({ value }) => formatarDataBR(value),
      },
      {
        Header: "Ações",
        accessor: "acoes",
        Cell: ({ row }) => (<>
          <button
            className={styles.btnEditar}
            onClick={() => {
              setMovimentacaoSelecionada(row.original);
              setShow(true);
            }}
          >
            Editar
          </button>
          <Button
            variant="danger"
            className={styles.btnExcluir}
            onClick={() => excluirMovimentacaoSelecionada(row.original)}
          >
            Excluir
          </Button>
        </>
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
        onCancel={(e) => setMovimentacaoSelecionada(null)}
        onSubmit={(e) => {listarMovimentacoes(); setMovimentacaoSelecionada(null)}}
      />
    </div>
  );
}
