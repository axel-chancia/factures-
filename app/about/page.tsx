'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Mail, UserCircle, Send } from 'lucide-react';
import { motion } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useState } from 'react';

export default function About() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState<{ mail: boolean; whatsapp: boolean }>({ mail: false, whatsapp: false });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent, mode: 'mail' | 'whatsapp') => {
    e.preventDefault();
    setStatus('');
    setLoading((prev) => ({ ...prev, [mode]: true }));
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, mode }),
      });
      if (res.ok) {
        setStatus(`Message envoyé avec succès via ${mode === 'mail' ? 'Email' : 'WhatsApp'} !`);
        setForm({ name: '', email: '', message: '' });
      } else {
        setStatus("Erreur lors de l'envoi.");
      }
    } catch (err) {
      setStatus("Erreur serveur.");
    } finally {
      setLoading((prev) => ({ ...prev, [mode]: false }));
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
              <p className="text-center text-brand-600 text-sm mb-4">
                Envoyez-nous un message par Email ou WhatsApp.
              </p>
              <form className="space-y-6">
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
                      placeholder="Votre nom"
                      className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white/80"
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
                      placeholder="Votre email"
                      className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white/80"
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
                    placeholder="Votre message"
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white/80"
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-4 mt-6">
                  <Button
                    type="button"
                    className="w-full flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700"
                    onClick={(e) => handleSubmit(e, 'mail')}
                    disabled={loading.mail}
                  >
                    <Mail className="h-5 w-5" />
                    {loading.mail ? "Envoi..." : "Envoyer par Email"}
                  </Button>
                  <Button
                    type="button"
                    className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700"
                    onClick={(e) => handleSubmit(e, 'whatsapp')}
                    disabled={loading.whatsapp}
                  >
                    <Send className="h-5 w-5" />
                    {loading.whatsapp ? "Envoi..." : "Envoyer par WhatsApp"}
                  </Button>
                </div>
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