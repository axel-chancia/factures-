'use client';

import { useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Shield, LogIn, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import Link from 'next/link';

export default function AuthPage() {
  const { login } = useAuthStore();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  
  // User login form
  const [userForm, setUserForm] = useState({
    email: '',
    password: ''
  });
  
  // Admin login form
  const [adminForm, setAdminForm] = useState({
    email: 'admin@docucraft.com',
    password: 'admin123'
  });

  const handleUserLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('User login attempt');
    setIsLoading(true);
    
    const success = await login(userForm.email, userForm.password);
    
    if (success) {
      toast.success('Connexion réussie');
      router.push('/create');
    } else {
      toast.error('Identifiants incorrects');
    }
    
    setIsLoading(false);
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Admin login attempt');
    setIsLoading(true);
    
    const success = await login(adminForm.email, adminForm.password);
    
    if (success) {
      toast.success('Connexion administrateur réussie');
      router.push('/admin');
    } else {
      toast.error('Identifiants administrateur incorrects');
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="flex items-center gap-2 text-slate-600 hover:text-slate-900">
              <ArrowLeft className="h-4 w-4" />
              Retour à l'accueil
            </Button>
          </Link>
        </div>

        <div className="max-w-md mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Connexion</h1>
            <p className="text-slate-600">
              Accédez à votre espace pour gérer vos documents
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="shadow-xl bg-white/90 backdrop-blur-sm">
              <CardContent className="p-6">
                <Tabs defaultValue="user" className="space-y-6">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="user" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Utilisateur
                    </TabsTrigger>
                    <TabsTrigger value="admin" className="flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      Admin
                    </TabsTrigger>
                  </TabsList>
                  
                  {/* User Login */}
                  <TabsContent value="user" className="space-y-4">
                    <div className="text-center mb-4">
                      <h3 className="font-semibold text-slate-900 mb-1">Connexion Utilisateur</h3>
                      <p className="text-sm text-slate-600">
                        Connectez-vous pour créer vos documents
                      </p>
                    </div>
                    
                    <form onSubmit={handleUserLogin} className="space-y-4">
                      <div>
                        <Label htmlFor="user-email">Email</Label>
                        <Input
                          id="user-email"
                          type="email"
                          placeholder="votre@email.com"
                          value={userForm.email}
                          onChange={(e) => setUserForm(prev => ({ ...prev, email: e.target.value }))}
                          required
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="user-password">Mot de passe</Label>
                        <Input
                          id="user-password"
                          type="password"
                          placeholder="Votre mot de passe"
                          value={userForm.password}
                          onChange={(e) => setUserForm(prev => ({ ...prev, password: e.target.value }))}
                          required
                        />
                      </div>
                      
                      <Button 
                        type="submit" 
                        className="w-full bg-blue-600 hover:bg-blue-700" 
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <div className="flex items-center gap-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            Connexion...
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <LogIn className="h-4 w-4" />
                            Se connecter
                          </div>
                        )}
                      </Button>
                      
                      <div className="text-xs text-slate-500 text-center">
                        Utilisez n'importe quel email valide et un mot de passe de 4+ caractères
                      </div>
                    </form>
                  </TabsContent>
                  
                  {/* Admin Login */}
                  <TabsContent value="admin" className="space-y-4">
                    <div className="text-center mb-4">
                      <h3 className="font-semibold text-slate-900 mb-1">Connexion Administrateur</h3>
                      <p className="text-sm text-slate-600">
                        Accès réservé aux administrateurs
                      </p>
                    </div>
                    
                    <form onSubmit={handleAdminLogin} className="space-y-4">
                      <div>
                        <Label htmlFor="admin-email">Email administrateur</Label>
                        <Input
                          id="admin-email"
                          type="email"
                          value={adminForm.email}
                          onChange={(e) => setAdminForm(prev => ({ ...prev, email: e.target.value }))}
                          required
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="admin-password">Mot de passe administrateur</Label>
                        <Input
                          id="admin-password"
                          type="password"
                          value={adminForm.password}
                          onChange={(e) => setAdminForm(prev => ({ ...prev, password: e.target.value }))}
                          required
                        />
                      </div>
                      
                      <Button 
                        type="submit" 
                        className="w-full bg-red-600 hover:bg-red-700" 
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <div className="flex items-center gap-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            Connexion...
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <Shield className="h-4 w-4" />
                            Connexion Admin
                          </div>
                        )}
                      </Button>
                      
                      <div className="text-xs text-slate-500 text-center">
                        Identifiants par défaut pré-remplis
                      </div>
                    </form>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}