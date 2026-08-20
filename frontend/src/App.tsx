import { AnimatePresence } from "framer-motion";
import { TopNav } from "./components/TopNav";
import { UploadScreen } from "./components/UploadScreen";
import { ProcessingScreen } from "./components/ProcessingScreen";
import { ResultScreen } from "./components/ResultScreen";
import { PrepareSendModal } from "./components/PrepareSendModal";
import { SendConfirmedScreen } from "./components/SendConfirmedScreen";
import { useRomaneioFlow } from "./hooks/useRomaneioFlow";

export default function App() {
  const {
    etapa,
    nomeArquivo,
    resultado,
    modalEnvioAberto,
    envioConfirmado,
    selecionarArquivo,
    concluirProcessamento,
    abrirModalEnvio,
    fecharModalEnvio,
    confirmarEnvio,
    reiniciar,
  } = useRomaneioFlow();

  return (
    <div className="min-h-screen">
      <TopNav />

      <main>
        <AnimatePresence mode="wait">
          {etapa === "upload" && (
            <UploadScreen key="upload" onArquivoSelecionado={selecionarArquivo} />
          )}

          {etapa === "processando" && (
            <ProcessingScreen
              key="processando"
              nomeArquivo={nomeArquivo}
              onConcluido={concluirProcessamento}
            />
          )}

          {etapa === "resultado" && resultado && !envioConfirmado && (
            <ResultScreen
              key="resultado"
              resultado={resultado}
              onVoltar={reiniciar}
              onNovoRomaneio={reiniciar}
              onPrepararEnvio={abrirModalEnvio}
            />
          )}

          {envioConfirmado && resultado && (
            <SendConfirmedScreen
              key="confirmado"
              resultado={resultado}
              onNovoRomaneio={reiniciar}
            />
          )}
        </AnimatePresence>
      </main>

      {resultado && (
        <PrepareSendModal
          aberto={modalEnvioAberto}
          vendedora={resultado.vendedora}
          pecas={resultado.comFoto}
          onConfirmar={confirmarEnvio}
          onVoltar={fecharModalEnvio}
        />
      )}
    </div>
  );
}
