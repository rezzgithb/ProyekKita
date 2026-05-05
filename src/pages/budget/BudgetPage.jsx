import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calculator, Info, Package, ChevronDown, ChevronUp } from 'lucide-react';
import { Header } from '../../components/navigation/Header';
import { Card, Button, Input, Alert } from '../../components/ui';
import { useBudgetStore } from '../../store';
import { getMaterialPrices, materialStandards } from '../../data/materials';
import { formatRupiah, calculateArea, validatePositiveNumber } from '../../utils/helpers';

export function BudgetPage() {
  const { landInput, setLandInput, result, setResult } = useBudgetStore();
  const [errors, setErrors] = useState({});
  const [showDetails, setShowDetails] = useState(false);
  const [calculating, setCalculating] = useState(false);
  
  const materialPrices = useMemo(() => getMaterialPrices(), []);
  
  const handleInputChange = (field, value) => {
    setLandInput({ ...landInput, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: null });
    }
  };
  
  const validateInputs = () => {
    const newErrors = {};
    
    if (!landInput.panjang || !validatePositiveNumber(landInput.panjang)) {
      newErrors.panjang = 'Masukkan panjang yang valid';
    }
    if (!landInput.lebar || !validatePositiveNumber(landInput.lebar)) {
      newErrors.lebar = 'Masukkan lebar yang valid';
    }
    if (!landInput.budget || !validatePositiveNumber(landInput.budget)) {
      newErrors.budget = 'Masukkan budget yang valid';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const calculateBudget = () => {
    if (!validateInputs()) return;
    
    setCalculating(true);
    
    // Simulasi loading
    setTimeout(() => {
      const panjang = parseFloat(landInput.panjang);
      const lebar = parseFloat(landInput.lebar);
      const budget = parseFloat(landInput.budget);
      const luasTanah = calculateArea(panjang, lebar);
      
      // Asumsi: luas bangunan = 60% dari luas tanah (sisanya halaman)
      const luasBangunan = luasTanah * 0.6;
      // Tinggi dinding standar 3m
      const tinggiDinding = 3;
      // Keliling bangunan (asumsi bentuk persegi)
      const sisi = Math.sqrt(luasBangunan);
      const kelilingBangunan = sisi * 4;
      // Luas dinding total (keliling x tinggi)
      const luasDinding = kelilingBangunan * tinggiDinding;
      // Luas atap (lebih besar dari lantai karena overstek)
      const luasAtap = luasBangunan * 1.15;
      
      // Hitung kebutuhan bahan berdasarkan standar per m²
      const materials = [];
      let totalEstimasi = 0;
      
      // Ambil harga dari data
      const getPrice = (id) => {
        const mat = materialPrices.find(m => m.id === id);
        return mat ? mat.currentPrice : 0;
      };
      
      // 1. Pondasi (asumsi lebar pondasi mengikuti keliling bangunan, lebar 0.6m)
      const luasPondasi = kelilingBangunan * 0.6;
      Object.entries(materialStandards.pondasi).forEach(([materialId, perM2]) => {
        const mat = materialPrices.find(m => m.id === materialId);
        if (mat) {
          const qty = Math.ceil(luasPondasi * perM2);
          const subtotal = qty * mat.currentPrice;
          materials.push({
            ...mat,
            kategori: 'Pondasi',
            qty,
            subtotal
          });
          totalEstimasi += subtotal;
        }
      });
      
      // 2. Struktur (kolom, balok, sloof)
      Object.entries(materialStandards.struktur).forEach(([materialId, perM2]) => {
        const mat = materialPrices.find(m => m.id === materialId);
        if (mat) {
          const existing = materials.find(m => m.id === materialId);
          const qty = Math.ceil(luasBangunan * perM2);
          const subtotal = qty * mat.currentPrice;
          
          if (existing) {
            existing.qty += qty;
            existing.subtotal += subtotal;
          } else {
            materials.push({
              ...mat,
              kategori: 'Struktur',
              qty,
              subtotal
            });
          }
          totalEstimasi += subtotal;
        }
      });
      
      // 3. Dinding
      Object.entries(materialStandards.dinding).forEach(([materialId, perM2]) => {
        const mat = materialPrices.find(m => m.id === materialId);
        if (mat) {
          const existing = materials.find(m => m.id === materialId);
          const qty = Math.ceil(luasDinding * perM2);
          const subtotal = qty * mat.currentPrice;
          
          if (existing) {
            existing.qty += qty;
            existing.subtotal += subtotal;
          } else {
            materials.push({
              ...mat,
              kategori: 'Dinding',
              qty,
              subtotal
            });
          }
          totalEstimasi += subtotal;
        }
      });
      
      // 4. Atap
      Object.entries(materialStandards.atap).forEach(([materialId, perM2]) => {
        const mat = materialPrices.find(m => m.id === materialId);
        if (mat) {
          const qty = Math.ceil(luasAtap * perM2);
          const subtotal = qty * mat.currentPrice;
          materials.push({
            ...mat,
            kategori: 'Atap',
            qty,
            subtotal
          });
          totalEstimasi += subtotal;
        }
      });
      
      // 5. Lantai
      Object.entries(materialStandards.lantai).forEach(([materialId, perM2]) => {
        const mat = materialPrices.find(m => m.id === materialId);
        if (mat) {
          const existing = materials.find(m => m.id === materialId);
          const qty = Math.ceil(luasBangunan * perM2);
          const subtotal = qty * mat.currentPrice;
          
          if (existing) {
            existing.qty += qty;
            existing.subtotal += subtotal;
          } else {
            materials.push({
              ...mat,
              kategori: 'Lantai',
              qty,
              subtotal
            });
          }
          totalEstimasi += subtotal;
        }
      });
      
      // 6. Finishing
      Object.entries(materialStandards.finishing).forEach(([materialId, perM2]) => {
        const mat = materialPrices.find(m => m.id === materialId);
        if (mat) {
          const existing = materials.find(m => m.id === materialId);
          // Finishing untuk dinding dalam dan luar
          const totalLuasFinishing = luasDinding * 2;
          const qty = Math.ceil(totalLuasFinishing * perM2);
          const subtotal = qty * mat.currentPrice;
          
          if (existing) {
            existing.qty += qty;
            existing.subtotal += subtotal;
          } else {
            materials.push({
              ...mat,
              kategori: 'Finishing',
              qty,
              subtotal
            });
          }
          totalEstimasi += subtotal;
        }
      });
      
      // Konsolidasi material yang sama
      const consolidatedMaterials = [];
      materials.forEach(mat => {
        const existing = consolidatedMaterials.find(m => m.id === mat.id);
        if (existing) {
          existing.qty += mat.qty;
          existing.subtotal += mat.subtotal;
        } else {
          consolidatedMaterials.push({ ...mat });
        }
      });
      
      // Sort berdasarkan subtotal terbesar
      consolidatedMaterials.sort((a, b) => b.subtotal - a.subtotal);
      
      setResult({
        luasTanah,
        luasBangunan,
        luasDinding,
        luasAtap,
        budget,
        totalEstimasi,
        selisih: budget - totalEstimasi,
        materials: consolidatedMaterials,
        priceDate: materialPrices[0]?.lastUpdate || 'April 2026'
      });
      
      setCalculating(false);
    }, 800);
  };
  
  const resetForm = () => {
    setLandInput({ panjang: '', lebar: '', budget: '' });
    setResult(null);
    setErrors({});
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <Header 
        title="Hitung Budget" 
        subtitle="Estimasi biaya bangunan"
      />
      
      <div className="flex-1 overflow-y-auto pb-24">
        <div className="max-w-lg mx-auto px-4 py-4 space-y-4">
          {/* Input Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="p-4 space-y-4">
              <div className="flex items-center gap-2 text-foreground">
                <Calculator size={20} className="text-primary-600" />
                <span className="font-semibold">Input Data Tanah</span>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Panjang Tanah"
                  type="number"
                  placeholder="0"
                  suffix="m"
                  value={landInput.panjang}
                  onChange={(e) => handleInputChange('panjang', e.target.value)}
                  error={errors.panjang}
                />
                <Input
                  label="Lebar Tanah"
                  type="number"
                  placeholder="0"
                  suffix="m"
                  value={landInput.lebar}
                  onChange={(e) => handleInputChange('lebar', e.target.value)}
                  error={errors.lebar}
                />
              </div>
              
              {landInput.panjang && landInput.lebar && 
                validatePositiveNumber(landInput.panjang) && 
                validatePositiveNumber(landInput.lebar) && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="p-3 bg-primary-50 rounded-xl"
                >
                  <p className="text-sm text-primary-800">
                    <span className="font-medium">Luas Tanah:</span>{' '}
                    <span className="font-bold">
                      {calculateArea(landInput.panjang, landInput.lebar)} m²
                    </span>
                  </p>
                </motion.div>
              )}
              
              <Input
                label="Total Budget"
                type="number"
                placeholder="0"
                prefix="Rp"
                value={landInput.budget}
                onChange={(e) => handleInputChange('budget', e.target.value)}
                error={errors.budget}
              />
              
              <div className="flex gap-3 pt-2">
                <Button 
                  variant="secondary" 
                  onClick={resetForm}
                  disabled={calculating}
                >
                  Reset
                </Button>
                <Button 
                  onClick={calculateBudget} 
                  fullWidth
                  disabled={calculating}
                >
                  {calculating ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    />
                  ) : (
                    <>
                      <Calculator size={18} />
                      Hitung Sekarang
                    </>
                  )}
                </Button>
              </div>
            </Card>
          </motion.div>
          
          {/* Results */}
          <AnimatePresence mode="wait">
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4"
              >
                {/* Summary Card */}
                <Card className="p-4 space-y-4">
                  <div className="flex items-center gap-2">
                    <Info size={20} className="text-primary-600" />
                    <span className="font-semibold text-foreground">Ringkasan Estimasi</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-surface-dark rounded-xl">
                      <p className="text-xs text-muted">Luas Tanah</p>
                      <p className="text-lg font-bold text-foreground">{result.luasTanah} m²</p>
                    </div>
                    <div className="p-3 bg-surface-dark rounded-xl">
                      <p className="text-xs text-muted">Luas Bangunan</p>
                      <p className="text-lg font-bold text-foreground">{result.luasBangunan.toFixed(0)} m²</p>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-primary-50 rounded-xl space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-primary-700">Budget Anda</span>
                      <span className="font-bold text-primary-800">{formatRupiah(result.budget)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-primary-700">Estimasi Biaya</span>
                      <span className="font-bold text-primary-800">{formatRupiah(result.totalEstimasi)}</span>
                    </div>
                    <div className="border-t border-primary-200 pt-2 mt-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-primary-700">Selisih</span>
                        <span className={`font-bold ${result.selisih >= 0 ? 'text-success' : 'text-danger'}`}>
                          {result.selisih >= 0 ? '+' : ''}{formatRupiah(result.selisih)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {result.selisih < 0 && (
                    <Alert variant="warning">
                      Budget Anda kurang sekitar {formatRupiah(Math.abs(result.selisih))} untuk membangun dengan spesifikasi standar.
                    </Alert>
                  )}
                  
                  {result.selisih >= 0 && (
                    <Alert variant="success">
                      Budget Anda cukup! Sisa dana bisa untuk biaya tak terduga atau upgrade material.
                    </Alert>
                  )}
                </Card>
                
                {/* Material Details */}
                <Card className="overflow-hidden">
                  <motion.button
                    onClick={() => setShowDetails(!showDetails)}
                    className="w-full p-4 flex items-center justify-between hover:bg-surface-dark transition-colors"
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center gap-2">
                      <Package size={20} className="text-primary-600" />
                      <span className="font-semibold text-foreground">Detail Kebutuhan Bahan</span>
                    </div>
                    {showDetails ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </motion.button>
                  
                  <AnimatePresence>
                    {showDetails && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 pb-4 space-y-2">
                          <p className="text-xs text-muted mb-3">
                            Harga update: {result.priceDate} (Area Bogor)
                          </p>
                          
                          {result.materials.map((mat, index) => (
                            <motion.div
                              key={mat.id}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.05 }}
                              className="flex items-center justify-between py-2 border-b border-border last:border-0"
                            >
                              <div className="flex-1">
                                <p className="font-medium text-foreground text-sm">{mat.name}</p>
                                <p className="text-xs text-muted">
                                  {mat.qty.toLocaleString('id-ID')} {mat.unit} × {formatRupiah(mat.currentPrice)}
                                </p>
                              </div>
                              <p className="font-semibold text-foreground">
                                {formatRupiah(mat.subtotal)}
                              </p>
                            </motion.div>
                          ))}
                          
                          <div className="pt-3 mt-3 border-t-2 border-primary-200">
                            <div className="flex justify-between items-center">
                              <span className="font-bold text-foreground">Total Estimasi</span>
                              <span className="font-bold text-xl text-primary-600">
                                {formatRupiah(result.totalEstimasi)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
                
                <Alert variant="info">
                  Estimasi ini belum termasuk biaya tukang, fondasi khusus, dan instalasi listrik/air. 
                  Harga bahan dapat berubah sewaktu-waktu.
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
