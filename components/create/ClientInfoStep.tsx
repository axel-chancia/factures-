'use client';

import { useState, useRef } from 'react';
import { useDocumentStore } from '@/store/useDocumentStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, X, User, Phone, Mail, Building, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { getGaboneseProvinces } from '@/lib/currency';

export default function ClientInfoStep() {
  const { currentSession, updateClientInfo } = useDocumentStore();
  const [logoPreview, setLogoPreview] = useState<string | null>(currentSession?.clientInfo?.logo || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (field: string, value: string) => {
    if (!updateClientInfo) return;
    updateClientInfo({ [field]: value });
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        setLogoPreview(dataUrl);
        updateClientInfo({ logo: dataUrl });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    setLogoPreview(null);
    updateClientInfo({ logo: undefined });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const client = currentSession?.clientInfo || {};

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-lg font-semibold text-slate-900 mb-2">Informations client</h3>
        <p className="text-slate-600">Saisissez les informations qui apparaîtront sur votre document</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName" className="flex items-center gap-2 mb-2">
                <User className="h-4 w-4" /> Prénom *
              </Label>
              <Input
                id="firstName"
                value={client.firstName || ''}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                placeholder="Jean"
                className="bg-white"
              />
            </div>
            <div>
              <Label htmlFor="lastName" className="flex items-center gap-2 mb-2">
                <User className="h-4 w-4" /> Nom *
              </Label>
              <Input
                id="lastName"
                value={client.lastName || ''}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                placeholder="Dupont"
                className="bg-white"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="companyName" className="flex items-center gap-2 mb-2">
              <Building className="h-4 w-4" /> Nom de l'entreprise
            </Label>
            <Input
              id="companyName"
              value={client.companyName || ''}
              onChange={(e) => handleInputChange('companyName', e.target.value)}
              placeholder="Mon Entreprise SARL"
              className="bg-white"
            />
          </div>

          <div>
            <Label htmlFor="email" className="flex items-center gap-2 mb-2">
              <Mail className="h-4 w-4" /> Email
            </Label>
            <Input
              id="email"
              type="email"
              value={client.email || ''}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="contact@monentreprise.com"
              className="bg-white"
            />
          </div>

          <div>
            <Label htmlFor="phone" className="flex items-center gap-2 mb-2">
              <Phone className="h-4 w-4" /> Téléphone *
            </Label>
            <Input
              id="phone"
              value={client.phone || ''}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="01 23 45 67 89"
              className="bg-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="city" className="flex items-center gap-2 mb-2">
                <MapPin className="h-4 w-4" /> Ville
              </Label>
              <Input
                id="city"
                value={client.city || ''}
                onChange={(e) => handleInputChange('city', e.target.value)}
                placeholder="Libreville"
                className="bg-white"
              />
            </div>
            <div>
              <Label htmlFor="province" className="flex items-center gap-2 mb-2">
                <MapPin className="h-4 w-4" /> Province
              </Label>
              <Select
                value={client.province || ''}
                onValueChange={(value) => handleInputChange('province', value)}
              >
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Sélectionner une province" />
                </SelectTrigger>
                <SelectContent>
                  {getGaboneseProvinces().map((province) => (
                    <SelectItem key={province} value={province}>
                      {province}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="address" className="flex items-center gap-2 mb-2">
              <Building className="h-4 w-4" /> Adresse complète
            </Label>
            <Textarea
              id="address"
              value={client.address || ''}
              onChange={(e) => handleInputChange('address', e.target.value)}
              placeholder="Quartier, Rue, Immeuble, BP..."
              className="bg-white min-h-[80px]"
            />
          </div>
        </motion.div>

        {/* Upload de logo */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
          <div>
            <Label className="flex items-center gap-2 mb-4">
              <Upload className="h-4 w-4" /> Logo de l'entreprise
            </Label>
            <Card className="border-2 border-dashed border-slate-300 hover:border-slate-400 transition-colors">
              <CardContent className="p-6 relative">{/* Ajout de relative ici */}
                {logoPreview ? (
                  <div className="relative">
                    <img
                      src={logoPreview}
                      alt="Logo preview"
                      className="max-w-full max-h-32 mx-auto object-contain rounded-lg"
                    />
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={removeLogo}
                      className="absolute top-2 right-2"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="text-center">
                    <Upload className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-600 mb-2">Cliquez pour uploader votre logo</p>
                    <p className="text-sm text-slate-500">PNG, JPG ou PDF (max 5MB)</p>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleLogoUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  tabIndex={-1}
                  aria-label="Uploader le logo"
                />
              </CardContent>
            </Card>
          </div>

          <Card className="bg-slate-50 border-slate-200">
            <CardContent className="p-4">
              <h4 className="font-semibold text-slate-900 mb-3">Aperçu</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <User className="h-3 w-3 text-slate-500" />
                  <span>{client.firstName} {client.lastName}</span>
                </div>

                {client.companyName && (
                  <div className="flex items-center gap-2">
                    <Building className="h-3 w-3 text-slate-500" />
                    <span>{client.companyName}</span>
                  </div>
                )}

                {client.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-3 w-3 text-slate-500" />
                    <span>{client.email}</span>
                  </div>
                )}

                {client.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-3 w-3 text-slate-500" />
                    <span>{client.phone}</span>
                  </div>
                )}

                {(client.city || client.province) && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3 w-3 text-slate-500" />
                    <span>{client.city}{client.city && client.province && ', '}{client.province}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}