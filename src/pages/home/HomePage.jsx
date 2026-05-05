import { motion } from 'framer-motion';
import { Calculator, LayoutGrid, FileText, DollarSign, Users, ListTodo, ArrowRight, Hammer } from 'lucide-react';
import { Card } from '../../components/ui';
import { useNavigationStore, useNotesStore, useTodoStore } from '../../store';

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Selamat Pagi';
  if (hour < 15) return 'Selamat Siang';
  if (hour < 18) return 'Selamat Sore';
  return 'Selamat Malam';
}

const quickActions = [
  { 
    id: 'budget', 
    icon: Calculator, 
    label: 'Hitung Budget',
    desc: 'Estimasi biaya bangunan',
    color: 'bg-blue-500',
    page: 'budget'
  },
  { 
    id: 'layout', 
    icon: LayoutGrid, 
    label: 'Ide Layout',
    desc: 'Generate denah rumah',
    color: 'bg-emerald-500',
    page: 'layout'
  },
  { 
    id: 'catatan', 
    icon: FileText, 
    label: 'Catatan',
    desc: 'Catat progres proyek',
    color: 'bg-amber-500',
    page: 'catatan'
  },
  { 
    id: 'harga', 
    icon: DollarSign, 
    label: 'Harga Bahan',
    desc: 'List harga terbaru',
    color: 'bg-purple-500',
    page: 'tools'
  },
];

const toolsPreview = [
  { icon: Users, label: 'Kalkulator Upah', color: 'text-blue-500' },
  { icon: ListTodo, label: 'To-Do Proyek', color: 'text-emerald-500' },
  { icon: DollarSign, label: 'Harga Bahan', color: 'text-amber-500' },
];

export function HomePage() {
  const { setPage } = useNavigationStore();
  const { notes } = useNotesStore();
  const { days, todoConfig } = useTodoStore();
  
  const totalTasks = days.reduce((sum, d) => sum + d.tasks.length, 0);
  const completedTasks = days.reduce((sum, d) => sum + d.tasks.filter(t => t.completed).length, 0);

  const handleNavigate = (page) => {
    setPage(page);
  };

  return (
    <div className="page-wrapper">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white flex-shrink-0">
        <div className="max-w-lg mx-auto px-4 pt-6 pb-8">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <p className="text-blue-200 text-sm font-medium">{getGreeting()}</p>
            <h1 className="text-2xl font-bold mt-1 flex items-center gap-2">
              <Hammer className="w-7 h-7" />
              ProyekKita
            </h1>
            <p className="text-blue-200 text-sm mt-2">
              Kelola proyek bangunan dengan mudah
            </p>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="page-scroll pb-nav">
        <div className="max-w-lg mx-auto px-4 -mt-4 space-y-5">
          
          {/* Quick Stats */}
          {(notes.length > 0 || totalTasks > 0 || todoConfig.jumlahTukang > 0) && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              <Card className="p-4">
                <div className="flex gap-3">
                  {notes.length > 0 && (
                    <div className="flex-1 text-center p-3 rounded-xl bg-amber-50">
                      <p className="text-2xl font-bold text-amber-600">{notes.length}</p>
                      <p className="text-xs text-amber-700 mt-0.5">Catatan</p>
                    </div>
                  )}
                  {totalTasks > 0 && (
                    <div className="flex-1 text-center p-3 rounded-xl bg-emerald-50">
                      <p className="text-2xl font-bold text-emerald-600">{completedTasks}/{totalTasks}</p>
                      <p className="text-xs text-emerald-700 mt-0.5">Task Selesai</p>
                    </div>
                  )}
                  {todoConfig.jumlahTukang > 0 && (
                    <div className="flex-1 text-center p-3 rounded-xl bg-blue-50">
                      <p className="text-2xl font-bold text-blue-600">{todoConfig.jumlahTukang}</p>
                      <p className="text-xs text-blue-700 mt-0.5">Tukang</p>
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>
          )}

          {/* Quick Actions */}
          <section>
            <h2 className="text-xs font-semibold text-slate-500 mb-3 px-1 uppercase tracking-wide">Fitur Utama</h2>
            <div className="grid grid-cols-2 gap-3">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <motion.div 
                    key={action.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                  >
                    <Card 
                      interactive
                      onClick={() => handleNavigate(action.page)}
                      className="p-4 flex flex-col h-full text-left"
                    >
                      <div className={`w-12 h-12 ${action.color} rounded-xl flex items-center justify-center mb-3`}>
                        <Icon size={24} className="text-white" />
                      </div>
                      <h3 className="font-bold text-slate-800">{action.label}</h3>
                      <p className="text-xs text-slate-500 mt-1">{action.desc}</p>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </section>

          {/* Tools Preview */}
          <section>
            <div className="flex items-center justify-between mb-3 px-1">
              <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Tools Lainnya</h2>
              <button 
                onClick={() => handleNavigate('tools')}
                className="text-xs text-blue-600 font-medium flex items-center gap-1 active:opacity-70"
              >
                Lihat semua <ArrowRight size={14} />
              </button>
            </div>
            <Card className="overflow-hidden">
              {toolsPreview.map((tool, index) => {
                const Icon = tool.icon;
                return (
                  <button
                    key={tool.label}
                    onClick={() => handleNavigate('tools')}
                    className="w-full flex items-center gap-3 p-4 active:bg-slate-50 border-b border-slate-100 last:border-0 text-left"
                  >
                    <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
                      <Icon size={20} className={tool.color} />
                    </div>
                    <span className="font-medium text-slate-800 flex-1">{tool.label}</span>
                    <ArrowRight size={16} className="text-slate-400" />
                  </button>
                );
              })}
            </Card>
          </section>

          {/* Developer Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center py-6"
          >
            <p className="text-xs text-slate-400">
              Dibuat oleh <span className="font-medium text-slate-600">Muhamad Reza Bahtiar</span>
            </p>
            <p className="text-xs text-slate-400 mt-1">v1.0.0</p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
