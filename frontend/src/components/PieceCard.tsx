import type { PecaComFoto } from "../types";
import { FotoPeca } from "./FotoPeca";

interface Props {
  peca: PecaComFoto;
}

export function PieceCard({ peca }: Props) {
  const outrasFotos = peca.fotos.slice(1);
  const rotuloFotos = peca.fotos.length === 1 ? "1 foto" : `${peca.fotos.length} fotos`;
  const rotuloQtd = peca.quantidade === 1 ? "1 unidade" : `${peca.quantidade} unidades`;

  return (
    <div className="tag-card px-5 pb-5 pt-6">
      {/* Foto principal maior + thumbnails das demais (2ª, 3ª...) */}
      <FotoPeca categoria={peca.categoria} codigo={peca.codigo} />

      {outrasFotos.length > 0 && (
        <div className="mt-2 flex gap-2">
          {outrasFotos.map((foto) => (
            <FotoPeca
              key={foto.id}
              categoria={peca.categoria}
              codigo={peca.codigo}
              className="w-1/4 shrink-0 ring-1 ring-inset ring-[color:var(--color-line)]"
            />
          ))}
        </div>
      )}

      <hr className="tag-divider my-4" />

      <div className="tag-code text-[13px] uppercase tracking-wide text-[color:var(--color-brand)]">
        {peca.codigo}
      </div>
      <div className="mt-0.5 text-[15px] font-medium text-[color:var(--color-ink)]">
        {peca.descricao}
      </div>
      <div className="mt-1 text-[13px] text-[color:var(--color-muted)]">
        {rotuloQtd} · {rotuloFotos}
      </div>
    </div>
  );
}
