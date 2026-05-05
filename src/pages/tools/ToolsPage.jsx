import { useState } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, Users, ListTodo, ChevronRight, ArrowLeft } from 'lucide-react';
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
  },
  {
    id: 'upah',
    icon: Users,
    label: 'Kalkulator Upah',
    desc: 'Hitung estimasi upah tukang',
    color: 'bg-blue-500',
  },
  {
    id: 'todo',
    icon: ListTodo,
    label: 'To-Do Proyek',
    desc: 'Kelola jadwal kerja harian',
    color: 'bg-emerald-500',
  },
];

export function ToolsPage() {
  const [activeTool, setActiveTool] = useState(null);
  
  const handleToolClick = (toolId) => {
    setActiveTool(toolId);
  };

  const handleBack = () => {
    setActiveTool(null);
  };
  
  // Render sub-page based on active tool
  if (activeTool === 'harga') {
    return <HargaBahanPage onBack={handleBack} />;
  }
  if (activeTool === 'upah') {
    return <KalkulatorUpahPage onBack={handleBack} />;
  }
  if (activeTool === 'todo') {
    return <TodoProyekPage onBack={handleBack} />;
  }

  return (
    <div className="page-wrapper">
      <Header title="Tools" subtitle="Alat bantu proyek" />
      
      <div className="page-scroll pb-nav">
        <div className="max-w-lg mx-auto px-4 py-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-3"
          >
            {toolsList.map((tool, index) => {
              const Icon = tool.icon;
              return (
                <motion.div 
                  key={tool.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08 }}
                >
                  <Card
                    interactive
                    onClick={() => handleToolClick(tool.id)}
                    className="p-4 flex items-center gap-4 text-left"
                  >
                    <div className={`w-14 h-14 ${tool.color} rounded-2xl flex items-center justify-center flex-shrink-0`}>
                      <Icon size={28} className="text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-slate-800">{tool.label}</h3>
                      <p className="text-sm text-slate-500 mt-0.5">{tool.desc}</p>
                    </div>
                    <ChevronRight size={20} className="text-slate-400 flex-shrink-0" />
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
              <p className="text-2xl font-bold text-blue-600">20+</p>
              <p className="text-xs text-slate-500 mt-1">Jenis Bahan</p>
            </Card>
            <Card className="p-4 text-center">
              <p className="text-2xl font-bold text-emerald-600">Bogor</p>
              <p className="text-xs text-slate-500 mt-1">Area Harga</p>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
