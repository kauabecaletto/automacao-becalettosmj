import { useCallback, useState } from "react";
import { mockAnalisarRomaneio } from "../data/mockData";
import type { Etapa, RomaneioResultado } from "../types";

export function useRomaneioFlow() {
  const [etapa, setEtapa] = useState<Etapa>("upload");
  const [nomeArquivo, setNomeArquivo] = useState<string>("");
  const [resultado, setResultado] = useState<RomaneioResultado | null>(null);
  const [modalEnvioAberto, setModalEnvioAberto] = useState(false);
  const [envioConfirmado, setEnvioConfirmado] = useState(false);

  const selecionarArquivo = useCallback((arquivo: string) => {
    setNomeArquivo(arquivo);
    setEtapa("processando");
  }, []);

  const concluirProcessamento = useCallback(() => {
    // O checklist da tela de processamento já dá a sensação de espera;
    // a "chamada" mockada só entrega o resultado ao final dela.
    // Troque por uma chamada real (ex.: analisarRomaneio(arquivo)) quando
    // o backend estiver conectado — o restante do fluxo não muda.
    mockAnalisarRomaneio(0).then((dados) => {
      setResultado(dados);
      setEtapa("resultado");
    });
  }, []);

  const reiniciar = useCallback(() => {
    setEtapa("upload");
    setNomeArquivo("");
    setResultado(null);
    setModalEnvioAberto(false);
    setEnvioConfirmado(false);
  }, []);

  return {
    etapa,
    nomeArquivo,
    resultado,
    modalEnvioAberto,
    envioConfirmado,
    selecionarArquivo,
    concluirProcessamento,
    abrirModalEnvio: () => setModalEnvioAberto(true),
    fecharModalEnvio: () => setModalEnvioAberto(false),
    confirmarEnvio: () => {
      setModalEnvioAberto(false);
      setEnvioConfirmado(true);
    },
    reiniciar,
  };
}
