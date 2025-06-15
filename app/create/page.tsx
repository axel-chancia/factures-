'use client';

import { useEffect, useState } from 'react';
import { useDocumentStore } from '@/store/useDocumentStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

// Step Components
import DocumentTypeStep from '@/components/create/DocumentTypeStep';
import ClientInfoStep from '@/components/create/ClientInfoStep';
import ProductsStep from '@/components/create/ProductsStep';
import PreviewStep from '@/components/create/PreviewStep';

const STEPS = [
  { id: 1, title: 'Type de document', component: DocumentTypeStep },
  { id: 2, title: 'Informations client', component: ClientInfoStep },
  { id: 3, title: 'Produits & services', component: ProductsStep },
  { id: 4, title: 'Aperçu & génération', component: PreviewStep }
];

export default function CreatePage() {
  const { currentSession, setCurrentStep } = useDocumentStore();
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || !currentSession) {
      router.push('/');
      return;
    }
    setIsLoading(false);
  }, [isAuthenticated, currentSession, router]);

  if (isLoading || !currentSession) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Chargement...</p>
        </div>
      </div>
    );
  }

  const currentStepData = STEPS.find(step => step.id === currentSession.currentStep);
  const CurrentStepComponent = currentStepData?.component;
  const progress = (currentSession.currentStep / STEPS.length) * 100;

  const client = currentSession.clientInfo;

  const isClientInfoValid = () => {
    return (
      client.firstName?.trim() &&
      client.lastName?.trim() &&
      client.phone?.trim() &&
      client.companyName?.trim() &&
      client.email?.trim() &&
      client.city?.trim() &&
      client.province?.trim() &&
      client.address?.trim()
    );
  };

  const handleNext = () => {
    if (currentSession.currentStep === 2 && !isClientInfoValid()) {
      alert('Veuillez remplir toutes les informations du client avant de continuer.');
      return;
    }

    if (currentSession.currentStep < STEPS.length) {
      setCurrentStep(currentSession.currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentSession.currentStep > 1) {
      setCurrentStep(currentSession.currentStep - 1);
    }
  };

  const handleStepClick = (stepId: number) => {
    setCurrentStep(stepId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              onClick={() => router.push('/')}
              className="flex items-center gap-2 text-slate-600 hover:text-slate-900"
            >
              <ArrowLeft className="h-4 w-4" />
              Retour à l'accueil
            </Button>
            
            <div className="text-right">
              <h1 className="text-2xl font-bold text-slate-900">Création de document</h1>
              <p className="text-slate-600">Étape {currentSession.currentStep} sur {STEPS.length}</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <Progress value={progress} className="h-2 bg-slate-200" />
          </div>

          {/* Steps Navigation */}
          <div className="flex justify-center">
            <div className="flex items-center space-x-4">
              {STEPS.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <button
                    onClick={() => handleStepClick(step.id)}
                    className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold transition-all duration-200 ${
                      step.id === currentSession.currentStep
                        ? 'bg-blue-600 text-white shadow-lg'
                        : step.id < currentSession.currentStep
                        ? 'bg-green-500 text-white'
                        : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                    }`}
                  >
                    {step.id < currentSession.currentStep ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      step.id
                    )}
                  </button>
                  
                  <span className={`ml-2 text-sm font-medium ${
                    step.id === currentSession.currentStep ? 'text-blue-600' : 'text-slate-600'
                  }`}>
                    {step.title}
                  </span>
                  
                  {index < STEPS.length - 1 && (
                    <div className="w-8 h-0.5 bg-slate-200 mx-4"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Current Step Content */}
        <motion.div
          key={currentSession.currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="max-w-4xl mx-auto"
        >
          <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
            <CardHeader className="text-center border-b" style={{ borderColor: currentSession.themeColor + '20' }}>
              <CardTitle className="text-2xl font-bold" style={{ color: currentSession.themeColor }}>
                {currentStepData?.title}
              </CardTitle>
            </CardHeader>
            
            <CardContent className="p-8">
              {CurrentStepComponent && <CurrentStepComponent />}
            </CardContent>
          </Card>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentSession.currentStep === 1}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Précédent
            </Button>

            <Button
              onClick={handleNext}
              disabled={currentSession.currentStep === STEPS.length}
              className="flex items-center gap-2"
              style={{ backgroundColor: currentSession.themeColor }}
            >
              Suivant
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
