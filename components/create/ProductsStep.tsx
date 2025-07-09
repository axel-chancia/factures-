'use client';

import { useState } from 'react';
import { useDocumentStore } from '@/store/useDocumentStore';
import { Product, PricingMode } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { formatCFA } from '@/lib/currency';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Package, 
  Trash2, 
  Edit3, 
  ShoppingCart,
  Calculator,
  Lock,
  Unlock,
  Box,
  Weight
} from 'lucide-react';

export default function ProductsStep() {
  const { currentSession, addProduct, removeProduct, updateProduct } = useDocumentStore();
  const [isFormVisible, setIsFormVisible] = useState(false);
  
  // États du formulaire
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [pricingMode, setPricingMode] = useState<PricingMode>('unitaire');
  const [unitPrice, setUnitPrice] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(0);
  
  // Pour le mode gros
  const [packageType, setPackageType] = useState<'carton' | 'sac'>('carton');
  const [packagePrice, setPackagePrice] = useState<number>(0);
  const [packageQuantity, setPackageQuantity] = useState<number>(0);

  console.log('Session actuelle dans ProductsStep:', currentSession);

  const calculateProductTotal = (): number => {
    if (pricingMode === 'unitaire') {
      return (unitPrice || 0) * (quantity || 0);
    } else { // 'gros'
      return (packagePrice || 0) * (packageQuantity || 0);
    }
  };

  const resetForm = () => {
    setName('');
    setDescription('');
    setPricingMode('unitaire');
    setUnitPrice(0);
    setQuantity(0);
    setPackageType('carton');
    setPackagePrice(0);
    setPackageQuantity(0);
  };

  const handleAddProduct = () => {
    console.log('Tentative d\'ajout de produit');
    
    if (!currentSession) {
      toast.error("Veuillez d'abord créer une session");
      return;
    }

    if (!name.trim()) {
      toast.error('Le nom du produit est requis');
      return;
    }

    if (pricingMode === 'unitaire') {
      if (unitPrice <= 0 || quantity <= 0) {
        toast.error('Le prix unitaire et la quantité doivent être positifs');
        return;
      }
    } else { // gros
      if (packagePrice <= 0 || packageQuantity <= 0) {
        toast.error('Le prix du colis et la quantité doivent être positifs');
        return;
      }
    }

    const productData: Omit<Product, 'id' | 'total'> = {
      name,
      description,
      pricingMode,
      ...(pricingMode === 'unitaire' 
        ? { unitPrice: quantity }
        : { 
            pricePerPackage: packagePrice,
            ...(packageType === 'carton' ? { cartons: packageQuantity, sacs: 0 } : { sacs: packageQuantity, cartons: 0 })
          }
      ),
    };

    console.log('Données du produit à ajouter:', productData);
    addProduct(productData);
    toast.success(`"${name}" ajouté avec succès !`);
    resetForm();
    setIsFormVisible(false);
  };

  const handleRemoveProduct = (productId: string) => {
    removeProduct(productId);
    toast.success('Produit supprimé');
  };

  const sessionTotal = currentSession?.products.reduce((sum, p) => sum + p.total, 0) || 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2 className="text-3xl font-bold text-brand-900 mb-2">Produits</h2>
        <p className="text-brand-600">Ajoutez vos produits avec leurs prix et quantités</p>
      </motion.div>

      {/* Add Product Button */}
      {!isFormVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex justify-center"
        >
          <Button
            onClick={() => setIsFormVisible(true)}
            className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-medium hover:scale-105 transition-all duration-200"
          >
            <Plus className="h-5 w-5 mr-2" />
            Ajouter un produit
          </Button>
        </motion.div>
      )}

      {/* Product Form */}
      <AnimatePresence>
        {isFormVisible && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border-0 shadow-strong bg-white/95 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-brand-900">
                  <Package className="h-5 w-5 text-primary-600" />
                  Nouveau produit
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Basic Info */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="product-name" className="text-brand-700 font-medium">
                      Nom du produit <span className="text-danger-500">*</span>
                    </Label>
                    <Input
                      id="product-name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ex: Ciment, Matériaux..."
                      className="border-brand-200 focus:border-primary-500 h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="product-description" className="text-brand-700 font-medium">
                      Description (optionnel)
                    </Label>
                    <Textarea
                      id="product-description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Détails supplémentaires..."
                      className="border-brand-200 focus:border-primary-500 min-h-[48px] resize-none"
                    />
                  </div>
                </div>

                {/* Pricing Mode */}
                <div className="space-y-3">
                  <Label className="text-brand-700 font-medium">Mode de tarification</Label>
                  <div className="grid md:grid-cols-2 gap-4">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Card 
                        className={`cursor-pointer transition-all duration-200 border-2 ${
                          pricingMode === 'unitaire' 
                            ? 'border-primary-500 bg-primary-50 shadow-medium' 
                            : 'border-brand-200 hover:border-primary-300'
                        }`}
                        onClick={() => setPricingMode('unitaire')}
                      >
                        <CardContent className="p-4 text-center">
                          <Weight className={`h-8 w-8 mx-auto mb-2 ${pricingMode === 'unitaire' ? 'text-primary-600' : 'text-brand-400'}`} />
                          <h3 className={`font-semibold ${pricingMode === 'unitaire' ? 'text-primary-700' : 'text-brand-700'}`}>
                            Prix unitaire
                          </h3>
                          <p className="text-sm text-brand-600">Prix unitaire × quantité</p>
                        </CardContent>
                      </Card>
                    </motion.div>
                    
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Card 
                        className={`cursor-pointer transition-all duration-200 border-2 ${
                          pricingMode === 'gros' 
                            ? 'border-primary-500 bg-primary-50 shadow-medium' 
                            : 'border-brand-200 hover:border-primary-300'
                        }`}
                        onClick={() => setPricingMode('gros')}
                      >
                        <CardContent className="p-4 text-center">
                          <Box className={`h-8 w-8 mx-auto mb-2 ${pricingMode === 'gros' ? 'text-primary-600' : 'text-brand-400'}`} />
                          <h3 className={`font-semibold ${pricingMode === 'gros' ? 'text-primary-700' : 'text-brand-700'}`}>
                            Prix de gros
                          </h3>
                          <p className="text-sm text-brand-600">Par cartons ou sacs</p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </div>
                </div>

                {/* Pricing Fields */}
                <AnimatePresence mode="wait">
                  {pricingMode === 'unitaire' ? (
                    <motion.div
                      key="unitaire"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="grid md:grid-cols-2 gap-6 p-4 bg-primary-50 rounded-xl border border-primary-200"
                    >
                      <div className="space-y-2">
                        <Label className="text-primary-700 font-medium flex items-center gap-2">
                          <Calculator className="h-4 w-4" />
                          Prix par article ou produit (CFA) <span className="text-danger-500">*</span>
                        </Label>
                        <Input
                          type="number"
                          value={unitPrice === 0 ? '' : unitPrice}
                          onChange={(e) => setUnitPrice(parseFloat(e.target.value) || 0)}
                          placeholder="0"
                          min="0"
                          className="border-primary-200 focus:border-primary-500 h-12"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-primary-700 font-medium flex items-center gap-2">
                          <Weight className="h-4 w-4" />
                          Quantité (Nombre) <span className="text-danger-500">*</span>
                        </Label>
                        <Input
                          type="number"
                          value={quantity === 0 ? '' : quantity}
                          onChange={(e) => setQuantity(parseFloat(e.target.value) || 0)}
                          placeholder="0"
                          min="0"
                          className="border-primary-200 focus:border-primary-500 h-12"
                        />
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="gros"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      {/* Package Type Selection */}
                      <div className="space-y-3">
                        <Label className="text-brand-700 font-medium">Type de conditionnement</Label>
                        <div className="grid grid-cols-2 gap-4">
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Card 
                              className={`cursor-pointer transition-all duration-200 border-2 ${
                                packageType === 'carton' 
                                  ? 'border-accent-500 bg-accent-50 shadow-medium' 
                                  : 'border-brand-200 hover:border-accent-300'
                              }`}
                              onClick={() => setPackageType('carton')}
                            >
                              <CardContent className="p-3 flex items-center gap-3">
                                <Box className={`h-6 w-6 ${packageType === 'carton' ? 'text-accent-600' : 'text-brand-400'}`} />
                                <div>
                                  <h4 className={`font-medium ${packageType === 'carton' ? 'text-accent-700' : 'text-brand-700'}`}>
                                    Cartons
                                  </h4>
                                  <p className="text-xs text-brand-500">≥10kg par carton</p>
                                </div>
                                {packageType === 'carton' ? (
                                  <Unlock className="h-4 w-4 text-accent-600 ml-auto" />
                                ) : (
                                  <Lock className="h-4 w-4 text-brand-300 ml-auto" />
                                )}
                              </CardContent>
                            </Card>
                          </motion.div>
                          
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Card 
                              className={`cursor-pointer transition-all duration-200 border-2 ${
                                packageType === 'sac' 
                                  ? 'border-accent-500 bg-accent-50 shadow-medium' 
                                  : 'border-brand-200 hover:border-accent-300'
                              }`}
                              onClick={() => setPackageType('sac')}
                            >
                              <CardContent className="p-3 flex items-center gap-3">
                                <Package className={`h-6 w-6 ${packageType === 'sac' ? 'text-accent-600' : 'text-brand-400'}`} />
                                <div>
                                  <h4 className={`font-medium ${packageType === 'sac' ? 'text-accent-700' : 'text-brand-700'}`}>
                                    Sacs
                                  </h4>
                                  <p className="text-xs text-brand-500">≥5kg par sac</p>
                                </div>
                                {packageType === 'sac' ? (
                                  <Unlock className="h-4 w-4 text-accent-600 ml-auto" />
                                ) : (
                                  <Lock className="h-4 w-4 text-brand-300 ml-auto" />
                                )}
                              </CardContent>
                            </Card>
                          </motion.div>
                        </div>
                      </div>

                      {/* Package Pricing */}
                      <div className="grid md:grid-cols-2 gap-6 p-4 bg-accent-50 rounded-xl border border-accent-200">
                        <div className="space-y-2">
                          <Label className="text-accent-700 font-medium flex items-center gap-2">
                            <Calculator className="h-4 w-4" />
                            Prix par {packageType} (CFA) <span className="text-danger-500">*</span>
                          </Label>
                          <Input
                            type="number"
                            value={packagePrice === 0 ? '' : packagePrice}
                            onChange={(e) => setPackagePrice(parseFloat(e.target.value) || 0)}
                            placeholder="0"
                            min="0"
                            className="border-accent-200 focus:border-accent-500 h-12"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-accent-700 font-medium flex items-center gap-2">
                            {packageType === 'carton' ? <Box className="h-4 w-4" /> : <Package className="h-4 w-4" />}
                            Nombre de {packageType}s <span className="text-danger-500">*</span>
                          </Label>
                          <Input
                            type="number"
                            value={packageQuantity === 0 ? '' : packageQuantity}
                            onChange={(e) => setPackageQuantity(parseInt(e.target.value) || 0)}
                            placeholder="0"
                            min="0"
                            className="border-accent-200 focus:border-accent-500 h-12"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Total Preview */}
                <div className="p-4 bg-gradient-to-r from-success-50 to-success-100 border border-success-200 rounded-xl">
                  <div className="flex items-center justify-between">
                    <span className="text-success-700 font-medium">Total pour ce produit :</span>
                    <span className="text-2xl font-bold text-success-800">
                      {formatCFA(calculateProductTotal())}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <Button
                    onClick={handleAddProduct}
                    className="flex-1 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white h-12 font-semibold shadow-medium"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter le produit
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      resetForm();
                      setIsFormVisible(false);
                    }}
                    className="border-brand-200 hover:border-brand-300 h-12"
                  >
                    Annuler
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Products List */}
      {currentSession && currentSession.products.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <Card className="border-0 shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-brand-900">
                <ShoppingCart className="h-5 w-5 text-primary-600" />
                Produits ajoutés ({currentSession.products.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {currentSession.products.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 border border-brand-200 rounded-xl hover:shadow-soft transition-all duration-200 bg-white"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-brand-900">{product.name}</h3>
                          <Badge variant="secondary" className={`
                            ${product.pricingMode === 'unitaire' 
                              ? 'bg-primary-100 text-primary-800 border-primary-200' 
                              : 'bg-accent-100 text-accent-800 border-accent-200'}
                          `}>
                            {product.pricingMode === 'unitaire' ? 'Unitaire' : 'Gros'}
                          </Badge>
                        </div>
                        {product.description && (
                          <p className="text-sm text-brand-600 mb-2">{product.description}</p>
                        )}
                        <div className="text-sm text-brand-500">
                          {product.pricingMode === 'unitaire' ? (
                            <>
                              {product.kilos ?? 0} kg × {formatCFA(product.unitPrice ?? 0)}/kg
                            </>
                          ) : (
                            <>
                              {((product.cartons ?? 0) > 0) && `${product.cartons} carton(s)`}
                              {((product.sacs ?? 0) > 0) && `${product.sacs} sac(s)`}
                              {` × ${formatCFA(product.pricePerPackage ?? 0)}`}
                            </>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="text-xl font-bold text-brand-900">
                            {formatCFA(product.total)}
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRemoveProduct(product.id)}
                          className="text-danger-600 hover:text-danger-800 border-danger-200 hover:border-danger-300"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Session Total */}
              <Separator className="my-6" />
              <div className="flex justify-between items-center p-4 bg-gradient-to-r from-brand-50 to-primary-50 rounded-xl border border-brand-200">
                <span className="text-lg font-semibold text-brand-700">Total du document :</span>
                <span className="text-3xl font-bold text-primary-700">
                  {formatCFA(sessionTotal)}
                </span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}