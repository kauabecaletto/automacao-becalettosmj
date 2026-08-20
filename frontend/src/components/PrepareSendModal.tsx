import { AnimatePresence, motion } from "framer-motion";
import type { PecaComFoto } from "../types";

interface Props {
  aberto: boolean;
  vendedora: string;
  pecas: PecaComFoto[];
  onConfirmar: () => void;
  onVoltar: () => void;
}

export function PrepareSendModal({ aberto, vendedora, pecas, onConfirmar, onVoltar }: Props) {
  const totalFotos = pecas.reduce((soma, p) => soma + p.fotos.length, 0);

  return (
    <AnimatePresence>
      {aberto && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onVoltar}
            className="fixed inset-0 z-40 bg-[color:var(--color-ink)]/30 backdrop-blur-[2px]"
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center px-5">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 4 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="w-full max-w-sm rounded-2xl border border-[color:var(--color-line)] bg-[color:var(--color-paper-raised)] p-6 shadow-xl"
            >
              <p className="font-display text-xl text-[color:var(--color-ink)]">
                Pronto para envio
              </p>
              <p className="mt-1.5 text-sm text-[color:var(--color-muted)]">
                Revendedora: {vendedora}
              </p>

              <div className="mt-4 flex gap-2.5">
                <div className="flex-1 rounded-xl border border-[color:var(--color-line)] bg-[color:var(--color-paper)] py-3 text-center">
                  <div className="font-display text-lg text-[color:var(--color-ink)]">
                    {pecas.length}
                  </div>
                  <div className="text-[12px] text-[color:var(--color-muted)]">
                    {pecas.length === 1 ? "peça" : "peças"}
                  </div>
                </div>
                <div className="flex-1 rounded-xl border border-[color:var(--color-line)] bg-[color:var(--color-paper)] py-3 text-center">
                  <div className="font-display text-lg text-[color:var(--color-ink)]">
                    {totalFotos}
                  </div>
                  <div className="text-[12px] text-[color:var(--color-muted)]">
                    {totalFotos === 1 ? "foto" : "fotos"}
                  </div>
                </div>
              </div>

              <ul className="mt-4 space-y-1.5 rounded-xl border border-[color:var(--color-line)] bg-[color:var(--color-paper)] px-4 py-3">
                {pecas.map((peca) => (
                  <li
                    key={peca.codigo}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="tag-code text-[color:var(--color-ink)]">
                      {peca.codigo}
                    </span>
                    <span className="text-[color:var(--color-muted)]">
                      {peca.fotos.length === 1 ? "1 foto" : `${peca.fotos.length} fotos`}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-6 flex gap-2.5">
                <button
                  type="button"
                  onClick={onVoltar}
                  className="flex-1 rounded-lg border border-[color:var(--color-line)] py-2.5 text-sm font-medium text-[color:var(--color-ink)] transition hover:bg-[color:var(--color-paper)]"
                >
                  Voltar
                </button>
                <button
                  type="button"
                  onClick={onConfirmar}
                  className="flex-1 rounded-lg bg-[color:var(--color-brand)] py-2.5 text-sm font-medium text-white transition hover:bg-[color:var(--color-brand-dark)]"
                >
                  Confirmar envio
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
