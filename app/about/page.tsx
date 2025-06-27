'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Mail, UserCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useState } from 'react';

export default function About() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('');

  const handleChange = (e: { target: { name: any; value: any; }; }) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (res.ok) {
        setStatus('Message envoyé avec succès !');
        setForm({ name: '', email: '', message: '' });
      } else {
        setStatus("Erreur lors de l'envoi.");
      }
    } catch (err) {
      setStatus("Erreur serveur.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-primary-50 to-accent-50">
      <Navbar />

      {/* Section À propos */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-4xl font-extrabold text-brand-900 mb-6">À propos de nous</h2>
          <p className="text-lg text-brand-700 leading-relaxed">
            Nous sommes une équipe passionnée dédiée à la création d'outils numériques
            modernes pour les professionnels. Notre plateforme permet la génération rapide
            et sécurisée de documents commerciaux personnalisés.
          </p>
        </motion.div>
      </section>

      {/* Section Contact */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto"
        >
          <Card className="bg-white/95 shadow-strong backdrop-blur-md">
            <CardContent className="p-8">
              <h2 className="text-3xl font-bold text-brand-900 mb-6 text-center">Contactez-nous</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-brand-700 mb-1">Nom</label>
                  <div className="relative">
                    <UserCircle className="absolute left-3 top-3 h-5 w-5 text-brand-400" />
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-brand-700 mb-1">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-brand-400" />
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-brand-700 mb-1">Message</label>
                  <textarea
                    name="message"
                    rows={5}
                    value={form.message}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <Button type="submit" className="w-full">Envoyer</Button>
                {status && <p className="text-center text-sm text-primary-700 mt-2">{status}</p>}
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
