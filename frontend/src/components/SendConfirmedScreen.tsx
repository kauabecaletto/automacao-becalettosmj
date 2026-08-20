import { motion } from "framer-motion";
import type { RomaneioResultado } from "../types";

interface Props {
  resultado: RomaneioResultado;
  onNovoRomaneio: () => void;
}

export function SendConfirmedScreen({ resultado, onNovoRomaneio }: Props) {
  const totalFotos = resultado.comFoto.reduce((soma, p) => soma + p.fotos.length, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mx-auto max-w-md px-6 pb-24 pt-20 text-center sm:pt-28"
    >
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[color:var(--color-success-bg)]">
        <svg viewBox="0 0 24 24" className="h-7 w-7 text-[color:var(--color-success)]" fill="none">
          <motion.path
            d="M5 12.5 L10 17.5 L19 7"
            stroke="currentColor"
            strokeWidth={2.4}
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
          />
        </svg>
      </div>

      <p className="mt-5 font-display text-2xl text-[color:var(--color-ink)]">
        Envio preparado
      </p>
      <p className="mt-2 text-[15px] text-[color:var(--color-muted)]">
        {totalFotos} fotos estão prontas para serem enviadas para{" "}
        {resultado.vendedora}.
      </p>

      <p className="mx-auto mt-3 max-w-[22rem] text-xs text-[color:var(--color-muted)]">
        O envio pelo WhatsApp ainda não está disponível nesta versão — esta
        etapa é apenas uma simulação.
      </p>

      <button
        type="button"
        onClick={onNovoRomaneio}
        className="mt-8 rounded-lg border border-[color:var(--color-line)] px-5 py-2.5 text-sm font-medium text-[color:var(--color-ink)] transition hover:bg-[color:var(--color-paper-raised)]"
      >
        Novo romaneio
      </button>
    </motion.div>
  );
}
