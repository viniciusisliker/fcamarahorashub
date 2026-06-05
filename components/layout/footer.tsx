const usingMock = process.env.NEXT_PUBLIC_USE_MOCK_DATA !== "false";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-[var(--fcamara-dark)] px-4 py-4 text-center text-xs text-white/70 lg:px-6">
      <p>
        FTimeHub · v0.1.0
      </p>
      <p className="mt-1 text-white/50">
        © FTimeHub —{" "}
        {usingMock
          ? "dados mockados para demonstração"
          : "dados em tempo real via Supabase"}
      </p>
    </footer>
  );
}
