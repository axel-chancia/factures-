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
  Banknote,
  Plus,
  Trash2,
  BarChart2,
  Shield,
  Layers,
  TrendingUp,
  Activity,
  Eye,
  Download,
  Search,
  Filter,
} from 'lucide-react';
import { formatCFA } from '@/lib/currency';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import StatsPieChart from '@/components/create/StatsPieChart';

function Sidebar({ onLogout, onSelect, selected }: { onLogout: () => void, onSelect: (v: 'dashboard' | 'admins' | 'documents') => void, selected: 'dashboard' | 'admins' | 'documents' }) {
  return (
    <aside className="h-screen w-64 bg-gradient-to-b from-brand-900 to-brand-800 border-r border-brand-700 flex flex-col fixed z-20 shadow-strong">
      <div className="flex items-center gap-3 px-6 py-6 border-b border-brand-700/50">
        <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
          <BarChart2 className="h-5 w-5 text-white" />
        </div>
        <div>
          <span className="font-bold text-lg text-white">DocuCraft</span>
          <p className="text-xs text-brand-300">Administration</p>
        </div>
      </div>
      <nav className="flex-1 flex flex-col gap-2 px-4 py-6">
        <button
          className={`flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 group ${
            selected === 'dashboard' 
              ? 'bg-primary-600 text-white shadow-medium' 
              : 'text-brand-300 hover:text-white hover:bg-brand-700/50'
          }`}
          onClick={() => onSelect('dashboard')}
        >
          <BarChart2 className={`h-5 w-5 transition-colors ${selected === 'dashboard' ? 'text-white' : 'text-brand-400 group-hover:text-white'}`} />
          <span className="font-medium">Tableau de bord</span>
        </button>
        <button
          className={`flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 group ${
            selected === 'admins' 
              ? 'bg-primary-600 text-white shadow-medium' 
              : 'text-brand-300 hover:text-white hover:bg-brand-700/50'
          }`}
          onClick={() => onSelect('admins')}
        >
          <Shield className={`h-5 w-5 transition-colors ${selected === 'admins' ? 'text-white' : 'text-brand-400 group-hover:text-white'}`} />
          <span className="font-medium">Administrateurs</span>
        </button>
        <button
          className={`flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 group ${
            selected === 'documents' 
              ? 'bg-primary-600 text-white shadow-medium' 
              : 'text-brand-300 hover:text-white hover:bg-brand-700/50'
          }`}
          onClick={() => onSelect('documents')}
        >
          <Layers className={`h-5 w-5 transition-colors ${selected === 'documents' ? 'text-white' : 'text-brand-400 group-hover:text-white'}`} />
          <span className="font-medium">Documents</span>
        </button>
      </nav>
      <div className="p-4 border-t border-brand-700/50">
        <Button 
          variant="outline" 
          className="w-full flex items-center gap-2 border-brand-600 text-brand-300 hover:text-white hover:bg-brand-700/50 transition-all duration-200" 
          onClick={onLogout}
        >
          <LogOut className="h-4 w-4" /> 
          Déconnexion
        </Button>
      </div>
    </aside>
  );
}

