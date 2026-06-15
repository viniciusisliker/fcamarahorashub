import { Suspense } from "react";
import { ColaboradoresPageContent } from "./colaboradores-content";
import ColaboradoresLoading from "./loading";

export default function ColaboradoresPage() {
  return (
    <Suspense fallback={<ColaboradoresLoading />}>
      <ColaboradoresPageContent />
    </Suspense>
  );
}
