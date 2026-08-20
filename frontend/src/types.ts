// Tipos do domínio. Modelados para bater com o formato que o backend
// Python (services/romaneio_service.py + analysis_service.py) já produz,
// para que a troca do mock pela API real exija o mínimo de mudanças aqui.

export type Categoria = "anel" | "brinco" | "colar" | "pulseira";

export interface FotoMock {
  id: string;
  nomeArquivo: string;
}

export interface PecaComFoto {
  codigo: string;
  descricao: string;
  categoria: Categoria;
  quantidade: number;
  fotos: FotoMock[];
}

export interface PecaSemFoto {
  codigo: string;
  descricao: string;
  categoria: Categoria;
  quantidade: number;
}

export interface RomaneioResultado {
  numero: string;
  vendedora: string;
  totalItens: number;
  pecasUnicas: number;
  comFoto: PecaComFoto[];
  semFoto: PecaSemFoto[];
}

export type Etapa = "upload" | "processando" | "resultado";

export interface EtapaProcessamento {
  id: string;
  label: string;
}
