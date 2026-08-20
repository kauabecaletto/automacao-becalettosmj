import type { PecaSemFoto } from "../types";

interface Props {
  peca: PecaSemFoto;
}

export function TagChip({ peca }: Props) {
  return (
    <div className="rounded-lg border border-[color:var(--color-amber-bg)] bg-[color:var(--color-amber-bg)]/60 px-3 py-2">
      <div className="tag-code text-[12.5px] font-medium text-[color:var(--color-amber)]">
        {peca.codigo}
      </div>
      <div className="truncate text-[12px] text-[color:var(--color-ink-soft)]">
        {peca.descricao}
      </div>
    </div>
  );
}
