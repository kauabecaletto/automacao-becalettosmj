import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import type { PecaSemFoto } from "../types";
import { TagChip } from "./TagChip";

interface Props {
  aberta: boolean;
  pecas: PecaSemFoto[];
  onFechar: () => void;
}

export function MissingDrawer({ aberta, pecas, onFechar }: Props) {
  return (
    <AnimatePresence>
      {aberta && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onFechar}
            className="fixed inset-0 z-40 bg-[color:var(--color-ink)]/25 backdrop-blur-[2px]"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-sm flex-col bg-[color:var(--color-paper)] shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-[color:var(--color-line)] px-5 py-4">
              <div>
                <p className="font-display text-lg text-[color:var(--color-ink)]">
                  Peças sem foto
                </p>
                <p className="text-[13px] text-[color:var(--color-muted)]">
                  {pecas.length} peças aguardando cadastro de foto
                </p>
              </div>
              <button
                type="button"
                onClick={onFechar}
                className="rounded-full p-1.5 text-[color:var(--color-muted)] transition hover:bg-[color:var(--color-line)]/60 hover:text-[color:var(--color-ink)]"
                aria-label="Fechar"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            <div className="grid flex-1 grid-cols-2 gap-2 overflow-y-auto px-5 py-4">
              {pecas.map((peca) => (
                <TagChip key={peca.codigo} peca={peca} />
              ))}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
