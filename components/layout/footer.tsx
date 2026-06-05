const usingMock = process.env.NEXT_PUBLIC_USE_MOCK_DATA !== "false";

export function Footer() {
  return (
    <footer className="border-t border-border/60 bg-white/40 px-4 py-5 text-center backdrop-blur-sm lg:px-8">
      <p className="text-xs font-medium text-foreground/80">FTimeSheetHub · v0.2.0</p>
      <p className="mt-1 text-[11px] text-muted-foreground">
        {usingMock
          ? "Modo demonstração — dados simulados"
          : "Dados sincronizados em tempo real"}
      </p>
    </footer>
  );
}
