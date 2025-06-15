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
  Search,
  Filter,
  Plus,
  Trash2,
  Eye
} from 'lucide-react';
import { formatCFA } from '@/lib/currency';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

// Component pour l'authentification admin
function AdminAuth() {
  const { login } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Admin login attempt');
    setIsLoading(true);
    
    const success = await login(email, password);
    
    if (success) {
      toast.success('Connexion réussie');
    } else {
      toast.error('Identifiants incorrects');
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
      <Card className="w-full max-w-md shadow-xl bg-white/90 backdrop-blur-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-slate-900 mb-2">
            Administration
          </CardTitle>
          <p className="text-slate-600">Connectez-vous pour accéder au panneau d'administration</p>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Input
                type="email"
                placeholder="Email administrateur"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div>
              <Input
                type="password"
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? 'Connexion...' : 'Se connecter'}
            </Button>
            
            <div className="text-xs text-slate-500 text-center">
              Admin par défaut: admin@docucraft.com / admin123
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

// Component principal du dashboard admin
function AdminDashboard() {
  const { user, logout, admins, addAdmin, removeAdmin } = useAuthStore();
  const { documents } = useDocumentStore();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [showAddAdmin, setShowAddAdmin] = useState(false);

  const handleLogout = () => {
    console.log('Admin logout');
    logout();
    router.push('/');
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.clientInfo.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.clientInfo.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.documentNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterType === 'all' || doc.type === filterType;
    
    return matchesSearch && matchesFilter;
  });

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
    if (success) {
      toast.success('Administrateur supprimé');
    } else {
      toast.error('Impossible de supprimer cet administrateur');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Administration DocuCraft</h1>
            <p className="text-slate-600">Bienvenue, {user?.email}</p>
          </div>
          
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => router.push('/')}
            >
              Retour au site
            </Button>
            
            <Button
              variant="outline"
              onClick={handleLogout}
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Déconnexion
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Statistics Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600">Documents totaux</p>
                    <p className="text-2xl font-bold text-slate-900">{stats.totalDocuments}</p>
                  </div>
                  <FileText className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600">Montant total</p>
                    <p className="text-2xl font-bold text-slate-900">{formatCFA(stats.totalAmount)}</p>
                  </div>
                  <Banknote className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600">Factures</p>
                    <p className="text-2xl font-bold text-slate-900">{stats.documentTypes.facture}</p>
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Factures
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600">Devis</p>
                    <p className="text-2xl font-bold text-slate-900">{stats.documentTypes.devis}</p>
                  </div>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    Devis
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Documents List */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Documents générés
                  </CardTitle>
                  
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                      <Input
                        placeholder="Rechercher..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-48"
                      />
                    </div>
                    
                    <select
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value)}
                      className="px-3 py-2 border border-slate-300 rounded-md text-sm"
                    >
                      <option value="all">Tous types</option>
                      <option value="facture">Factures</option>
                      <option value="devis">Devis</option>
                      <option value="proforma">Proformas</option>
                      <option value="autre">Autres</option>
                    </select>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                {filteredDocuments.length === 0 ? (
                  <div className="text-center py-8 text-slate-600">
                    <FileText className="h-12 w-12 mx-auto mb-4 text-slate-400" />
                    <p>Aucun document trouvé</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredDocuments.map((doc, index) => (
                      <motion.div
                        key={doc.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-all duration-200"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <Badge 
                                style={{ backgroundColor: doc.themeColor }}
                                className="text-white"
                              >
                                {doc.type.toUpperCase()}
                              </Badge>
                              <span className="font-semibold text-slate-900">
                                {doc.documentNumber}
                              </span>
                            </div>
                            
                            <div className="text-sm text-slate-600 space-y-1">
                              <div className="flex items-center gap-4">
                                <span>
                                  <strong>Client:</strong> {doc.clientInfo.firstName} {doc.clientInfo.lastName}
                                </span>
                                {doc.clientInfo.companyName && (
                                  <span>
                                    <strong>Entreprise:</strong> {doc.clientInfo.companyName}
                                  </span>
                                )}
                              </div>
                              
                              <div className="flex items-center gap-4">
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {new Date(doc.createdAt).toLocaleDateString('fr-FR')}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Banknote className="h-3 w-3" />
                                  {formatCFA(doc.total)}
                                </span>
                                <span>
                                  {doc.products.length} produit(s)
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Admin Management */}
          <div>
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
                    <Input
                      placeholder="Email du nouvel admin"
                      value={newAdminEmail}
                      onChange={(e) => setNewAdminEmail(e.target.value)}
                    />
                    <div className="flex gap-2">
                      <Button onClick={handleAddAdmin} size="sm" className="flex-1">
                        Ajouter
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => setShowAddAdmin(false)}
                        size="sm"
                      >
                        Annuler
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button
                    onClick={() => setShowAddAdmin(true)}
                    className="w-full flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Ajouter un administrateur
                  </Button>
                )}
                
                <Separator />
                
                <div className="space-y-2">
                  <h4 className="font-semibold text-slate-900">Administrateurs actifs</h4>
                  {admins.map((admin) => (
                    <div key={admin.id} className="flex items-center justify-between p-2 bg-slate-50 rounded">
                      <span className="text-sm">{admin.email}</span>
                      {admin.id !== 'admin-1' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRemoveAdmin(admin.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminPage() {
  const { user, isAuthenticated, isAdmin } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('Admin page - checking authentication');
    setIsLoading(false);
  }, []);

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

  if (!isAuthenticated || !isAdmin()) {
    return <AdminAuth />;
  }

  return <AdminDashboard />;
}