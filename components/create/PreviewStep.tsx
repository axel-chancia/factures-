'use client';

import { useState, useRef } from 'react';
import { useDocumentStore } from '@/store/useDocumentStore';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Download, RefreshCw, Calendar, Hash } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { formatCFA } from '@/lib/currency';

export default function PreviewStep() {
  const { currentSession, saveDocument, clearSession } = useDocumentStore();
  const router = useRouter();
  const [isGenerating, setIsGenerating] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  if (!currentSession || !currentSession.type) {
    return (
      <div className="text-center text-slate-600">
        Erreur: Session incomplète
      </div>
    );
  }

  const generatePDF = async () => {
    setIsGenerating(true);
    try {
      // Import dynamique pour éviter l'erreur "self is not defined" côté serveur
      const html2pdf = (await import('html2pdf.js')).default;
      const document = saveDocument();
      if (previewRef.current && html2pdf) {
        await html2pdf()
          .set({
            margin: 0,
            filename: `${document.documentNumber}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: 'pt', format: 'a4', orientation: 'portrait' }
          })
          .from(previewRef.current)
          .save();
        toast.success('Document PDF généré avec succès !');
      } else {
        toast.error('Le générateur de PDF n\'est pas prêt. Veuillez réessayer.');
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Erreur lors de la génération du PDF');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRestart = () => {
    clearSession();
    router.push('/');
  };

  const totalAmount = currentSession.products.reduce((sum, product) => sum + product.total, 0);
  const currentDate = new Date().toLocaleDateString('fr-FR');
  const docNumber = currentSession.documentNumber || `${currentSession.type?.toUpperCase()}-${Date.now().toString().slice(-6)}`;

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-lg font-semibold text-slate-900 mb-2">
          Aperçu de votre document
        </h3>
        <p className="text-slate-600">
          Vérifiez les informations avant de générer le PDF final
        </p>
      </div>

      {/* Document Preview */}
      <motion.div
        ref={previewRef}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border-2 border-slate-200 rounded-lg p-8 shadow-lg"
        style={{ background: "#fff" }}
      >
        {/* Document Header */}
        <div className="text-center mb-8 pb-6" style={{ borderBottom: `3px solid ${currentSession.themeColor}` }}>
          {currentSession.clientInfo.logo && (
            <img
              src={currentSession.clientInfo.logo}
              alt="Logo"
              className="max-w-32 max-h-16 mx-auto mb-4 object-contain"
            />
          )}

          <h1 className="text-3xl font-bold mb-2" style={{ color: currentSession.themeColor }}>
            {currentSession.type?.toUpperCase()}
          </h1>

          <div className="flex items-center justify-center gap-4 text-sm text-slate-600">
            <div className="flex items-center gap-1">
              <Hash className="h-4 w-4" />
              <span>N° {docNumber}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{currentDate}</span>
            </div>
          </div>
        </div>

        {/* Client Information */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <Card className="bg-slate-50 border-slate-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Informations du client</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="font-semibold text-slate-900">
                {currentSession.clientInfo.firstName} {currentSession.clientInfo.lastName}
              </div>

              {currentSession.clientInfo.companyName && (
                <div className="text-slate-700">{currentSession.clientInfo.companyName}</div>
              )}

              {currentSession.clientInfo.email && (
                <div className="text-slate-600">Adresse électronique : {currentSession.clientInfo.email}</div>
              )}

              <div className="text-slate-600">Tél : {currentSession.clientInfo.phone}</div>

              {currentSession.clientInfo.address && (
                <div className="text-slate-600">{currentSession.clientInfo.address}</div>
              )}
            </CardContent>
          </Card>

          <div className="flex flex-col justify-end items-end text-right">
            <div className="mb-2">
              <span className="font-semibold">Date:</span> {currentDate}
            </div>
            <div>
              <span className="font-semibold">Document N. :</span> {docNumber}
            </div>
          </div>
        </div>

        {/* Products List */}
        <div className="mb-8">
          <table className="w-full border-collapse border border-slate-300">
            <thead>
              <tr style={{ backgroundColor: currentSession.themeColor }}>
                <th className="border border-slate-300 p-3 text-left text-white">Produit/service</th>
                <th className="border border-slate-300 p-3 text-left text-white">Description</th>
                <th className="border border-slate-300 p-3 text-center text-white">Quantité</th>
                <th className="border border-slate-300 p-3 text-right text-white">Prix unitaire</th>
                <th className="border border-slate-300 p-3 text-right text-white">Total</th>
              </tr>
            </thead>
            <tbody>
              {currentSession.products.map((product) => (
                <tr key={product.id} className="hover:bg-slate-50">
                  <td className="border border-slate-300 p-3 font-medium">{product.name}</td>
                  <td className="border border-slate-300 p-3 text-slate-600">{product.description}</td>
                  <td className="border border-slate-300 p-3 text-center">
                    {product.pricingMode === 'unitaire'
                      ? `${product.kilos ?? 0} kg`
                      : `${(product.cartons ?? 0) > 0 ? product.cartons + ' carton(s)' : ''}${(product.cartons ?? 0) > 0 && (product.sacs ?? 0) > 0 ? ' + ' : ''}${(product.sacs ?? 0) > 0 ? product.sacs + ' sac(s)' : ''}`
                    }
                  </td>
                  <td className="border border-slate-300 p-3 text-right">
                    {product.pricingMode === 'unitaire'
                      ? formatCFA(product.unitPrice ?? 0)
                      : formatCFA(product.pricePerPackage ?? 0)
                    }
                  </td>
                  <td className="border border-slate-300 p-3 text-right font-semibold">
                    {formatCFA(product.total)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Separator />

        {/* Total */}
        <div className="text-right mt-6">
          <div className="text-2xl font-bold" style={{ color: currentSession.themeColor }}>
            TOTAL : {formatCFA(totalAmount)}
          </div>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4">
        <Button
          onClick={generatePDF}
          disabled={isGenerating}
          className="flex items-center gap-2 px-8 py-3 text-lg font-semibold"
          style={{ backgroundColor: currentSession.themeColor }}
        >
          {isGenerating ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Génération...
            </>
          ) : (
            <>
              <Download className="h-5 w-5" />
              Télécharger PDF
            </>
          )}
        </Button>

        <Button
          variant="outline"
          onClick={handleRestart}
          disabled={isGenerating}
          className="flex items-center gap-2 px-6 py-3"
        >
          <RefreshCw className="h-4 w-4" />
          Recommencer
        </Button>
      </div>
    </div>
  );
}