function DashboardContent() {
  const { documents } = useDocumentStore();
  console.log('Documents dans le dashboard:', documents);
  
  const stats = {
    totalDocuments: documents.length,
    totalAmount: documents.reduce((sum, doc) => sum + doc.total, 0),
    documentTypes: {
      facture: documents.filter(d => d.type === 'facture').length,
      devis: documents.filter(d => d.type === 'devis').length,
      proforma: documents.filter(d => d.type === 'proforma').length,
      autre: documents.filter(d => d.type === 'autre').length
    },
    monthlyGrowth: 12.5,
    activeClients: new Set(documents.map(d => d.clientInfo.email)).size
  };

  const statCards = [
    {
      title: 'Documents totaux',
      value: stats.totalDocuments,
      icon: FileText,
      color: 'from-primary-500 to-primary-600',
      bgColor: 'bg-primary-50',
      textColor: 'text-primary-700'
    },
    {
      title: 'Chiffre d\'affaires',
      value: formatCFA(stats.totalAmount),
      icon: Banknote,
      color: 'from-success-500 to-success-600',
      bgColor: 'bg-success-50',
      textColor: 'text-success-700'
    },
    {
      title: 'Clients actifs',
      value: stats.activeClients,
      icon: Users,
      color: 'from-accent-500 to-accent-600',
      bgColor: 'bg-accent-50',
      textColor: 'text-accent-700'
    },
    {
      title: 'Croissance',
      value: `+${stats.monthlyGrowth}%`,
      icon: TrendingUp,
      color: 'from-success-400 to-success-500',
      bgColor: 'bg-success-50',
      textColor: 'text-success-700'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="relative overflow-hidden border-0 shadow-soft hover:shadow-medium transition-all duration-300 group">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-brand-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-brand-900">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} shadow-soft group-hover:scale-110 transition-transform duration-300`}>
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className={`absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r ${stat.color}`}></div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts and Recent Activity */}
      <div className="grid lg:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="border-0 shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-brand-900">
                <Activity className="h-5 w-5 text-primary-600" />
                Répartition des documents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <StatsPieChart stats={stats.documentTypes} />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="border-0 shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-brand-900">
                <FileText className="h-5 w-5 text-primary-600" />
                Documents récents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {documents.slice(0, 5).map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-3 bg-brand-50 rounded-xl hover:bg-brand-100 transition-colors duration-200">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${
                        doc.type === 'facture' ? 'from-success-500 to-success-600' :
                        doc.type === 'devis' ? 'from-primary-500 to-primary-600' :
                        doc.type === 'proforma' ? 'from-accent-500 to-accent-600' :
                        'from-brand-500 to-brand-600'
                      } flex items-center justify-center`}>
                        <FileText className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-brand-900">{doc.documentNumber}</p>
                        <p className="text-sm text-brand-600">{doc.clientInfo.firstName} {doc.clientInfo.lastName}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-brand-900">{formatCFA(doc.total)}</p>
                      <Badge variant="secondary" className={`
                        ${doc.type === 'facture' ? 'bg-success-100 text-success-800' :
                        doc.type === 'devis' ? 'bg-primary-100 text-primary-800' :
                        doc.type === 'proforma' ? 'bg-accent-100 text-accent-800' :
                        'bg-brand-100 text-brand-800'}
                      `}>
                        {doc.type}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

function AdminsContent() {
  const { admins, addAdmin, removeAdmin } = useAuthStore();
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [showAddAdmin, setShowAddAdmin] = useState(false);

  console.log('Admins actuels:', admins);

  const handleAddAdmin = () => {
    if (!newAdminEmail) {
      toast.error('Veuillez saisir un email');
      return;
    }
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <Card className="border-0 shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-brand-900">
            <Shield className="h-5 w-5 text-primary-600" />
            Gestion des administrateurs
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {showAddAdmin ? (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="space-y-4 p-4 bg-brand-50 rounded-xl"
            >
              <Input 
                placeholder="Email du nouvel administrateur" 
                value={newAdminEmail} 
                onChange={e => setNewAdminEmail(e.target.value)}
                className="border-brand-200 focus:border-primary-500"
              />
              <div className="flex gap-3">
                <Button onClick={handleAddAdmin} className="flex-1 bg-primary-600 hover:bg-primary-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter
                </Button>
                <Button variant="outline" onClick={() => setShowAddAdmin(false)} className="border-brand-200">
                  Annuler
                </Button>
              </div>
            </motion.div>
          ) : (
            <Button 
              onClick={() => setShowAddAdmin(true)} 
              className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 shadow-medium"
            >
              <Plus className="h-4 w-4 mr-2" /> 
              Ajouter un administrateur
            </Button>
          )}
          
          <Separator />
          
          <div className="space-y-4">
            <h4 className="font-semibold text-brand-900 flex items-center gap-2">
              <Users className="h-4 w-4" />
              Administrateurs actifs ({admins.length})
            </h4>
            <div className="space-y-3">
              {admins.map((admin) => (
                <motion.div 
                  key={admin.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center justify-between p-4 bg-white border border-brand-200 rounded-xl hover:shadow-soft transition-all duration-200"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                      <Shield className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-brand-900">{admin.email}</p>
                      <p className="text-sm text-brand-600">Administrateur</p>
                    </div>
                  </div>
                  {admin.id !== 'admin-1' && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleRemoveAdmin(admin.id)} 
                      className="text-danger-600 hover:text-danger-800 border-danger-200 hover:border-danger-300"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function DocumentsContent() {
  const { documents } = useDocumentStore();
  const removeDocument = useDocumentStore((state: any) => state.removeDocument);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  console.log('Documents pour l\'administration:', documents);

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.documentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         `${doc.clientInfo.firstName} ${doc.clientInfo.lastName}`.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || doc.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const handleDelete = (id: string) => {
    removeDocument(id);
    toast.success('Document supprimé');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <Card className="border-0 shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-brand-900">
            <Layers className="h-5 w-5 text-primary-600" />
            Tous les documents ({documents.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-brand-400" />
              <Input
                placeholder="Rechercher un document ou client..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-brand-200 focus:border-primary-500"
              />
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border border-brand-200 rounded-lg focus:outline-none focus:border-primary-500"
            >
              <option value="all">Tous les types</option>
              <option value="facture">Factures</option>
              <option value="devis">Devis</option>
              <option value="proforma">Proformas</option>
              <option value="autre">Autres</option>
            </select>
          </div>

          {filteredDocuments.length === 0 ? (
            <div className="text-center py-12">
              <Layers className="h-16 w-16 mx-auto mb-4 text-brand-300" />
              <p className="text-brand-600 text-lg mb-2">Aucun document trouvé</p>
              <p className="text-brand-400 text-sm">Essayez de modifier vos critères de recherche</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredDocuments.map((doc) => (
                <motion.div 
                  key={doc.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-between p-4 border border-brand-200 rounded-xl hover:shadow-soft transition-all duration-200 bg-white"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${
                      doc.type === 'facture' ? 'from-success-500 to-success-600' :
                      doc.type === 'devis' ? 'from-primary-500 to-primary-600' :
                      doc.type === 'proforma' ? 'from-accent-500 to-accent-600' :
                      'from-brand-500 to-brand-600'
                    } flex items-center justify-center shadow-soft`}>
                      <FileText className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <p className="font-semibold text-brand-900">{doc.documentNumber}</p>
                        <Badge variant="secondary" className={`
                          ${doc.type === 'facture' ? 'bg-success-100 text-success-800 border-success-200' :
                          doc.type === 'devis' ? 'bg-primary-100 text-primary-800 border-primary-200' :
                          doc.type === 'proforma' ? 'bg-accent-100 text-accent-800 border-accent-200' :
                          'bg-brand-100 text-brand-800 border-brand-200'}
                        `}>
                          {doc.type}
                        </Badge>
                      </div>
                      <p className="text-brand-600">{doc.clientInfo.firstName} {doc.clientInfo.lastName}</p>
                      <p className="text-sm text-brand-500">{new Date(doc.createdAt).toLocaleDateString('fr-FR')}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="font-bold text-lg text-brand-900">{formatCFA(doc.total)}</p>
                      <p className="text-sm text-brand-600">{doc.products.length} produit(s)</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="border-brand-200 hover:border-primary-300">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="border-brand-200 hover:border-success-300">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleDelete(doc.id)} 
                        className="text-danger-600 hover:text-danger-800 border-danger-200 hover:border-danger-300"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

