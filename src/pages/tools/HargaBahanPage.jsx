import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Package, Layers, Square, Minus, Home, Paintbrush, Grid, Zap, Search, TrendingUp, ArrowLeft } from 'lucide-react';
import { Header } from '../../components/navigation/Header';
import { Card, Alert } from '../../components/ui';
import { getMaterialPrices, materialCategories } from '../../data/materials';
import { formatRupiah } from '../../utils/helpers';

const iconMap = {
  Package, Layers, Square, Minus, Home, Paintbrush, Grid, Zap,
  Hexagon: Square,
  Circle: Square,
  Cylinder: Square,
  Triangle: Square
};

export function HargaBahanPage({ onBack }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const materialPrices = useMemo(() => getMaterialPrices(), []);
  
  const filteredMaterials = materialPrices.filter(mat => {
    const matchSearch = mat.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCategory = selectedCategory === 'all' || mat.category === selectedCategory;
    return matchSearch && matchCategory;
  });
  
  const lastUpdate = materialPrices[0]?.lastUpdate || 'April 2026';

  return (
    <div className="page-wrapper">
      <Header 
        title="Harga Bahan" 
        subtitle={`Update: ${lastUpdate}`}
        showBack
        onBack={onBack}
      />
      
      <div className="page-scroll pb-nav">
        <div className="max-w-lg mx-auto px-4 py-4 space-y-4">
          {/* Info */}
          <Alert variant="info">
            Harga bahan area Bogor. Update otomatis tiap bulan (+1-3%). Base: April 2026.
          </Alert>
          
          {/* Search */}
          <div className="relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari bahan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-white border-2 border-slate-200 focus:border-blue-500 transition-colors text-slate-800 placeholder:text-slate-400 outline-none"
            />
          </div>
          
          {/* Category Filter */}
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
            <button
              type="button"
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                selectedCategory === 'all' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-slate-100 text-slate-600 active:bg-slate-200'
              }`}
            >
              Semua
            </button>
            {materialCategories.map(cat => (
              <button
                type="button"
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === cat.id 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-slate-100 text-slate-600 active:bg-slate-200'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
          
          {/* Materials List */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-2"
          >
            {filteredMaterials.map((mat, index) => {
              const Icon = iconMap[mat.icon] || Package;
              return (
                <motion.div 
                  key={mat.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.02 }}
                >
                  <Card className="p-4 flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Icon size={24} className="text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-slate-800 truncate">{mat.name}</h3>
                      <p className="text-xs text-slate-500">per {mat.unit}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-blue-600">{formatRupiah(mat.currentPrice)}</p>
                      <div className="flex items-center gap-1 text-xs text-emerald-600">
                        <TrendingUp size={12} />
                        <span>+2%</span>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
          
          {filteredMaterials.length === 0 && (
            <div className="text-center py-8">
              <p className="text-slate-500">Tidak ada bahan yang cocok</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
