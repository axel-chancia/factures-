  'use client'

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Home, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
      <Card className="max-w-md w-full mx-4 shadow-xl bg-white/90 backdrop-blur-sm">
        <CardContent className="p-8 text-center">
          <div className="text-6xl font-bold text-blue-600 mb-4">404</div>
          
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            Page non trouvée
          </h1>
          
          <p className="text-slate-600 mb-8">
            La page que vous cherchez n'existe pas ou a été déplacée.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/">
              <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
                <Home className="h-4 w-4" />
                Retour à l'accueil
              </Button>
            </Link>
            
            <Button 
              variant="outline" 
              onClick={() => window.history.back()}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Page précédente
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}