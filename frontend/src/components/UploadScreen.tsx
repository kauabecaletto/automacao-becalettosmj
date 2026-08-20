import { motion } from "framer-motion";
import { Dropzone } from "./Dropzone";

interface Props {
  onArquivoSelecionado: (nomeArquivo: string) => void;
}

export function UploadScreen({ onArquivoSelecionado }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="mx-auto max-w-xl px-6 pb-24 pt-16 text-center sm:pt-24"
    >
      <p className="font-display text-[2rem] leading-tight text-[color:var(--color-ink)] sm:text-[2.35rem]">
        Envie o romaneio da sua maleta
      </p>
      <p className="mx-auto mt-3 max-w-sm text-[15px] leading-relaxed text-[color:var(--color-muted)]">
        Faça o upload do PDF para conferir as peças e preparar o envio das
        fotos.
      </p>

      <div className="mt-10">
        <Dropzone onArquivoSelecionado={onArquivoSelecionado} />
      </div>
    </motion.div>
  );
}
