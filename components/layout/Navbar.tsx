'use client';

import { Button } from '@/components/ui/button';
import { FileText, Menu, X } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-white/90 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
                
           <Link href="/" className="flex items-center p-3 space-x-2">
            <Image
             src="/logo.jpg" 
             alt="Logo"
             width={100}
             height={100}
             className="rounded-full"
             />
             <span className="text-xl font-extrabold text-slate-900 tracking-tight">Factures+</span>
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
