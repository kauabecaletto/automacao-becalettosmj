interface Props {
  numero: number;
  label: string;
  tom?: "neutro" | "sucesso" | "alerta";
}

const TONS = {
  neutro: "text-[color:var(--color-ink)]",
  sucesso: "text-[color:var(--color-success)]",
  alerta: "text-[color:var(--color-amber)]",
};

export function MetricCard({ numero, label, tom = "neutro" }: Props) {
  return (
    <div className="rounded-2xl border border-[color:var(--color-line)] bg-[color:var(--color-paper-raised)] px-4 py-4 text-center">
      <div className={`font-display text-2xl ${TONS[tom]}`}>{numero}</div>
      <div className="mt-0.5 text-[13px] text-[color:var(--color-muted)]">{label}</div>
    </div>
  );
}
