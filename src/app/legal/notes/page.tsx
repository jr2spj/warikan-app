import type { Metadata } from "next";
import { LegalDocumentPage } from "@/components/legal/LegalDocumentPage";
import { LEGAL_PANELS } from "@/lib/legal";

export const metadata: Metadata = {
  title: `${LEGAL_PANELS.notes.title} | Warikan`,
  description: LEGAL_PANELS.notes.lead,
};

export default function NotesPage() {
  return <LegalDocumentPage panel="notes" />;
}
