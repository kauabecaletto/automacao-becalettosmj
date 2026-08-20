import type { Categoria, PecaComFoto, PecaSemFoto, RomaneioResultado } from "../types";

// ---------------------------------------------------------------------
// Peças COM foto — baseado no exemplo real informado por Kauã.
// ---------------------------------------------------------------------
const PECAS_COM_FOTO: PecaComFoto[] = [
  {
    codigo: "919",
    descricao: "Anel Solitário Zircônia",
    categoria: "anel",
    quantidade: 1,
    fotos: [{ id: "f-919", nomeArquivo: "919" }],
  },
  {
    codigo: "1545",
    descricao: "Brinco Argola Orgânica",
    categoria: "brinco",
    quantidade: 1,
    fotos: [
      { id: "f-1545-0", nomeArquivo: "1545" },
      { id: "f-1545-1", nomeArquivo: "1545_1" },
    ],
  },
  {
    codigo: "2238",
    descricao: "Colar Ponto de Luz",
    categoria: "colar",
    quantidade: 1,
    fotos: [{ id: "f-2238", nomeArquivo: "2238" }],
  },
  {
    codigo: "2828",
    descricao: "Pulseira Elos Finos",
    categoria: "pulseira",
    quantidade: 2,
    fotos: [{ id: "f-2828", nomeArquivo: "2828" }],
  },
];

// ---------------------------------------------------------------------
// Peças SEM foto — geradas a partir de uma amostra realista de códigos
// e descrições, até completar as 75 peças do exemplo real.
// ---------------------------------------------------------------------
const CODIGOS_SEM_FOTO_BASE = [
  1921, 2502, 2768, 2829, 3056, 3107, 3160, 3244, 3318, 3402,
];

const DESCRICOES_POR_CATEGORIA: Record<Categoria, string[]> = {
  anel: ["Anel Aro Duplo", "Anel Cravejado", "Anel Torcido", "Anel Infinito"],
  brinco: ["Brinco Ear Cuff", "Brinco Gota", "Brinco Botão Perolado", "Brinco Argola Lisa"],
  colar: ["Colar Corrente Cartier", "Colar Choker", "Colar Pingente Coração", "Colar Camadas"],
  pulseira: ["Pulseira Berloques", "Pulseira Riviera", "Pulseira Corrente Grumet", "Pulseira Veneziana"],
};

const CATEGORIAS: Categoria[] = ["anel", "brinco", "colar", "pulseira"];

function gerarPecasSemFoto(quantidade: number): PecaSemFoto[] {
  const pecas: PecaSemFoto[] = [];

  for (let i = 0; i < quantidade; i++) {
    const categoria = CATEGORIAS[i % CATEGORIAS.length];
    const descricoes = DESCRICOES_POR_CATEGORIA[categoria];
    const codigoBase =
      CODIGOS_SEM_FOTO_BASE[i % CODIGOS_SEM_FOTO_BASE.length] + Math.floor(i / CODIGOS_SEM_FOTO_BASE.length) * 37;

    pecas.push({
      codigo: String(codigoBase),
      descricao: descricoes[i % descricoes.length],
      categoria,
      quantidade: i % 7 === 0 ? 2 : 1,
    });
  }

  return pecas;
}

const PECAS_SEM_FOTO: PecaSemFoto[] = gerarPecasSemFoto(75);

export const MOCK_RESULTADO: RomaneioResultado = {
  numero: "1815",
  vendedora: "Thais Francielly Martins",
  totalItens: 80,
  pecasUnicas: 79,
  comFoto: PECAS_COM_FOTO,
  semFoto: PECAS_SEM_FOTO,
};

export const ETAPAS_PROCESSAMENTO = [
  { id: "recebido", label: "Arquivo recebido" },
  { id: "identificando", label: "Identificando peças" },
  { id: "catalogo", label: "Consultando catálogo de fotos" },
  { id: "preparando", label: "Preparando conferência" },
];

/**
 * Simula a chamada ao backend (leitura do PDF + cruzamento com o Drive).
 * Quando o backend estiver pronto, troque o corpo desta função por uma
 * chamada real de API — a assinatura pode permanecer a mesma.
 */
export function mockAnalisarRomaneio(atrasoMs = 300): Promise<RomaneioResultado> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(MOCK_RESULTADO), atrasoMs);
  });
}
