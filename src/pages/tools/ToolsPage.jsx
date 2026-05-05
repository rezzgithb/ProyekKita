import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DollarSign, Users, ListTodo, ChevronRight } from 'lucide-react';
import { Header } from '../../components/navigation/Header';
import { Card } from '../../components/ui';
import { HargaBahanPage } from './HargaBahanPage';
import { KalkulatorUpahPage } from './KalkulatorUpahPage';
import { TodoProyekPage } from './TodoProyekPage';

const toolsList = [
  {
    id: 'harga',
    icon: DollarSign,
    label: 'Harga Bahan',
    desc: 'List harga bahan area Bogor',
    color: 'bg-amber-500',
    colorLight: 'bg-amber-100',
    colorText: 'text-amber-600'
  },
  {
    id: 'upah',
    icon: Users,
    label: 'Kalkulator Upah',
    desc: 'Hitung estimasi upah tukang',
    color: 'bg-blue-500',
    colorLight: 'bg-blue-100',
    colorText: 'text-blue-600'
  },
  {
    id: 'todo',
    icon: ListTodo,
    label: 'To-Do Proyek',
    desc: 'Kelola jadwal kerja harian',
    color: 'bg-emerald-500',
    colorLight: 'bg-emerald-100',
    colorText: 'text-emerald-600'
  },
];

export function ToolsPage() {
  const [activeTool, setActiveTool] = useState(null);
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0 }
  };
  
  // Render sub-page based on active tool
  if (activeTool) {
    return (
      <div className="flex-1 flex flex-col overflow-hidden">
        {activeTool === 'harga' && <HargaBahanPage />}
        {activeTool === 'upah' && <KalkulatorUpahPage />}
        {activeTool === 'todo' && <TodoProyekPage />}
        
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => setActiveTool(null)}
          className="fixed bottom-24 left-4 right-4 max-w-lg mx-auto bg-surface border-2 border-border rounded-xl py-3 font-semibold text-foreground shadow-lg hover:bg-surface-dark transition-colors"
          whileTap={{ scale: 0.98 }}
        >
          Kembali ke Tools
        </motion.button>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <Header 
        title="Tools" 
        subtitle="Alat bantu proyek"
      />
      
      <div className="flex-1 overflow-y-auto pb-24">
        <div className="max-w-lg mx-auto px-4 py-4">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-3"
          >
            {toolsList.map((tool) => {
              const Icon = tool.icon;
              return (
                <motion.div key={tool.id} variants={itemVariants}>
                  <Card
                    hover
                    onClick={() => setActiveTool(tool.id)}
                    className="p-4 flex items-center gap-4"
                  >
                    <div className={`w-14 h-14 ${tool.color} rounded-2xl flex items-center justify-center flex-shrink-0`}>
                      <Icon size={28} className="text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-foreground">{tool.label}</h3>
                      <p className="text-sm text-muted mt-0.5">{tool.desc}</p>
                    </div>
                    <ChevronRight size={20} className="text-muted flex-shrink-0" />
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
          
          {/* Quick Info Cards */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-6 grid grid-cols-2 gap-3"
          >
            <Card className="p-4 text-center">
              <p className="text-2xl font-bold text-primary-600">20+</p>
              <p className="text-xs text-muted mt-1">Jenis Bahan</p>
            </Card>
            <Card className="p-4 text-center">
              <p className="text-2xl font-bold text-emerald-600">Bogor</p>
              <p className="text-xs text-muted mt-1">Area Harga</p>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
