'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useDocumentStore } from '@/store/useDocumentStore';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  LogOut,
  FileText,
  Users,
  Calendar,
  Banknote,
  Plus,
  Trash2,
  BarChart2,
  Shield,
  Layers,
} from 'lucide-react';
import { formatCFA } from '@/lib/currency';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import StatsPieChart from '@/components/create/StatsPieChart';

function Sidebar({ onLogout, onSelect, selected }: { onLogout: () => void, onSelect: (v: 'dashboard' | 'admins' | 'proformas') => void, selected: 'dashboard' | 'admins' | 'proformas' }) {
  return (
    <aside className="h-screen w-64 bg-white border-r border-slate-200 flex flex-col fixed z-20">
      <div className="flex items-center gap-2 px-6 py-6 border-b border-slate-100">
        <BarChart2 className="h-7 w-7 text-blue-600" />
        <span className="font-bold text-xl text-slate-900">DocuCraft Admin</span>
      </div>
      <nav className="flex-1 flex flex-col gap-1 px-2 py-4">
        <button
          className={`flex items-center gap-3 px-4 py-2 rounded-lg text-left hover:bg-blue-50 transition ${selected === 'dashboard' ? 'bg-blue-100 font-semibold' : ''}`}
          onClick={() => onSelect('dashboard')}
        >
          <BarChart2 className="h-5 w-5" /> Vue d’ensemble
        </button>
        <button
          className={`flex items-center gap-3 px-4 py-2 rounded-lg text-left hover:bg-blue-50 transition ${selected === 'admins' ? 'bg-blue-100 font-semibold' : ''}`}
          onClick={() => onSelect('admins')}
        >
          <Shield className="h-5 w-5" /> Gestion admins
        </button>
        <button
          className={`flex items-center gap-3 px-4 py-2 rounded-lg text-left hover:bg-blue-50 transition ${selected === 'proformas' ? 'bg-blue-100 font-semibold' : ''}`}
          onClick={() => onSelect('proformas')}
        >
          <Layers className="h-5 w-5" /> Proformas visiteurs
        </button>
      </nav>
      <div className="p-4 border-t border-slate-100">
        <Button variant="outline" className="w-full flex items-center gap-2" onClick={onLogout}>
          <LogOut className="h-4 w-4" /> Déconnexion
        </Button>
      </div>
    </aside>
  );
}

function DashboardContent() {
  const { documents } = useDocumentStore();
  const stats = {
    totalDocuments: documents.length,
    totalAmount: documents.reduce((sum, doc) => sum + doc.total, 0),
    documentTypes: {
      facture: documents.filter(d => d.type === 'facture').length,
      devis: documents.filter(d => d.type === 'devis').length,
      proforma: documents.filter(d => d.type === 'proforma').length,
      autre: documents.filter(d => d.type === 'autre').length
    }
  };

  return (
    <>
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <Card><CardContent className="p-6 flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-600">Documents totaux</p>
            <p className="text-2xl font-bold text-slate-900">{stats.totalDocuments}</p>
          </div>
          <FileText className="h-8 w-8 text-blue-600" />
        </CardContent></Card>
        <Card><CardContent className="p-6 flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-600">Montant total</p>
            <p className="text-2xl font-bold text-slate-900">{formatCFA(stats.totalAmount)}</p>
          </div>
          <Banknote className="h-8 w-8 text-green-600" />
        </CardContent></Card>
        <Card><CardContent className="p-6 flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-600">Factures</p>
            <p className="text-2xl font-bold text-slate-900">{stats.documentTypes.facture}</p>
          </div>
          <Badge variant="secondary" className="bg-green-100 text-green-800">Factures</Badge>
        </CardContent></Card>
        <Card><CardContent className="p-6 flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-600">Devis</p>
            <p className="text-2xl font-bold text-slate-900">{stats.documentTypes.devis}</p>
          </div>
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">Devis</Badge>
        </CardContent></Card>
      </div>
      <StatsPieChart stats={stats.documentTypes} />
    </>
  );
}

