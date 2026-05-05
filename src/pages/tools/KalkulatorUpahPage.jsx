import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Calculator, Briefcase, Info } from 'lucide-react';
import { Header } from '../../components/navigation/Header';
import { Card, Button, Input, Select, Alert } from '../../components/ui';
import { formatRupiah, validatePositiveNumber } from '../../utils/helpers';

const UPAH_HARIAN = {
  tukang: 180000,
  kenek: 120000,
  mandor: 250000,
};

const UPAH_BORONGAN = {
  pondasiPerM: 150000,
  dindingPerM2: 85000,
  plafonPerM2: 65000,
  keramikPerM2: 45000,
  catPerM2: 25000,
  atapPerM2: 120000,
};

const sistemOptions = [
  { value: 'harian', label: 'Sistem Harian' },
  { value: 'borongan', label: 'Sistem Borongan' },
];

const pekerjaanOptions = [
  { value: 'pondasi', label: 'Pondasi (per meter lari)', harga: UPAH_BORONGAN.pondasiPerM },
  { value: 'dinding', label: 'Pasang Dinding (per m2)', harga: UPAH_BORONGAN.dindingPerM2 },
  { value: 'plafon', label: 'Plafon (per m2)', harga: UPAH_BORONGAN.plafonPerM2 },
  { value: 'keramik', label: 'Pasang Keramik (per m2)', harga: UPAH_BORONGAN.keramikPerM2 },
  { value: 'cat', label: 'Pengecatan (per m2)', harga: UPAH_BORONGAN.catPerM2 },
  { value: 'atap', label: 'Atap (per m2)', harga: UPAH_BORONGAN.atapPerM2 },
];

