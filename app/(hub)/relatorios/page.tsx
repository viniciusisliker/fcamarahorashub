import { Suspense } from "react";
import { RelatoriosPageContent } from "./relatorios-content";
import RelatoriosLoading from "./loading";

export default function RelatoriosPage() {
  return (
    <Suspense fallback={<RelatoriosLoading />}>
      <RelatoriosPageContent />
    </Suspense>
  );
}
