'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  FileText,
  Zap,
  Shield,
  Download,
  ArrowRight,
  CheckCircle
} from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-primary-50 to-accent-50">
      <Navbar />

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto mb-16"
        >

          <h1 className="text-5xl lg:text-6xl font-extrabold text-brand-900 leading-tight mb-6">
            Créez vos{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-accent-600">
              documents commerciaux
            </span>{' '}
            en quelques clics
          </h1>

          <p className="text-xl text-brand-600 mb-10 max-w-2xl mx-auto">
            Générez facilement des factures, devis et proformas professionnels.
            Interface moderne, personnalisation complète, export PDF instantané.
          </p>

          <Button
            onClick={handleStartCreation}
            size="lg"
            className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-strong hover:scale-105 transition-all duration-200"
          >
            Commencer maintenant
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.15
              }
            }
          }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Card className="bg-white/95 border-0 shadow-soft hover:shadow-medium hover:scale-[1.02] transition-all duration-300 backdrop-blur-sm group">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="h-6 w-6 text-primary-600" />
                  </div>
                  <h3 className="font-semibold text-brand-900 mb-2">{feature.title}</h3>
                  <p className="text-brand-600 text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Benefits */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="max-w-4xl mx-auto"
        >
          <Card className="bg-white/95 border-0 shadow-strong backdrop-blur-md">
            <CardContent className="p-10">
              <h2 className="text-3xl font-bold text-brand-900 mb-8 text-center">
                Pourquoi choisir <span className="text-primary-600">DocuCraft Pro</span> ?
              </h2>

              <div className="grid md:grid-cols-2 gap-5">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-success-500" />
                    <span className="text-brand-700">{benefit}</span>
                  </div>
                ))}
              </div>

              <div className="mt-10 text-center">
                <Button
                  onClick={handleStartCreation}
                  className="bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 text-white px-8 py-3 rounded-xl font-semibold shadow-medium hover:scale-105 transition-all duration-200"
                >
                  Créer mon premier document
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
