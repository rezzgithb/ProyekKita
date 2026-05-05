import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, Package, Layers, Square, Minus, Home, Paintbrush, Grid, Zap, Search, TrendingUp } from 'lucide-react';
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

export function HargaBahanPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const materialPrices = useMemo(() => getMaterialPrices(), []);
  
  const filteredMaterials = materialPrices.filter(mat => {
    const matchSearch = mat.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCategory = selectedCategory === 'all' || mat.category === selectedCategory;
    return matchSearch && matchCategory;
  });
  
  const lastUpdate = materialPrices[0]?.lastUpdate || 'April 2026';
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.03 }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="flex flex-col h-full">
      <Header 
        title="Harga Bahan" 
        subtitle={`Update: ${lastUpdate}`}
      />
      
      <div className="flex-1 overflow-y-auto pb-4">
        <div className="max-w-lg mx-auto px-4 py-4 space-y-4">
          {/* Info */}
          <Alert variant="info">
            Harga bahan area Bogor. Update otomatis tiap bulan (+1-3%). Base: April 2026.
          </Alert>
          
          {/* Search */}
          <div className="relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="text"
              placeholder="Cari bahan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-surface border-2 border-border focus:border-primary-500 transition-colors text-foreground placeholder:text-muted/60"
            />
          </div>
          
          {/* Category Filter */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                selectedCategory === 'all' 
                  ? 'bg-primary-600 text-white' 
                  : 'bg-surface-dark text-muted hover:bg-border'
              }`}
            >
              Semua
            </button>
            {materialCategories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === cat.id 
                    ? 'bg-primary-600 text-white' 
                    : 'bg-surface-dark text-muted hover:bg-border'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
          
          {/* Materials List */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-2"
          >
            {filteredMaterials.map((mat) => {
              const Icon = iconMap[mat.icon] || Package;
              return (
                <motion.div key={mat.id} variants={itemVariants}>
                  <Card className="p-4 flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Icon size={24} className="text-primary-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground truncate">{mat.name}</h3>
                      <p className="text-xs text-muted">per {mat.unit}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-primary-600">{formatRupiah(mat.currentPrice)}</p>
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
              <p className="text-muted">Tidak ada bahan yang cocok</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
