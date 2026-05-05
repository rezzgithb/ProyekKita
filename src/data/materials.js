// Data harga bahan bangunan area Bogor (base: April 2026)
// Update otomatis +1-3% per bulan

const BASE_DATE = new Date('2026-04-01');

// Fungsi untuk menghitung kenaikan harga berdasarkan bulan
function calculatePriceWithInflation(basePrice) {
  const now = new Date();
  const monthsDiff = (now.getFullYear() - BASE_DATE.getFullYear()) * 12 + 
                     (now.getMonth() - BASE_DATE.getMonth());
  
  if (monthsDiff <= 0) return basePrice;
  
  // Simulasi kenaikan 1-3% per bulan (rata-rata 2%)
  let price = basePrice;
  for (let i = 0; i < monthsDiff; i++) {
    const increase = 1 + (0.01 + Math.random() * 0.02); // 1-3%
    price = Math.round(price * increase);
  }
  return price;
}

// Data harga base April 2026 - Area Bogor
export const materialPricesBase = [
  {
    id: 'semen',
    name: 'Semen',
    unit: 'sak (50kg)',
    basePrice: 65000,
    category: 'material-utama',
    icon: 'Package'
  },
  {
    id: 'pasir',
    name: 'Pasir Pasang',
    unit: 'm³',
    basePrice: 350000,
    category: 'material-utama',
    icon: 'Layers'
  },
  {
    id: 'pasir-cor',
    name: 'Pasir Cor',
    unit: 'm³',
    basePrice: 400000,
    category: 'material-utama',
    icon: 'Layers'
  },
  {
    id: 'batu-split',
    name: 'Batu Split',
    unit: 'm³',
    basePrice: 450000,
    category: 'material-utama',
    icon: 'Hexagon'
  },
  {
    id: 'bata-merah',
    name: 'Bata Merah',
    unit: 'buah',
    basePrice: 900,
    category: 'dinding',
    icon: 'Square'
  },
  {
    id: 'batako',
    name: 'Batako Press',
    unit: 'buah',
    basePrice: 3500,
    category: 'dinding',
    icon: 'Square'
  },
  {
    id: 'hebel',
    name: 'Bata Ringan (Hebel)',
    unit: 'buah',
    basePrice: 8500,
    category: 'dinding',
    icon: 'Square'
  },
  {
    id: 'besi-8',
    name: 'Besi Beton 8mm',
    unit: 'batang (12m)',
    basePrice: 55000,
    category: 'struktur',
    icon: 'Minus'
  },
  {
    id: 'besi-10',
    name: 'Besi Beton 10mm',
    unit: 'batang (12m)',
    basePrice: 85000,
    category: 'struktur',
    icon: 'Minus'
  },
  {
    id: 'besi-12',
    name: 'Besi Beton 12mm',
    unit: 'batang (12m)',
    basePrice: 125000,
    category: 'struktur',
    icon: 'Minus'
  },
  {
    id: 'kawat-bendrat',
    name: 'Kawat Bendrat',
    unit: 'kg',
    basePrice: 22000,
    category: 'struktur',
    icon: 'Circle'
  },
  {
    id: 'genteng-beton',
    name: 'Genteng Beton',
    unit: 'buah',
    basePrice: 12000,
    category: 'atap',
    icon: 'Home'
  },
  {
    id: 'genteng-keramik',
    name: 'Genteng Keramik',
    unit: 'buah',
    basePrice: 9500,
    category: 'atap',
    icon: 'Home'
  },
  {
    id: 'rangka-baja',
    name: 'Rangka Atap Baja Ringan',
    unit: 'm²',
    basePrice: 185000,
    category: 'atap',
    icon: 'Triangle'
  },
  {
    id: 'cat-tembok',
    name: 'Cat Tembok (5kg)',
    unit: 'kaleng',
    basePrice: 75000,
    category: 'finishing',
    icon: 'Paintbrush'
  },
  {
    id: 'keramik-40',
    name: 'Keramik 40x40',
    unit: 'm²',
    basePrice: 65000,
    category: 'finishing',
    icon: 'Grid'
  },
  {
    id: 'keramik-60',
    name: 'Keramik 60x60',
    unit: 'm²',
    basePrice: 95000,
    category: 'finishing',
    icon: 'Grid'
  },
  {
    id: 'granit',
    name: 'Granit 60x60',
    unit: 'm²',
    basePrice: 175000,
    category: 'finishing',
    icon: 'Grid'
  },
  {
    id: 'pipa-pvc-4',
    name: 'Pipa PVC 4 inch',
    unit: 'batang (4m)',
    basePrice: 85000,
    category: 'instalasi',
    icon: 'Cylinder'
  },
  {
    id: 'kabel-nya',
    name: 'Kabel NYA 2.5mm',
    unit: 'roll (50m)',
    basePrice: 450000,
    category: 'instalasi',
    icon: 'Zap'
  }
];

// Fungsi untuk mendapatkan harga terkini dengan inflasi
export function getMaterialPrices() {
  return materialPricesBase.map(item => ({
    ...item,
    currentPrice: calculatePriceWithInflation(item.basePrice),
    lastUpdate: new Date().toLocaleDateString('id-ID', { 
      month: 'long', 
      year: 'numeric' 
    })
  }));
}

// Standar kebutuhan bahan per m² bangunan
export const materialStandards = {
  // Pondasi (per m² pondasi)
  pondasi: {
    semen: 0.5,        // sak per m²
    pasir: 0.05,       // m³ per m²
    'batu-split': 0.08, // m³ per m²
    'besi-10': 0.3,    // batang per m²
    'kawat-bendrat': 0.2 // kg per m²
  },
  // Struktur/Kolom & Sloof (per m² bangunan)
  struktur: {
    semen: 0.8,
    pasir: 0.06,
    'batu-split': 0.1,
    'besi-10': 0.5,
    'besi-12': 0.3,
    'kawat-bendrat': 0.5
  },
  // Dinding (per m² bangunan, asumsi tinggi 3m)
  dinding: {
    'bata-merah': 70,   // buah per m² dinding
    semen: 0.3,
    pasir: 0.02
  },
  // Atap (per m² atap)
  atap: {
    'rangka-baja': 1,
    'genteng-beton': 15
  },
  // Lantai (per m² lantai)
  lantai: {
    semen: 0.2,
    pasir: 0.02,
    'keramik-40': 1.05  // 5% untuk cadangan
  },
  // Finishing (per m² dinding)
  finishing: {
    semen: 0.15,
    pasir: 0.01,
    'cat-tembok': 0.1   // 1 kaleng 5kg = 10m²
  }
};

// Kategori bahan
export const materialCategories = [
  { id: 'material-utama', name: 'Material Utama', color: 'primary' },
  { id: 'dinding', name: 'Dinding', color: 'blue' },
  { id: 'struktur', name: 'Struktur', color: 'orange' },
  { id: 'atap', name: 'Atap', color: 'green' },
  { id: 'finishing', name: 'Finishing', color: 'purple' },
  { id: 'instalasi', name: 'Instalasi', color: 'cyan' }
];
