import { IconePeca } from "./IconePeca";
import type { Categoria } from "../types";

interface Props {
  categoria: Categoria;
  codigo: string;
  className?: string;
}

// Pequena variação tonal por código, só para os cards não ficarem
// todos idênticos — puramente decorativo, sem significado de dados.
const GRADIENTES = [
  "from-[#efe2d3] to-[#e2cdb4]",
  "from-[#f1e4da] to-[#e7cbc2]",
  "from-[#ece1cf] to-[#d9c6a4]",
  "from-[#f0e6dd] to-[#dccbc0]",
];

function indiceParaCodigo(codigo: string) {
  let soma = 0;
  for (const char of codigo) soma += char.charCodeAt(0);
  return soma % GRADIENTES.length;
}

export function FotoPeca({ categoria, codigo, className = "" }: Props) {
  const gradiente = GRADIENTES[indiceParaCodigo(codigo)];

  return (
    <div
      className={`relative flex aspect-square items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br ${gradiente} ${className}`}
    >
      <IconePeca categoria={categoria} className="h-[42%] w-[42%] text-[color:var(--color-brand)] opacity-70" />
    </div>
  );
}
