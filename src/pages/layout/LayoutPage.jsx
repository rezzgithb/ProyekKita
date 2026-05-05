import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutGrid, Download, RefreshCw, Bed, Sofa, Bath, UtensilsCrossed, Car } from 'lucide-react';
import { Header } from '../../components/navigation/Header';
import { Card, Button, Input, Select, Alert } from '../../components/ui';
import { useLayoutStore } from '../../store';
import { calculateArea, validatePositiveNumber } from '../../utils/helpers';

const roomSizeOptions = [
  { value: 'kecil', label: 'Kecil (3x3m)' },
  { value: 'sedang', label: 'Sedang (4x4m)' },
  { value: 'besar', label: 'Besar (5x4m)' },
];

const kamarOptions = [
  { value: '1', label: '1 Kamar' },
  { value: '2', label: '2 Kamar' },
  { value: '3', label: '3 Kamar' },
  { value: '4', label: '4 Kamar' },
];

// Layout generator logic
function generateLayouts(panjang, lebar, jumlahKamar, ukuranRuangTamu) {
  const luasTanah = panjang * lebar;
  const luasBangunan = luasTanah * 0.6; // 60% coverage
  
  // Ukuran ruang tamu
  const ruangTamuSizes = {
    kecil: { w: 3, h: 3 },
    sedang: { w: 4, h: 4 },
    besar: { w: 5, h: 4 },
  };
  
  const ruangTamu = ruangTamuSizes[ukuranRuangTamu];
  const kamarSize = { w: 3, h: 3 }; // Standar kamar 3x3
  const kmSize = { w: 2, h: 2 }; // Kamar mandi
  const dapurSize = { w: 3, h: 2.5 }; // Dapur
  
  // Generate 3 layout variations
  const layouts = [];
  
  // Layout 1: Ruang tamu di depan, kamar di belakang
  layouts.push({
    id: 1,
    name: 'Layout Klasik',
    description: 'Ruang tamu di depan, kamar tidur di belakang',
    rooms: generateRoomsLayout1(panjang, lebar, jumlahKamar, ruangTamu, kamarSize, kmSize, dapurSize),
    totalArea: luasBangunan
  });
  
  // Layout 2: Ruang tamu di tengah (open plan)
  layouts.push({
    id: 2,
    name: 'Layout Modern',
    description: 'Open plan dengan ruang tamu di tengah',
    rooms: generateRoomsLayout2(panjang, lebar, jumlahKamar, ruangTamu, kamarSize, kmSize, dapurSize),
    totalArea: luasBangunan
  });
  
  // Layout 3: L-shape
  layouts.push({
    id: 3,
    name: 'Layout L-Shape',
    description: 'Bentuk L untuk pencahayaan optimal',
    rooms: generateRoomsLayout3(panjang, lebar, jumlahKamar, ruangTamu, kamarSize, kmSize, dapurSize),
    totalArea: luasBangunan
  });
  
  return layouts;
}

function generateRoomsLayout1(panjang, lebar, jumlahKamar, ruangTamu, kamarSize, kmSize, dapurSize) {
  const rooms = [];
  const scale = Math.min(panjang, lebar) / 12;
  
  // Ruang tamu di depan
  rooms.push({
    type: 'ruang-tamu',
    label: 'Ruang Tamu',
    x: 0.5,
    y: 0.5,
    w: ruangTamu.w * scale,
    h: ruangTamu.h * scale,
    color: '#3b82f6'
  });
  
  // Dapur di samping ruang tamu
  rooms.push({
    type: 'dapur',
    label: 'Dapur',
    x: ruangTamu.w * scale + 1,
    y: 0.5,
    w: dapurSize.w * scale,
    h: dapurSize.h * scale,
    color: '#f59e0b'
  });
  
  // Kamar-kamar di belakang
  for (let i = 0; i < jumlahKamar; i++) {
    rooms.push({
      type: 'kamar',
      label: `Kamar ${i + 1}`,
      x: (i % 2) * (kamarSize.w * scale + 0.5) + 0.5,
      y: ruangTamu.h * scale + 1,
      w: kamarSize.w * scale,
      h: kamarSize.h * scale,
      color: '#22c55e'
    });
  }
  
  // Kamar mandi
  rooms.push({
    type: 'km',
    label: 'KM/WC',
    x: (jumlahKamar <= 2 ? 2 : 0) * (kamarSize.w * scale) + 0.5,
    y: ruangTamu.h * scale + kamarSize.h * scale + 1.5,
    w: kmSize.w * scale,
    h: kmSize.h * scale,
    color: '#06b6d4'
  });
  
  return rooms;
}

