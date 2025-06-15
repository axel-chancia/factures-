'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Document, DocumentSession, Product, ClientInfo, DocumentType } from '@/types';
import { v4 as uuidv4 } from 'uuid';

interface DocumentStore {
  // Current session
  currentSession: DocumentSession | null;

  // All documents
  documents: Document[];

  // Actions
  createNewSession: () => void;
  updateSessionType: (type: DocumentType) => void;
  updateClientInfo: (info: Partial<ClientInfo>) => void;
  addProduct: (product: Omit<Product, 'id' | 'total'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  removeProduct: (id: string) => void;
  setCurrentStep: (step: number) => void;
  saveDocument: () => Document;
  clearSession: () => void;

  // Utils
  calculateProductTotal: (product: Partial<Product>) => number;
  generateThemeColor: () => string;
  generateDocumentNumber: (type: DocumentType) => string;
}

const generateRandomColor = (): string => {
  const colors = [
    '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6',
    '#06b6d4', '#84cc16', '#f97316', '#ec4899', '#6366f1'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

const generateDocNumber = (type: DocumentType): string => {
  const prefix = {
    facture: 'FAC',
    devis: 'DEV',
    proforma: 'PRO',
    autre: 'DOC'
  };
  const timestamp = Date.now().toString().slice(-6);
  return `${prefix[type]}-${timestamp}`;
};

export const useDocumentStore = create<DocumentStore>()(
  persist(
    (set, get) => ({
      currentSession: null,
      documents: [],

      createNewSession: () => {
        const newSession: DocumentSession = {
          id: uuidv4(),
          clientInfo: {},
          products: [],
          currentStep: 1,
          themeColor: generateRandomColor()
        };
        set({ currentSession: newSession });
      },

      updateSessionType: (type: DocumentType) => {
        const { currentSession } = get();
        if (currentSession) {
          set({
            currentSession: {
              ...currentSession,
              type
            }
          });
        }
      },

      updateClientInfo: (info: Partial<ClientInfo>) => {
        const { currentSession } = get();
        if (currentSession) {
          set({
            currentSession: {
              ...currentSession,
              clientInfo: { ...currentSession.clientInfo, ...info }
            }
          });
        }
      },

      addProduct: (productData: Omit<Product, 'id' | 'total'>) => {
        const { currentSession, calculateProductTotal } = get();
        if (currentSession) {
          const product: Product = {
            ...productData,
            id: uuidv4(),
            total: calculateProductTotal({ ...productData, id: '' })
          };

          set({
            currentSession: {
              ...currentSession,
              products: [...currentSession.products, product]
            }
          });
        }
      },

      updateProduct: (id: string, updates: Partial<Product>) => {
        const { currentSession, calculateProductTotal } = get();
        if (currentSession) {
          const updatedProducts = currentSession.products.map(product => {
            if (product.id === id) {
              const updatedProduct = { ...product, ...updates };
              return {
                ...updatedProduct,
                total: calculateProductTotal(updatedProduct)
              };
            }
            return product;
          });

          set({
            currentSession: {
              ...currentSession,
              products: updatedProducts
            }
          });
        }
      },

      removeProduct: (id: string) => {
        const { currentSession } = get();
        if (currentSession) {
          set({
            currentSession: {
              ...currentSession,
              products: currentSession.products.filter(p => p.id !== id)
            }
          });
        }
      },

      setCurrentStep: (step: number) => {
        const { currentSession } = get();
        if (currentSession) {
          set({
            currentSession: {
              ...currentSession,
              currentStep: step
            }
          });
        }
      },

      saveDocument: () => {
        const { currentSession, documents } = get();
        if (!currentSession || !currentSession.type) {
          throw new Error('Cannot save incomplete document');
        }

        const document: Document = {
          id: uuidv4(),
          type: currentSession.type,
          clientInfo: currentSession.clientInfo as ClientInfo,
          products: currentSession.products,
          total: currentSession.products.reduce((sum, p) => sum + p.total, 0),
          themeColor: currentSession.themeColor,
          createdAt: new Date(),
          documentNumber: generateDocNumber(currentSession.type)
        };

        set({
          documents: [...documents, document]
        });

        return document;
      },

      clearSession: () => {
        set({ currentSession: null });
      },

      calculateProductTotal: (product: Partial<Product>) => {
        if (product.pricingMode === 'unitaire') {
          const kilos = product.kilos ?? 0;
          const unitPrice = product.unitPrice ?? 0;
          return kilos * unitPrice;
        }
        if (product.pricingMode === 'gros') {
          const cartons = product.cartons ?? 0;
          const sacs = product.sacs ?? 0;
          const pricePerPackage = product.pricePerPackage ?? 0;
          return (cartons + sacs) * pricePerPackage;
        }
        return 0;
      },

      generateThemeColor: generateRandomColor,
      generateDocumentNumber: generateDocNumber
    }),
    {
      name: 'document-store',
      partialize: (state) => ({
        documents: state.documents,
        currentSession: state.currentSession
      })
    }
  )
);