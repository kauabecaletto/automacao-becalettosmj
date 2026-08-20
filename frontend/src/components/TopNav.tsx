const LINKS = ["Dashboard", "Novo romaneio"];

export function TopNav() {
  return (
    <header className="sticky top-0 z-30 border-b border-[color:var(--color-line)]/80 bg-[color:var(--color-paper)]/85 backdrop-blur">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
        <div className="flex items-baseline gap-2.5">
          <span className="font-display text-[1.05rem] font-semibold tracking-[0.14em] text-[color:var(--color-brand)]">
            BECALETTO
          </span>
          <span className="hidden text-sm text-[color:var(--color-muted)] sm:inline">
            Gestão de maletas
          </span>
        </div>

        <nav className="flex items-center gap-5 text-sm">
          {LINKS.map((link, i) => (
            <button
              key={link}
              type="button"
              className={
                i === 0
                  ? "font-medium text-[color:var(--color-ink)]"
                  : "text-[color:var(--color-muted)] transition hover:text-[color:var(--color-ink)]"
              }
            >
              {link}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}
