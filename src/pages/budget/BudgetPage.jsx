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
    
    setTimeout(() => {
      const panjang = parseFloat(landInput.panjang);
      const lebar = parseFloat(landInput.lebar);
      const budget = parseFloat(landInput.budget);
      const luasTanah = calculateArea(panjang, lebar);
      
      const luasBangunan = luasTanah * 0.6;
      const tinggiDinding = 3;
      const sisi = Math.sqrt(luasBangunan);
      const kelilingBangunan = sisi * 4;
      const luasDinding = kelilingBangunan * tinggiDinding;
      const luasAtap = luasBangunan * 1.15;
      
      const materials = [];
      let totalEstimasi = 0;
      
      const luasPondasi = kelilingBangunan * 0.6;
      Object.entries(materialStandards.pondasi).forEach(([materialId, perM2]) => {
        const mat = materialPrices.find(m => m.id === materialId);
        if (mat) {
          const qty = Math.ceil(luasPondasi * perM2);
          const subtotal = qty * mat.currentPrice;
          materials.push({ ...mat, kategori: 'Pondasi', qty, subtotal });
          totalEstimasi += subtotal;
        }
      });
      
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
            materials.push({ ...mat, kategori: 'Struktur', qty, subtotal });
          }
          totalEstimasi += subtotal;
        }
      });
      
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
            materials.push({ ...mat, kategori: 'Dinding', qty, subtotal });
          }
          totalEstimasi += subtotal;
        }
      });
      
      Object.entries(materialStandards.atap).forEach(([materialId, perM2]) => {
        const mat = materialPrices.find(m => m.id === materialId);
        if (mat) {
          const qty = Math.ceil(luasAtap * perM2);
          const subtotal = qty * mat.currentPrice;
          materials.push({ ...mat, kategori: 'Atap', qty, subtotal });
          totalEstimasi += subtotal;
        }
      });
      
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
            materials.push({ ...mat, kategori: 'Lantai', qty, subtotal });
          }
          totalEstimasi += subtotal;
        }
      });
      
      Object.entries(materialStandards.finishing).forEach(([materialId, perM2]) => {
        const mat = materialPrices.find(m => m.id === materialId);
        if (mat) {
          const existing = materials.find(m => m.id === materialId);
          const totalLuasFinishing = luasDinding * 2;
          const qty = Math.ceil(totalLuasFinishing * perM2);
          const subtotal = qty * mat.currentPrice;
          if (existing) {
            existing.qty += qty;
            existing.subtotal += subtotal;
          } else {
            materials.push({ ...mat, kategori: 'Finishing', qty, subtotal });
          }
          totalEstimasi += subtotal;
        }
      });
      
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
    }, 600);
  };
  
  const resetForm = () => {
    setLandInput({ panjang: '', lebar: '', budget: '' });
    setResult(null);
    setErrors({});
  };

  return (
    <div className="page-wrapper">
      <Header title="Hitung Budget" subtitle="Estimasi biaya bangunan" />
      
      <div className="page-scroll pb-nav">
        <div className="max-w-lg mx-auto px-4 py-4 space-y-4">
          {/* Input Form */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="p-4 space-y-4">
              <div className="flex items-center gap-2 text-slate-800">
                <Calculator size={20} className="text-blue-600" />
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
                  className="p-3 bg-blue-50 rounded-xl"
                >
                  <p className="text-sm text-blue-800">
                    <span className="font-medium">Luas Tanah:</span>{' '}
                    <span className="font-bold">
                      {calculateArea(landInput.panjang, landInput.lebar)} m2
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
                <Button variant="secondary" onClick={resetForm} disabled={calculating}>
                  Reset
                </Button>
                <Button onClick={calculateBudget} fullWidth disabled={calculating}>
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
                    <Info size={20} className="text-blue-600" />
                    <span className="font-semibold text-slate-800">Ringkasan Estimasi</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-slate-100 rounded-xl">
                      <p className="text-xs text-slate-500">Luas Tanah</p>
                      <p className="text-lg font-bold text-slate-800">{result.luasTanah} m2</p>
                    </div>
                    <div className="p-3 bg-slate-100 rounded-xl">
                      <p className="text-xs text-slate-500">Luas Bangunan</p>
                      <p className="text-lg font-bold text-slate-800">{result.luasBangunan.toFixed(0)} m2</p>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-blue-50 rounded-xl space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-blue-700">Budget Anda</span>
                      <span className="font-bold text-blue-800">{formatRupiah(result.budget)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-blue-700">Estimasi Biaya</span>
                      <span className="font-bold text-blue-800">{formatRupiah(result.totalEstimasi)}</span>
                    </div>
                    <div className="border-t border-blue-200 pt-2 mt-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-blue-700">Selisih</span>
                        <span className={`font-bold ${result.selisih >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
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
                  <button
                    type="button"
                    onClick={() => setShowDetails(!showDetails)}
                    className="w-full p-4 flex items-center justify-between active:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Package size={20} className="text-blue-600" />
                      <span className="font-semibold text-slate-800">Detail Kebutuhan Bahan</span>
                    </div>
                    {showDetails ? <ChevronUp size={20} className="text-slate-400" /> : <ChevronDown size={20} className="text-slate-400" />}
                  </button>
                  
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
                          <p className="text-xs text-slate-500 mb-3">
                            Harga update: {result.priceDate} (Area Bogor)
                          </p>
                          
                          {result.materials.map((mat, index) => (
                            <motion.div
                              key={mat.id}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.03 }}
                              className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0"
                            >
                              <div className="flex-1">
                                <p className="font-medium text-slate-800 text-sm">{mat.name}</p>
                                <p className="text-xs text-slate-500">
                                  {mat.qty.toLocaleString('id-ID')} {mat.unit} x {formatRupiah(mat.currentPrice)}
                                </p>
                              </div>
                              <p className="font-semibold text-slate-800">
                                {formatRupiah(mat.subtotal)}
                              </p>
                            </motion.div>
                          ))}
                          
                          <div className="pt-3 mt-3 border-t-2 border-blue-200">
                            <div className="flex justify-between items-center">
                              <span className="font-bold text-slate-800">Total Estimasi</span>
                              <span className="font-bold text-xl text-blue-600">
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
