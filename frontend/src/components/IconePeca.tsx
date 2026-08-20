import type { Categoria } from "../types";

interface Props {
  categoria: Categoria;
  className?: string;
}

// Ícones desenhados à mão (linha fina), um por categoria de peça — evita
// depender de fotos reais nesta versão só-de-front-end com dados mockados.
export function IconePeca({ categoria, className }: Props) {
  const props = {
    className,
    viewBox: "0 0 48 48",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.4,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  switch (categoria) {
    case "anel":
      return (
        <svg {...props}>
          <circle cx="24" cy="28" r="11" />
          <path d="M18 17 L24 8 L30 17 Z" />
          <circle cx="24" cy="14.5" r="2.1" fill="currentColor" stroke="none" />
        </svg>
      );
    case "brinco":
      return (
        <svg {...props}>
          <path d="M24 8 a5 5 0 1 1 -0.01 0" />
          <path d="M24 13 v8" />
          <circle cx="24" cy="27" r="8" />
        </svg>
      );
    case "colar":
      return (
        <svg {...props}>
          <path d="M10 10 C10 26 38 26 38 10" />
          <path d="M24 22 L24 30 L19 37 L29 37 L24 30" />
        </svg>
      );
    case "pulseira":
      return (
        <svg {...props}>
          <ellipse cx="24" cy="24" rx="16" ry="9" />
          <ellipse cx="24" cy="24" rx="10.5" ry="5.5" />
        </svg>
      );
    default:
      return null;
  }
}
