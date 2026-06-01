import { Suspense } from "react";
import { ApontamentosPageContent } from "./apontamentos-content";
import ApontamentosLoading from "./loading";

export default function ApontamentosPage() {
  return (
    <Suspense fallback={<ApontamentosLoading />}>
      <ApontamentosPageContent />
    </Suspense>
  );
}