function AdminDashboard() {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const [selected, setSelected] = useState<'dashboard' | 'admins' | 'documents'>('dashboard');

  console.log('Utilisateur connecté:', user);

  const handleLogout = () => {
    console.log('Déconnexion admin');
    logout();
    router.push('/');
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-brand-50 via-brand-25 to-white">
      <Sidebar onLogout={handleLogout} onSelect={setSelected} selected={selected} />
      <main className="flex-1 ml-64 p-8">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-brand-900 mb-2">
                {selected === 'dashboard' && 'Tableau de bord'}
                {selected === 'admins' && 'Gestion des administrateurs'}
                {selected === 'documents' && 'Gestion des documents'}
              </h1>
              <p className="text-brand-600">Bienvenue, {user?.email}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-brand-500">Dernière connexion</p>
              <p className="text-sm font-medium text-brand-700">{new Date().toLocaleDateString('fr-FR')}</p>
            </div>
          </div>
        </motion.div>
        
        {selected === 'dashboard' && <DashboardContent />}
        {selected === 'admins' && <AdminsContent />}
        {selected === 'documents' && <DocumentsContent />}
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
    if (!isLoading && (!isAuthenticated || !isAdmin())) {
      router.replace('/admin/login');
    }
  }, [isLoading, isAuthenticated, isAdmin, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-brand-50 via-brand-25 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-brand-600 font-medium">Chargement du tableau de bord...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin()) {
    return null;
  }

  return <AdminDashboard />;
}