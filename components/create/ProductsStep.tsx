// components/create/ProductCreationForm.tsx (ou le nom de votre composant d'ajout de produit)

'use client'; // <-- IMPÉRATIF : Ce composant doit être un Client Component

import { useState } from 'react';
import { useDocumentStore } from '@/store/useDocumentStore'; // Assurez-vous que le chemin est correct
import { Product, PricingMode, DocumentSession } from '@/types'; // Assurez-vous que le chemin est correct
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner'; // Pour les notifications
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatCFA } from '@/lib/currency'; // Assurez-vous d'avoir ce helper pour le formatage monétaire

export default function ProductCreationForm() {
  // Accédez à la session actuelle et à la fonction addProduct de votre store
  const { currentSession, addProduct } = useDocumentStore();

  // États locaux pour gérer les valeurs des champs du formulaire d'un seul produit
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [pricingMode, setPricingMode] = useState<PricingMode>('unitaire');
  const [unitPrice, setUnitPrice] = useState<number>(0);
  const [kilos, setKilos] = useState<number>(0);
  const [cartons, setCartons] = useState<number>(0);
  const [sacs, setSacs] = useState<number>(0);
  const [pricePerPackage, setPricePerPackage] = useState<number>(0);

  // Fonction pour calculer le total d'un produit (peut être la même que dans votre store si vous voulez une cohérence)
  // J'ai mis une version locale pour la prévisualisation immédiate dans le formulaire
  const calculateLocalProductTotal = (): number => {
    if (pricingMode === 'unitaire') {
      return (unitPrice || 0) * (kilos || 0);
    } else { // 'gros'
      return ((cartons || 0) * (pricePerPackage || 0)) + ((sacs || 0) * (pricePerPackage || 0));
    }
  };

  const handleAddProduct = () => {
    if (!currentSession) {
      toast.error("Veuillez d'abord commencer une nouvelle session pour ajouter des produits.");
      return;
    }

    // Validation minimale des champs du formulaire
    if (!name.trim()) {
      toast.error('Le nom du produit est requis.');
      return;
    }
    if (pricingMode === 'unitaire' && (unitPrice <= 0 || kilos <= 0)) {
      toast.error('Pour le mode unitaire, le prix par kilo et la quantité en kilos doivent être positifs.');
      return;
    }
    if (pricingMode === 'gros' && (pricePerPackage <= 0 || (cartons <= 0 && sacs <= 0))) {
      toast.error('Pour le mode gros, le prix par colis et au moins un nombre de cartons/sacs sont requis.');
      return;
    }

    // Crée l'objet produit selon l'interface `Omit<Product, 'id' | 'total'>`
    const newProductData: Omit<Product, 'id' | 'total'> = {
      name,
      description,
      pricingMode,
      ...(pricingMode === 'unitaire' ? { unitPrice, kilos } : {}),
      ...(pricingMode === 'gros' ? { cartons, sacs, pricePerPackage } : {}),
    };

    // Appelle la fonction addProduct de votre store.
    // Votre store calcule déjà le total et ajoute l'ID unique.
    addProduct(newProductData);
    toast.success(`"${name}" ajouté au document !`);

    // --- POINT CRUCIAL : Réinitialisation des états locaux du formulaire ---
    setName('');
    setDescription('');
    setUnitPrice(0);
    setKilos(0);
    setCartons(0);
    setSacs(0);
    setPricePerPackage(0);
    setPricingMode('unitaire'); // Remet le mode par défaut si désiré
  };

  // Calcul du total provisoire des produits déjà ajoutés dans la session
  const sessionTotal = currentSession?.products.reduce((sum, p) => sum + p.total, 0) || 0;

  return (
    <div className="space-y-6 p-6 border rounded-lg shadow-lg bg-white">
      <h2 className="text-2xl font-bold text-center mb-4">Ajouter un Produit/Service</h2>

      <div className="grid gap-4">
        {/* Champs du formulaire pour un nouveau produit */}
        <div>
          <Label htmlFor="product-name">Nom du Produit</Label>
          <Input id="product-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex: Ciment, Consultation" />
        </div>
        <div>
          <Label htmlFor="product-description">Description (facultatif)</Label>
          <Textarea id="product-description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Détails supplémentaires..." />
        </div>

        <div>
          <Label htmlFor="pricing-mode">Mode de Tarification</Label>
          <Select value={pricingMode} onValueChange={(value: PricingMode) => setPricingMode(value)}>
            <SelectTrigger id="pricing-mode">
              <SelectValue placeholder="Sélectionner le mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="unitaire">Par Kilo (Unitaire)</SelectItem>
              <SelectItem value="gros">Par Colis (Cartons/Sacs)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {pricingMode === 'unitaire' && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="unit-price">Prix par Kilo (CFA)</Label>
              <Input id="unit-price" type="number" value={unitPrice === 0 ? '' : unitPrice} onChange={(e) => setUnitPrice(parseFloat(e.target.value) || 0)} placeholder="0" min="0" />
            </div>
            <div>
              <Label htmlFor="kilos">Quantité (Kilos)</Label>
              <Input id="kilos" type="number" value={kilos === 0 ? '' : kilos} onChange={(e) => setKilos(parseFloat(e.target.value) || 0)} placeholder="0" min="0" />
            </div>
          </div>
        )}

        {pricingMode === 'gros' && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price-package">Prix par Colis (CFA)</Label>
              <Input id="price-package" type="number" value={pricePerPackage === 0 ? '' : pricePerPackage} onChange={(e) => setPricePerPackage(parseFloat(e.target.value) || 0)} placeholder="0" min="0" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="cartons">Cartons (Ex: 10kg/carton)</Label>
                <Input id="cartons" type="number" value={cartons === 0 ? '' : cartons} onChange={(e) => setCartons(parseInt(e.target.value) || 0)} placeholder="0" min="0" />
              </div>
              <div>
                <Label htmlFor="sacs">Sacs (Ex: 5kg/sac)</Label>
                <Input id="sacs" type="number" value={sacs === 0 ? '' : sacs} onChange={(e) => setSacs(parseInt(e.target.value) || 0)} placeholder="0" min="0" />
              </div>
            </div>
          </div>
        )}

        <div className="text-right text-lg font-semibold mt-4">
          Total pour ce produit : {formatCFA(calculateLocalProductTotal())}
        </div>

        <Button onClick={handleAddProduct} className="w-full py-3 text-lg">
          Ajouter au Document
        </Button>
      </div>

      {/* --- Section du "Panier" / Liste des produits déjà ajoutés --- */}
      {currentSession && currentSession.products.length > 0 && (
        <div className="mt-8 border-t pt-6">
          <h3 className="text-xl font-bold mb-4">Produits dans votre document :</h3>
          <ul className="space-y-3">
            {currentSession.products.map((product) => (
              <li key={product.id} className="p-3 bg-slate-50 rounded-md flex justify-between items-center shadow-sm">
                <div>
                  <div className="font-semibold text-slate-800">{product.name}</div>
                  <div className="text-sm text-slate-600">{product.description || 'Pas de description'}</div>
                  <div className="text-sm text-slate-500">
                    Mode: {product.pricingMode === 'unitaire'
                      ? `Unitaire (${product.kilos ?? 0} kg @ ${formatCFA(product.unitPrice ?? 0)}/kg)`
                      : `Gros (${product.cartons ?? 0} cartons, ${product.sacs ?? 0} sacs @ ${formatCFA(product.pricePerPackage ?? 0)}/colis)`
                    }
                  </div>
                </div>
                <div className="font-bold text-slate-900">
                  {formatCFA(product.total)}
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-4 text-right text-2xl font-bold text-blue-700">
            Total provisoire du document : {formatCFA(sessionTotal)}
          </div>
        </div>
      )}
    </div>
  );
}