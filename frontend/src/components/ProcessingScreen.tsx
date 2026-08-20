import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Check, Loader2 } from "lucide-react";
import { ETAPAS_PROCESSAMENTO } from "../data/mockData";

interface Props {
  nomeArquivo: string;
  onConcluido: () => void;
}

export function ProcessingScreen({ nomeArquivo, onConcluido }: Props) {
  const [indiceAtual, setIndiceAtual] = useState(0);

  useEffect(() => {
    if (indiceAtual >= ETAPAS_PROCESSAMENTO.length) {
      const timeout = setTimeout(onConcluido, 450);
      return () => clearTimeout(timeout);
    }

    const timeout = setTimeout(() => setIndiceAtual((i) => i + 1), 620);
    return () => clearTimeout(timeout);
  }, [indiceAtual, onConcluido]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="mx-auto max-w-md px-6 pb-24 pt-20 text-center sm:pt-28"
    >
      <p className="font-display text-2xl text-[color:var(--color-ink)]">
        Analisando romaneio…
      </p>
      <p className="mt-2 truncate text-sm text-[color:var(--color-muted)]">
        {nomeArquivo}
      </p>

      <ul className="mt-10 space-y-3 text-left">
        {ETAPAS_PROCESSAMENTO.map((etapa, i) => {
          const concluida = i < indiceAtual;
          const ativa = i === indiceAtual;

          return (
            <li
              key={etapa.id}
              className={`flex items-center gap-3 rounded-xl border px-4 py-3 transition-colors duration-300 ${
                concluida
                  ? "border-[color:var(--color-success-bg)] bg-[color:var(--color-success-bg)]"
                  : ativa
                    ? "border-[color:var(--color-brand)]/30 bg-[color:var(--color-brand-tint)]"
                    : "border-[color:var(--color-line)] bg-[color:var(--color-paper-raised)]"
              }`}
            >
              <span
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs ${
                  concluida
                    ? "bg-[color:var(--color-success)] text-white"
                    : ativa
                      ? "text-[color:var(--color-brand)]"
                      : "border border-[color:var(--color-line)] text-transparent"
                }`}
              >
                {concluida ? (
                  <Check className="h-3.5 w-3.5" strokeWidth={3} />
                ) : ativa ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "•"
                )}
              </span>
              <span
                className={`text-sm ${
                  concluida
                    ? "text-[color:var(--color-success)]"
                    : ativa
                      ? "font-medium text-[color:var(--color-ink)]"
                      : "text-[color:var(--color-muted)]"
                }`}
              >
                {etapa.label}
              </span>
            </li>
          );
        })}
      </ul>
    </motion.div>
  );
}
