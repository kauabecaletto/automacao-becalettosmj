import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import type { RomaneioResultado } from "../types";
import { MetricCard } from "./MetricCard";
import { PieceCard } from "./PieceCard";
import { MissingDrawer } from "./MissingDrawer";

interface Props {
  resultado: RomaneioResultado;
  onVoltar: () => void;
  onNovoRomaneio: () => void;
  onPrepararEnvio: () => void;
}

export function ResultScreen({ resultado, onVoltar, onNovoRomaneio, onPrepararEnvio }: Props) {
  const [gavetaAberta, setGavetaAberta] = useState(false);
  const totalFotos = resultado.comFoto.reduce((s, p) => s + p.fotos.length, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="mx-auto max-w-3xl px-6 pb-28 pt-10"
    >
      {/* Cabeçalho do romaneio */}
      <div className="text-center sm:text-left">
        <p className="font-display text-2xl text-[color:var(--color-ink)]">
          Romaneio #{resultado.numero}
        </p>
        <p className="mt-0.5 text-[15px] text-[color:var(--color-muted)]">
          {resultado.vendedora}
        </p>
      </div>

      {/* Métricas */}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <MetricCard numero={resultado.totalItens} label="Itens" />
        <MetricCard numero={resultado.pecasUnicas} label="Peças únicas" />
        <MetricCard numero={totalFotos} label="Fotos" tom="sucesso" />
        <MetricCard numero={resultado.semFoto.length} label="Sem foto" tom="alerta" />
      </div>

      {/* Fotos encontradas */}
      <section className="mt-10">
        <div className="mb-4 flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--color-success)]" />
          <h2 className="text-[15px] font-medium text-[color:var(--color-ink)]">
            {resultado.comFoto.length} {resultado.comFoto.length === 1 ? "peça" : "peças"} com fotos
            {" · "}
            {totalFotos} {totalFotos === 1 ? "foto disponível" : "fotos disponíveis"}
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {resultado.comFoto.map((peca) => (
            <PieceCard key={peca.codigo} peca={peca} />
          ))}
        </div>
      </section>

      {/* Peças sem foto — resumo compacto */}
      <section className="mt-8">
        <button
          type="button"
          onClick={() => setGavetaAberta(true)}
          className="flex w-full items-center justify-between rounded-2xl border border-[color:var(--color-amber-bg)] bg-[color:var(--color-amber-bg)]/50 px-5 py-4 text-left transition hover:bg-[color:var(--color-amber-bg)]"
        >
          <div>
            <p className="text-[15px] font-medium text-[color:var(--color-ink)]">
              {resultado.semFoto.length} peças sem foto
            </p>
            <p className="text-[13px] text-[color:var(--color-muted)]">
              Ainda não cadastradas no catálogo do Drive
            </p>
          </div>
          <span className="flex items-center gap-1 text-sm font-medium text-[color:var(--color-amber)]">
            Ver peças
            <ChevronRight className="h-4 w-4" />
          </span>
        </button>
      </section>

      <MissingDrawer
        aberta={gavetaAberta}
        pecas={resultado.semFoto}
        onFechar={() => setGavetaAberta(false)}
      />

      {/* Ações */}
      <div className="mt-10 flex flex-col-reverse gap-2.5 sm:flex-row">
        <button
          type="button"
          onClick={onVoltar}
          className="flex-1 rounded-lg border border-[color:var(--color-line)] py-2.5 text-sm font-medium text-[color:var(--color-ink)] transition hover:bg-[color:var(--color-paper-raised)]"
        >
          Voltar
        </button>
        <button
          type="button"
          onClick={onNovoRomaneio}
          className="flex-1 rounded-lg border border-[color:var(--color-line)] py-2.5 text-sm font-medium text-[color:var(--color-ink)] transition hover:bg-[color:var(--color-paper-raised)]"
        >
          Novo romaneio
        </button>
        <button
          type="button"
          onClick={onPrepararEnvio}
          disabled={resultado.comFoto.length === 0}
          className="flex-1 rounded-lg bg-[color:var(--color-brand)] py-2.5 text-sm font-medium text-white transition hover:bg-[color:var(--color-brand-dark)] disabled:cursor-not-allowed disabled:opacity-40"
        >
          Continuar para envio
        </button>
      </div>
    </motion.div>
  );
}