function AdminsContent() {
  const { admins, addAdmin, removeAdmin } = useAuthStore();
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [showAddAdmin, setShowAddAdmin] = useState(false);

  const handleAddAdmin = () => {
    if (!newAdminEmail) return;
    const success = addAdmin(newAdminEmail, 'admin123');
    if (success) {
      toast.success('Administrateur ajouté avec succès');
      setNewAdminEmail('');
      setShowAddAdmin(false);
    } else {
      toast.error('Cet email existe déjà');
    }
  };

  const handleRemoveAdmin = (adminId: string) => {
    const success = removeAdmin(adminId);
    if (success) toast.success('Administrateur supprimé');
    else toast.error('Impossible de supprimer cet administrateur');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Gestion des administrateurs
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {showAddAdmin ? (
          <div className="space-y-3">
            <Input placeholder="Email du nouvel admin" value={newAdminEmail} onChange={e => setNewAdminEmail(e.target.value)} />
            <div className="flex gap-2">
              <Button onClick={handleAddAdmin} size="sm" className="flex-1">Ajouter</Button>
              <Button variant="outline" onClick={() => setShowAddAdmin(false)} size="sm">Annuler</Button>
            </div>
          </div>
        ) : (
          <Button onClick={() => setShowAddAdmin(true)} className="w-full flex items-center gap-2">
            <Plus className="h-4 w-4" /> Ajouter un administrateur
          </Button>
        )}
        <Separator />
        <div className="space-y-2">
          <h4 className="font-semibold text-slate-900">Administrateurs actifs</h4>
          {admins.map((admin) => (
            <div key={admin.id} className="flex items-center justify-between p-2 bg-slate-50 rounded">
              <span className="text-sm">{admin.email}</span>
              {admin.id !== 'admin-1' && (
                <Button variant="outline" size="sm" onClick={() => handleRemoveAdmin(admin.id)} className="text-red-600 hover:text-red-800">
                  <Trash2 className="h-3 w-3" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function ProformasContent() {
  const { documents } = useDocumentStore();
  const removeDocument = useDocumentStore((state: any) => state.removeDocument);
  const proformas = documents.filter(doc => doc.type === 'proforma');

  const handleDelete = (id: string) => {
    removeDocument(id);
    toast.success('Proforma supprimé');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Layers className="h-5 w-5" />
          Proformas visiteurs
        </CardTitle>
      </CardHeader>
      <CardContent>
        {proformas.length === 0 ? (
          <div className="text-center py-8 text-slate-600">
            <Layers className="h-12 w-12 mx-auto mb-4 text-slate-400" />
            <p>Aucun proforma visiteur</p>
          </div>
        ) : (
          <div className="space-y-4">
            {proformas.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between border border-slate-200 rounded-lg p-4">
                <div>
                  <div className="font-semibold">{doc.documentNumber}</div>
                  <div className="text-sm text-slate-600">{doc.clientInfo.firstName} {doc.clientInfo.lastName}</div>
                </div>
                <Button variant="outline" size="sm" onClick={() => handleDelete(doc.id)} className="text-red-600 hover:text-red-800">
                  <Trash2 className="h-4 w-4" /> Supprimer
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function AdminDashboard() {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const [selected, setSelected] = useState<'dashboard' | 'admins' | 'proformas'>('dashboard');

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar onLogout={handleLogout} onSelect={setSelected} selected={selected} />
      <main className="flex-1 ml-64 p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Bienvenue, {user?.email}</h1>
        </div>
        {selected === 'dashboard' && <DashboardContent />}
        {selected === 'admins' && <AdminsContent />}
        {selected === 'proformas' && <ProformasContent />}
      </main>
    </div>
  );
}

export default function AdminPage() {
  const { isAuthenticated, isAdmin } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    setIsLoading(false);
    // Redirige vers la page de connexion si non authentifié ou non admin
    if (!isLoading && (!isAuthenticated || !isAdmin())) {
      router.replace('/admin/login');
    }
    // eslint-disable-next-line
  }, [isLoading, isAuthenticated, isAdmin]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Chargement...</p>
        </div>
      </div>
    );
  }

  // Si non authentifié, on ne retourne rien (la redirection s'effectue)
  if (!isAuthenticated || !isAdmin()) {
    return null;
  }

  return <AdminDashboard />;
}