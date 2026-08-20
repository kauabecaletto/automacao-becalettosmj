import { useRef, useState } from "react";
import { FileText, UploadCloud } from "lucide-react";

interface Props {
  onArquivoSelecionado: (nomeArquivo: string) => void;
}

export function Dropzone({ onArquivoSelecionado }: Props) {
  const [arrastando, setArrastando] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function tratarArquivos(arquivos: FileList | null) {
    const arquivo = arquivos?.[0];
    if (!arquivo) return;
    onArquivoSelecionado(arquivo.name);
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => inputRef.current?.click()}
      onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
      onDragOver={(e) => {
        e.preventDefault();
        setArrastando(true);
      }}
      onDragLeave={() => setArrastando(false)}
      onDrop={(e) => {
        e.preventDefault();
        setArrastando(false);
        tratarArquivos(e.dataTransfer.files);
      }}
      className={`group flex cursor-pointer flex-col items-center gap-4 rounded-2xl border-[1.5px] border-dashed px-8 py-14 text-center transition-all duration-200 ${
        arrastando
          ? "scale-[1.01] border-[color:var(--color-brand)] bg-[color:var(--color-brand-tint)]"
          : "border-[color:var(--color-line)] bg-[color:var(--color-paper-raised)] hover:border-[color:var(--color-brand)]/50 hover:bg-[color:var(--color-brand-tint)]/40"
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        className="hidden"
        onChange={(e) => tratarArquivos(e.target.files)}
      />

      <div
        className={`flex h-14 w-14 items-center justify-center rounded-full border transition-colors ${
          arrastando
            ? "border-[color:var(--color-brand)] text-[color:var(--color-brand)]"
            : "border-[color:var(--color-line)] text-[color:var(--color-muted)] group-hover:text-[color:var(--color-brand)]"
        }`}
      >
        {arrastando ? <UploadCloud className="h-6 w-6" /> : <FileText className="h-6 w-6" />}
      </div>

      <div>
        <p className="font-medium text-[color:var(--color-ink)]">Arraste o romaneio aqui</p>
        <p className="mt-0.5 text-sm text-[color:var(--color-muted)]">ou</p>
      </div>

      <span className="rounded-full border border-[color:var(--color-line)] bg-[color:var(--color-paper-raised)] px-5 py-2 text-sm font-medium text-[color:var(--color-ink)] shadow-sm transition group-hover:border-[color:var(--color-brand)] group-hover:text-[color:var(--color-brand)]">
        Selecionar romaneio
      </span>

      <p className="text-xs text-[color:var(--color-muted)]">PDF até 10 MB</p>
    </div>
  );
}
