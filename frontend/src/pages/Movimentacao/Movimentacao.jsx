import { useEffect, useState } from "react";
import { buscarMovimentacoes } from "../../api/movimentacao";
import formatarDataBRCHora from "../../utils/formatarDataBRCHora";
import { Button } from "react-bootstrap";
import MovimentacaoModal from "./ModalMovimentacao";

export default function Movimentacao() {
  const [movimentacoes, setMovimentacoes] = useState([]);
  const [show, setShow] = useState(false);
  const [movimentacaoSelecionada, setMovimentacaoSelecionada] = useState({})

  async function listarMovimentacoes() {
    try {
      const response = await buscarMovimentacoes();
      console.log(response)
      setMovimentacoes(response.data);
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    listarMovimentacoes();
  }, []);

  return (
    <div className="conteudo">
      <h3>Movimentações</h3>
      <Button variant="primary"
        onClick={() => { setShow(true); setMovimentacaoSelecionada(null) }}
      >
        Nova movimentação
      </Button>
      {movimentacoes.map((movimentacao, index) => (
        <div className="card-movimentacao" key={index}>
          <Button onClick={(e) => { setMovimentacaoSelecionada(movimentacao); setShow(true) }} >Editar movimentacao</Button>
          {movimentacao.ieMovimentacao === 'E' ? 'Entrada' : 'Saida'}
          <p>Data da movimentação: {formatarDataBRCHora(movimentacao.dtMovimentacao)}</p>
          <p>Campanha {movimentacao?.tituloCampanha}</p>
          <p>Doador {movimentacao?.nomeDoador}</p>
          <p>Donatario {movimentacao?.nomeDonatario}</p>
          {movimentacao.alimentos.map((alimento, i) => (
            <div key={i}>
              <p>Alimento: {alimento.alimento}</p>
              <p>Quantidade: {alimento.quantidade} {alimento.dsUnidadeMedida}</p>
            </div>
          ))}
        </div>
      ))}
      <MovimentacaoModal
        show={show}
        setShow={setShow}
        movimentacaoSelecionada={movimentacaoSelecionada}
        onCancel={(e) => setMovimentacaoSelecionada({})}
        onMovimentacaoAtualizada={(e) => listarMovimentacoes()}
      />
    </div>
  );

}
