'use client';

import { DocumentType } from '@/types';
import { useDocumentStore } from '@/store/useDocumentStore';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, Calculator, Receipt, File } from 'lucide-react';
import { motion } from 'framer-motion';

const DOCUMENT_TYPES = [
  {
    type: 'facture' as DocumentType,
    title: 'Facture',
    description: 'Document de facturation après prestation',
    icon: Receipt,
    color: '#10b981'
  },
  {
    type: 'devis' as DocumentType,
    title: 'Devis',
    description: 'Estimation de prix avant prestation',
    icon: Calculator,
    color: '#3b82f6'
  },
  {
    type: 'proforma' as DocumentType,
    title: 'Proforma',
    description: 'Facture provisoire ou préliminaire',
    icon: FileText,
    color: '#f59e0b'
  },
  {
    type: 'autre' as DocumentType,
    title: 'Autre',
    description: 'Document commercial personnalisé',
    icon: File,
    color: '#8b5cf6'
  }
];

export default function DocumentTypeStep() {
  const { currentSession, updateSessionType } = useDocumentStore();

  const handleTypeSelect = (type: DocumentType) => {
    console.log('Selecting document type:', type);
    updateSessionType(type);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-lg font-semibold text-slate-900 mb-2">
          Quel type de document souhaitez-vous créer ?
        </h3>
        <p className="text-slate-600">
          Sélectionnez le type de document qui correspond à vos besoins
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {DOCUMENT_TYPES.map((docType, index) => (
          <motion.div
            key={docType.type}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card
              className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                currentSession?.type === docType.type
                  ? 'ring-2 ring-offset-2 shadow-lg'
                  : 'hover:shadow-md'
              }`}
              style={{
                '--tw-ring-color': currentSession?.type === docType.type ? docType.color : 'transparent'
              } as React.CSSProperties}
              onClick={() => handleTypeSelect(docType.type)}
            >
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: docType.color + '20' }}
                  >
                    <docType.icon
                      className="h-6 w-6"
                      style={{ color: docType.color }}
                    />
                  </div>
                  
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-900 mb-1">
                      {docType.title}
                    </h4>
                    <p className="text-sm text-slate-600">
                      {docType.description}
                    </p>
                  </div>
                  
                  {currentSession?.type === docType.type && (
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: docType.color }}
                    >
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {currentSession?.type && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 p-4 bg-green-50 rounded-lg border border-green-200"
        >
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
            <span className="text-green-800 font-medium">
              Type de document sélectionné : {DOCUMENT_TYPES.find(dt => dt.type === currentSession.type)?.title}
            </span>
          </div>
        </motion.div>
      )}
    </div>
  );
}