export function KalkulatorUpahPage({ onBack }) {
  const [sistem, setSistem] = useState('harian');
  const [input, setInput] = useState({
    jumlahTukang: '',
    jumlahKenek: '',
    jumlahHari: '',
    jenisPekerjaan: 'dinding',
    volume: '',
  });
  const [result, setResult] = useState(null);
  const [errors, setErrors] = useState({});
  
  const handleInputChange = (field, value) => {
    setInput({ ...input, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: null });
    }
  };
  
  const validateInputs = () => {
    const newErrors = {};
    
    if (sistem === 'harian') {
      if (!input.jumlahTukang && !input.jumlahKenek) {
        newErrors.jumlahTukang = 'Minimal isi salah satu';
      }
      if (!input.jumlahHari || !validatePositiveNumber(input.jumlahHari)) {
        newErrors.jumlahHari = 'Masukkan jumlah hari yang valid';
      }
    } else {
      if (!input.volume || !validatePositiveNumber(input.volume)) {
        newErrors.volume = 'Masukkan volume yang valid';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const calculate = () => {
    if (!validateInputs()) return;
    
    if (sistem === 'harian') {
      const jumlahTukang = parseInt(input.jumlahTukang) || 0;
      const jumlahKenek = parseInt(input.jumlahKenek) || 0;
      const jumlahHari = parseInt(input.jumlahHari);
      
      const upahTukang = jumlahTukang * UPAH_HARIAN.tukang * jumlahHari;
      const upahKenek = jumlahKenek * UPAH_HARIAN.kenek * jumlahHari;
      const total = upahTukang + upahKenek;
      
      setResult({
        sistem: 'harian',
        details: [
          { label: `Tukang (${jumlahTukang} orang x ${jumlahHari} hari)`, value: upahTukang },
          { label: `Kenek (${jumlahKenek} orang x ${jumlahHari} hari)`, value: upahKenek },
        ].filter(d => d.value > 0),
        total,
        perHari: total / jumlahHari
      });
    } else {
      const pekerjaan = pekerjaanOptions.find(p => p.value === input.jenisPekerjaan);
      const volume = parseFloat(input.volume);
      const total = pekerjaan.harga * volume;
      
      setResult({
        sistem: 'borongan',
        details: [
          { label: pekerjaan.label, value: pekerjaan.harga, suffix: '/unit' },
          { label: 'Volume', value: volume, suffix: ' unit' },
        ],
        total
      });
    }
  };
  
  const resetForm = () => {
    setInput({
      jumlahTukang: '',
      jumlahKenek: '',
      jumlahHari: '',
      jenisPekerjaan: 'dinding',
      volume: '',
    });
    setResult(null);
    setErrors({});
  };

  return (
    <div className="page-wrapper">
      <Header 
        title="Kalkulator Upah" 
        subtitle="Estimasi biaya tukang"
        showBack
        onBack={onBack}
      />
      
      <div className="page-scroll pb-nav">
        <div className="max-w-lg mx-auto px-4 py-4 space-y-4">
          {/* System Selection */}
          <Card className="p-4 space-y-4">
            <div className="flex items-center gap-2">
              <Calculator size={20} className="text-blue-600" />
              <span className="font-semibold text-slate-800">Pilih Sistem Upah</span>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              {sistemOptions.map(opt => (
                <button
                  type="button"
                  key={opt.value}
                  onClick={() => {
                    setSistem(opt.value);
                    setResult(null);
                  }}
                  className={`p-3 rounded-xl border-2 text-center font-medium transition-colors ${
                    sistem === opt.value
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-slate-200 bg-white text-slate-500 active:border-blue-300'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </Card>
          
          {/* Input Form */}
          <Card className="p-4 space-y-4">
            <AnimatePresence mode="wait">
              {sistem === 'harian' ? (
                <motion.div
                  key="harian"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-4"
                >
                  <div className="flex items-center gap-2">
                    <Users size={20} className="text-blue-500" />
                    <span className="font-semibold text-slate-800">Sistem Harian</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      label="Jumlah Tukang"
                      type="number"
                      placeholder="0"
                      suffix="orang"
                      value={input.jumlahTukang}
                      onChange={(e) => handleInputChange('jumlahTukang', e.target.value)}
                      error={errors.jumlahTukang}
                    />
                    <Input
                      label="Jumlah Kenek"
                      type="number"
                      placeholder="0"
                      suffix="orang"
                      value={input.jumlahKenek}
                      onChange={(e) => handleInputChange('jumlahKenek', e.target.value)}
                    />
                  </div>
                  
                  <Input
                    label="Jumlah Hari Kerja"
                    type="number"
                    placeholder="0"
                    suffix="hari"
                    value={input.jumlahHari}
                    onChange={(e) => handleInputChange('jumlahHari', e.target.value)}
                    error={errors.jumlahHari}
                  />
                  
                  <div className="p-3 bg-slate-100 rounded-xl space-y-1">
                    <p className="text-xs text-slate-500">Standar upah harian (Bogor, Apr 2026):</p>
                    <p className="text-sm"><span className="text-slate-800 font-medium">Tukang:</span> {formatRupiah(UPAH_HARIAN.tukang)}/hari</p>
                    <p className="text-sm"><span className="text-slate-800 font-medium">Kenek:</span> {formatRupiah(UPAH_HARIAN.kenek)}/hari</p>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="borongan"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-4"
                >
                  <div className="flex items-center gap-2">
                    <Briefcase size={20} className="text-emerald-500" />
                    <span className="font-semibold text-slate-800">Sistem Borongan</span>
                  </div>
                  
                  <Select
                    label="Jenis Pekerjaan"
                    value={input.jenisPekerjaan}
                    onChange={(e) => handleInputChange('jenisPekerjaan', e.target.value)}
                    options={pekerjaanOptions.map(p => ({ value: p.value, label: `${p.label} - ${formatRupiah(p.harga)}` }))}
                  />
                  
                  <Input
                    label="Volume Pekerjaan"
                    type="number"
                    placeholder="0"
                    suffix={input.jenisPekerjaan === 'pondasi' ? 'meter' : 'm2'}
                    value={input.volume}
                    onChange={(e) => handleInputChange('volume', e.target.value)}
                    error={errors.volume}
                  />
                </motion.div>
              )}
            </AnimatePresence>
            
            <div className="flex gap-3 pt-2">
              <Button variant="secondary" onClick={resetForm}>
                Reset
              </Button>
              <Button onClick={calculate} fullWidth>
                <Calculator size={18} />
                Hitung Upah
              </Button>
            </div>
          </Card>
          
          {/* Result */}
          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Card className="p-4 space-y-4">
                  <div className="flex items-center gap-2">
                    <Info size={20} className="text-blue-600" />
                    <span className="font-semibold text-slate-800">Hasil Perhitungan</span>
                  </div>
                  
                  <div className="space-y-2">
                    {result.details.map((detail, i) => (
                      <div key={i} className="flex justify-between text-sm">
                        <span className="text-slate-500">{detail.label}</span>
                        <span className="font-medium text-slate-800">
                          {detail.suffix && !detail.suffix.includes('unit') 
                            ? formatRupiah(detail.value) + detail.suffix
                            : detail.suffix 
                              ? detail.value.toLocaleString('id-ID') + detail.suffix
                              : formatRupiah(detail.value)
                          }
                        </span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="pt-3 border-t border-slate-200">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-800">Total Upah</span>
                      <span className="font-bold text-xl text-blue-600">
                        {formatRupiah(result.total)}
                      </span>
                    </div>
                    {result.perHari && (
                      <p className="text-sm text-slate-500 mt-1">
                        Rata-rata {formatRupiah(result.perHari)}/hari
                      </p>
                    )}
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
          
          <Alert variant="info">
            Harga upah dapat bervariasi tergantung lokasi, tingkat kesulitan, dan negosiasi.
          </Alert>
        </div>
      </div>
    </div>
  );
}