function generateRoomsLayout2(panjang, lebar, jumlahKamar, ruangTamu, kamarSize, kmSize, dapurSize) {
  const rooms = [];
  const scale = Math.min(panjang, lebar) / 12;
  
  // Kamar di kiri
  for (let i = 0; i < Math.ceil(jumlahKamar / 2); i++) {
    rooms.push({
      type: 'kamar',
      label: `Kamar ${i + 1}`,
      x: 0.5,
      y: i * (kamarSize.h * scale + 0.5) + 0.5,
      w: kamarSize.w * scale,
      h: kamarSize.h * scale,
      color: '#22c55e'
    });
  }
  
  // Ruang tamu di tengah
  rooms.push({
    type: 'ruang-tamu',
    label: 'Ruang Tamu',
    x: kamarSize.w * scale + 1,
    y: 0.5,
    w: ruangTamu.w * scale,
    h: ruangTamu.h * scale,
    color: '#3b82f6'
  });
  
  // Dapur di belakang ruang tamu
  rooms.push({
    type: 'dapur',
    label: 'Dapur',
    x: kamarSize.w * scale + 1,
    y: ruangTamu.h * scale + 1,
    w: dapurSize.w * scale,
    h: dapurSize.h * scale,
    color: '#f59e0b'
  });
  
  // Kamar di kanan
  for (let i = Math.ceil(jumlahKamar / 2); i < jumlahKamar; i++) {
    rooms.push({
      type: 'kamar',
      label: `Kamar ${i + 1}`,
      x: kamarSize.w * scale + ruangTamu.w * scale + 1.5,
      y: (i - Math.ceil(jumlahKamar / 2)) * (kamarSize.h * scale + 0.5) + 0.5,
      w: kamarSize.w * scale,
      h: kamarSize.h * scale,
      color: '#22c55e'
    });
  }
  
  // KM
  rooms.push({
    type: 'km',
    label: 'KM/WC',
    x: kamarSize.w * scale + ruangTamu.w * scale + 1.5,
    y: ruangTamu.h * scale + 1,
    w: kmSize.w * scale,
    h: kmSize.h * scale,
    color: '#06b6d4'
  });
  
  return rooms;
}

function generateRoomsLayout3(panjang, lebar, jumlahKamar, ruangTamu, kamarSize, kmSize, dapurSize) {
  const rooms = [];
  const scale = Math.min(panjang, lebar) / 12;
  
  // Bagian horizontal L
  rooms.push({
    type: 'ruang-tamu',
    label: 'Ruang Tamu',
    x: 0.5,
    y: 0.5,
    w: ruangTamu.w * scale,
    h: ruangTamu.h * scale,
    color: '#3b82f6'
  });
  
  rooms.push({
    type: 'dapur',
    label: 'Dapur',
    x: ruangTamu.w * scale + 1,
    y: 0.5,
    w: dapurSize.w * scale,
    h: dapurSize.h * scale,
    color: '#f59e0b'
  });
  
  // Bagian vertikal L (kamar-kamar)
  for (let i = 0; i < jumlahKamar; i++) {
    rooms.push({
      type: 'kamar',
      label: `Kamar ${i + 1}`,
      x: 0.5,
      y: ruangTamu.h * scale + 1 + i * (kamarSize.h * scale * 0.8),
      w: kamarSize.w * scale,
      h: kamarSize.h * scale * 0.8,
      color: '#22c55e'
    });
  }
  
  // KM di ujung L
  rooms.push({
    type: 'km',
    label: 'KM/WC',
    x: kamarSize.w * scale + 1,
    y: ruangTamu.h * scale + 1,
    w: kmSize.w * scale,
    h: kmSize.h * scale,
    color: '#06b6d4'
  });
  
  return rooms;
}

// Room icons
const roomIcons = {
  'ruang-tamu': Sofa,
  'kamar': Bed,
  'km': Bath,
  'dapur': UtensilsCrossed,
  'garasi': Car,
};

