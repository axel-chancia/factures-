'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { FileText, Mail, MapPin, Shield, Phone, Globe } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Image
                src="/logo.jpg" 
                alt="Logo"
                width={100}
                height={100}
                className="rounded-full"
                />
              <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-600">Pro</Badge>
            </div>
            <p className="text-sm text-slate-400">
              Solution moderne pour la génération de documents commerciaux au Gabon. 
              Créez facilement vos factures, devis et proformas.
            </p>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="font-semibold text-white">Services</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/create" className="hover:text-white transition-colors">
                  Génération de factures
                </Link>
              </li>
              <li>
                <Link href="/create" className="hover:text-white transition-colors">
                  Création de devis
                </Link>
              </li>
              <li>
                <Link href="/create" className="hover:text-white transition-colors">
                  Proformas personnalisés
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="font-semibold text-white">Contact</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>Libreville, Gabon</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>+241 076 51 69 47</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>amakita124@gmail.com</span>
              </li>
              <li className="flex items-center space-x-2">
                <Globe className="h-4 w-4" />
                <span>Gabon, Afrique Centrale</span>
              </li>
            </ul>
          </div>

          {/* Administration */}
          <div className="space-y-4">
            <h3 className="font-semibold text-white">Administration</h3>
            <p className="text-sm text-slate-400 mb-4">
              Accès réservé aux administrateurs pour la gestion des documents et utilisateurs.
            </p>
            <Link href="/auth">
              <Button 
                variant="outline" 
                className="w-full bg-transparent border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white"
              >
                <Shield className="h-4 w-4 mr-2" />
                Espace Admin
              </Button>
            </Link>
          </div>
        </div>

        <Separator className="my-8 bg-slate-700" />

        <div className="flex flex-col md:flex-row items-center justify-between text-sm text-slate-400">
          <div className="flex items-center space-x-4 mb-4 md:mb-0">
            <span>© 2024 DocuCraft Pro. Tous droits réservés.</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <span>Fait en collaboration avec l'école 241</span>
            <Badge variant="outline" className="border-slate-600 text-slate-400">
              PRO
            </Badge>
          </div>
        </div>
      </div>
    </footer>
  );
}