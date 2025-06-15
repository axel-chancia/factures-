'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Menu, X } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-white/90 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <FileText className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-extrabold text-slate-900 tracking-tight">Factures+</span>
            <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-600">Pro</Badge>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="relative text-slate-600 hover:text-blue-600 transition-colors after:content-[''] after:absolute after:w-0 after:h-[2px] after:bg-blue-600 after:bottom-0 after:left-0 hover:after:w-full after:transition-all after:duration-300"
            >
              Accueil
            </Link>
            <Link
              href="/create"
              className="relative text-slate-600 hover:text-blue-600 transition-colors after:content-[''] after:absolute after:w-0 after:h-[2px] after:bg-blue-600 after:bottom-0 after:left-0 hover:after:w-full after:transition-all after:duration-300"
            >
              Créer un document
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMobileMenu}
              className="p-2"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 py-4">
            <div className="flex flex-col space-y-2">
              <Link
                href="/"
                className="px-4 py-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Accueil
              </Link>
              <Link
                href="/create"
                className="px-4 py-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Créer un document
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