export function LayoutPage() {
  const { layoutInput, setLayoutInput, layouts, setLayouts, clearLayouts } = useLayoutStore();
  const [errors, setErrors] = useState({});
  const [generating, setGenerating] = useState(false);
  
  const handleInputChange = (field, value) => {
    setLayoutInput({ ...layoutInput, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: null });
    }
  };
  
  const validateInputs = () => {
    const newErrors = {};
    
    if (!layoutInput.panjang || !validatePositiveNumber(layoutInput.panjang)) {
      newErrors.panjang = 'Masukkan panjang yang valid';
    }
    if (!layoutInput.lebar || !validatePositiveNumber(layoutInput.lebar)) {
      newErrors.lebar = 'Masukkan lebar yang valid';
    }
    
    const luas = calculateArea(layoutInput.panjang, layoutInput.lebar);
    if (luas && luas < 36) {
      newErrors.lebar = 'Luas minimal 36m² (6x6m)';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleGenerate = () => {
    if (!validateInputs()) return;
    
    setGenerating(true);
    
    setTimeout(() => {
      const panjang = parseFloat(layoutInput.panjang);
      const lebar = parseFloat(layoutInput.lebar);
      const jumlahKamar = parseInt(layoutInput.jumlahKamar);
      
      const generatedLayouts = generateLayouts(
        panjang, 
        lebar, 
        jumlahKamar, 
        layoutInput.ukuranRuangTamu
      );
      
      setLayouts(generatedLayouts);
      setGenerating(false);
    }, 1000);
  };
  
  const downloadLayout = useCallback((layout) => {
    // Create canvas and draw layout
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const padding = 40;
    const scale = 30;
    
    const panjang = parseFloat(layoutInput.panjang);
    const lebar = parseFloat(layoutInput.lebar);
    
    canvas.width = panjang * scale + padding * 2;
    canvas.height = lebar * scale + padding * 2 + 60;
    
    // Background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Title
    ctx.fillStyle = '#1e40af';
    ctx.font = 'bold 16px Inter, sans-serif';
    ctx.fillText(layout.name, padding, 25);
    
    ctx.fillStyle = '#64748b';
    ctx.font = '12px Inter, sans-serif';
    ctx.fillText(`${panjang}m x ${lebar}m | Luas: ${(panjang * lebar).toFixed(0)}m²`, padding, 45);
    
    // Draw boundary
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 2;
    ctx.strokeRect(padding, 60, panjang * scale, lebar * scale);
    
    // Draw rooms
    layout.rooms.forEach(room => {
      const x = padding + room.x * scale;
      const y = 60 + room.y * scale;
      const w = room.w * scale;
      const h = room.h * scale;
      
      // Room background
      ctx.fillStyle = room.color + '30';
      ctx.fillRect(x, y, w, h);
      
      // Room border
      ctx.strokeStyle = room.color;
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, w, h);
      
      // Room label
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 10px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(room.label, x + w / 2, y + h / 2 + 4);
    });
    
    // Footer
    ctx.fillStyle = '#94a3b8';
    ctx.font = '10px Inter, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('ProyekKita - Dibuat oleh Muhamad Reza Bahtiar', padding, canvas.height - 10);
    
    // Download
    const link = document.createElement('a');
    link.download = `layout-${layout.name.toLowerCase().replace(' ', '-')}.png`;
    link.href = canvas.toDataURL();
    link.click();
  }, [layoutInput.panjang, layoutInput.lebar]);

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <Header 
        title="Ide Layout Rumah" 
        subtitle="Generate denah rumah"
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
                <LayoutGrid size={20} className="text-primary-600" />
                <span className="font-semibold">Konfigurasi Layout</span>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Panjang Tanah"
                  type="number"
                  placeholder="0"
                  suffix="m"
                  value={layoutInput.panjang}
                  onChange={(e) => handleInputChange('panjang', e.target.value)}
                  error={errors.panjang}
                />
                <Input
                  label="Lebar Tanah"
                  type="number"
                  placeholder="0"
                  suffix="m"
                  value={layoutInput.lebar}
                  onChange={(e) => handleInputChange('lebar', e.target.value)}
                  error={errors.lebar}
                />
              </div>
              
              {layoutInput.panjang && layoutInput.lebar && 
                validatePositiveNumber(layoutInput.panjang) && 
                validatePositiveNumber(layoutInput.lebar) && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="p-3 bg-emerald-50 rounded-xl"
                >
                  <p className="text-sm text-emerald-800">
                    <span className="font-medium">Luas Tanah:</span>{' '}
                    <span className="font-bold">
                      {calculateArea(layoutInput.panjang, layoutInput.lebar)} m²
                    </span>
                  </p>
                </motion.div>
              )}
              
              <div className="grid grid-cols-2 gap-3">
                <Select
                  label="Jumlah Kamar"
                  value={layoutInput.jumlahKamar}
                  onChange={(e) => handleInputChange('jumlahKamar', e.target.value)}
                  options={kamarOptions}
                />
                <Select
                  label="Ruang Tamu"
                  value={layoutInput.ukuranRuangTamu}
                  onChange={(e) => handleInputChange('ukuranRuangTamu', e.target.value)}
                  options={roomSizeOptions}
                />
              </div>
              
              <div className="flex gap-3 pt-2">
                <Button 
                  variant="secondary" 
                  onClick={clearLayouts}
                  disabled={generating}
                >
                  Reset
                </Button>
                <Button 
                  onClick={handleGenerate} 
                  fullWidth
                  disabled={generating}
                >
                  {generating ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    />
                  ) : (
                    <>
                      <RefreshCw size={18} />
                      Generate Layout
                    </>
                  )}
                </Button>
              </div>
            </Card>
          </motion.div>
          
          {/* Generated Layouts */}
          <AnimatePresence mode="wait">
            {layouts.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                <h2 className="text-sm font-semibold text-muted px-1">
                  3 OPSI LAYOUT ({layoutInput.panjang}m x {layoutInput.lebar}m)
                </h2>
                
                {layouts.map((layout, index) => (
                  <motion.div
                    key={layout.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="overflow-hidden">
                      <div className="p-4 border-b border-border">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-bold text-foreground">{layout.name}</h3>
                            <p className="text-sm text-muted">{layout.description}</p>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => downloadLayout(layout)}
                          >
                            <Download size={16} />
                            Download
                          </Button>
                        </div>
                      </div>
                      
                      {/* Layout Preview */}
                      <div className="p-4 bg-surface-dark">
                        <div 
                          className="relative bg-white rounded-xl border-2 border-dashed border-border overflow-hidden"
                          style={{ 
                            aspectRatio: `${layoutInput.panjang} / ${layoutInput.lebar}`,
                            maxHeight: '300px'
                          }}
                        >
                          {layout.rooms.map((room, roomIndex) => {
                            const Icon = roomIcons[room.type] || Bed;
                            return (
                              <motion.div
                                key={roomIndex}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.1 + roomIndex * 0.05 }}
                                className="absolute rounded-lg flex flex-col items-center justify-center p-1"
                                style={{
                                  left: `${(room.x / parseFloat(layoutInput.panjang)) * 100}%`,
                                  top: `${(room.y / parseFloat(layoutInput.lebar)) * 100}%`,
                                  width: `${(room.w / parseFloat(layoutInput.panjang)) * 100}%`,
                                  height: `${(room.h / parseFloat(layoutInput.lebar)) * 100}%`,
                                  backgroundColor: room.color + '20',
                                  border: `2px solid ${room.color}`,
                                }}
                              >
                                <Icon size={16} style={{ color: room.color }} />
                                <span 
                                  className="text-[8px] font-medium text-center mt-0.5 leading-tight"
                                  style={{ color: room.color }}
                                >
                                  {room.label}
                                </span>
                              </motion.div>
                            );
                          })}
                        </div>
                      </div>
                      
                      {/* Room Legend */}
                      <div className="p-3 flex flex-wrap gap-2">
                        {layout.rooms.map((room, i) => (
                          <span 
                            key={i}
                            className="text-xs px-2 py-1 rounded-full"
                            style={{ 
                              backgroundColor: room.color + '20',
                              color: room.color 
                            }}
                          >
                            {room.label}
                          </span>
                        ))}
                      </div>
                    </Card>
                  </motion.div>
                ))}
                
                <Alert variant="info">
                  Layout ini hanya sebagai referensi awal. Konsultasikan dengan arsitek untuk desain final.
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
