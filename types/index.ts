export type DocumentType = 'facture' | 'devis' | 'proforma' | 'autre';

export type PricingMode = 'unitaire' | 'gros';

export interface Product {
  id: string;
  name: string;
  description: string;
  total: number;
  pricingMode: PricingMode;

  // Mode unitaire
  unitPrice?: number;
  kilos?: number;

  // Mode gros
  cartons?: number; // ≥10kg chacun
  sacs?: number;    // ≥5kg chacun
  pricePerPackage?: number; // prix d’un carton ou d’un sac
}

export interface ClientInfo {
  firstName: string;
  lastName: string;
  phone: string;
  logo?: string;
  companyName?: string;
  email?: string;
  address?: string;
  city?: string;
  province?: string;
}

export interface Document {
  id: string;
  type: DocumentType;
  clientInfo: ClientInfo;
  products: Product[];
  total: number;
  themeColor: string;
  createdAt: Date;
  documentNumber: string;
}

export interface User {
  id: string;
  email: string;
  role: 'user' | 'admin';
  sessionId?: string;
}

export interface DocumentSession {
  id: string;
  type?: DocumentType;
  clientInfo: Partial<ClientInfo>;
  products: Product[];
  currentStep: number;
  themeColor: string;
  documentNumber?: string; // Ajouté pour cohérence avec l'usage dans PreviewStep
}

export interface DocumentSessionState {
  session: DocumentSession;
  user: User;
  isLoading: boolean;
  error?: string;
}