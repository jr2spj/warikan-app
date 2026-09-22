import type { Metadata } from "next";
import { LegalDocumentPage } from "@/components/legal/LegalDocumentPage";
import { LEGAL_PANELS } from "@/lib/legal";

export const metadata: Metadata = {
  title: `${LEGAL_PANELS.calculation.title} | Warikan`,
  description: LEGAL_PANELS.calculation.lead,
};

export default function CalculationPage() {
  return <LegalDocumentPage panel="calculation" />;
}
