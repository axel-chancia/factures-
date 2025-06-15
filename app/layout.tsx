import "./globals.css";
import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";


export const metadata: Metadata = {
  title: "Factures+ - Générateur de documents commerciaux",
  description: "Créez facilement vos factures, devis et proformas personnalisés. Interface moderne, export PDF, aucune inscription requise.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
        <body>
          {children}
          <Toaster position="top-right" richColors />
        </body>
    </html>
  );
}