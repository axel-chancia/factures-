'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Zap, Shield, Download, ArrowRight, CheckCircle } from 'lucide-react';
import { useDocumentStore } from '@/store/useDocumentStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function Home() {
  const { createNewSession } = useDocumentStore();
  const { createGuestSession } = useAuthStore();
  const router = useRouter();

  const handleStartCreation = () => {
    console.log('Starting document creation process');
    createGuestSession();
    createNewSession();
    router.push('/create');
  };

  const features = [
    {
      icon: FileText,
      title: 'Documents Professionnels',
      description: 'Factures, devis, proformas personnalisés'
    },
    {
      icon: Zap,
      title: 'Génération Instantanée',
      description: 'Créez vos documents en quelques clics'
    },
    {
      icon: Shield,
      title: '100% Sécurisé',
      description: 'Vos données restent privées et protégées'
    },
    {
      icon: Download,
      title: 'Export PDF',
      description: 'Téléchargez directement au format PDF'
    }
  ];

  const benefits = [
    'Interface intuitive et moderne',
    'Aucune inscription requise',
    'Personnalisation complète',
    'Sauvegarde automatique',
    'Couleurs dynamiques par document'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Navbar />
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto mb-16"
        >
          <Badge variant="secondary" className="mb-4 text-blue-600 bg-blue-100">
            ✨ Nouveau - DocuCraft Pro
          </Badge>
          
          <h1 className="text-5xl lg:text-6xl font-bold text-slate-900 mb-6 leading-tight">
            Créez vos documents
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              {' '}commerciaux{' '}
            </span>
            en un clic
          </h1>
          
          <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Générez facilement des factures, devis et proformas professionnels. 
            Interface moderne, personnalisation complète, export PDF instantané.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              onClick={handleStartCreation}
              size="lg" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Commencer maintenant
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
        >
          {features.map((feature, index) => (
            <Card key={index} className="border-0 shadow-md hover:shadow-lg transition-all duration-200 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-slate-600 text-sm">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Benefits Section */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="max-w-3xl mx-auto"
        >
          <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">
                Pourquoi choisir DocuCraft Pro ?
              </h2>
              
              <div className="grid md:grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-slate-700">{benefit}</span>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 text-center">
                <Button 
                  onClick={handleStartCreation}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  Créer mon premier document
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
      
      <Footer />
    </div>
  );
}
