import { motion } from 'framer-motion';
import { Calculator, LayoutGrid, FileText, DollarSign, Users, ListTodo, ArrowRight, Hammer } from 'lucide-react';
import { Card } from '../../components/ui';
import { useNavigationStore, useNotesStore, useTodoStore } from '../../store';
import { getGreeting } from '../../utils/helpers';

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
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="flex-1 overflow-y-auto pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white pt-safe">
        <div className="max-w-lg mx-auto px-4 pt-6 pb-8">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <p className="text-primary-200 text-sm font-medium">{getGreeting()}</p>
            <h1 className="text-2xl font-bold mt-1 flex items-center gap-2">
              <Hammer className="w-7 h-7" />
              ProyekKita
            </h1>
            <p className="text-primary-200 text-sm mt-2">
              Kelola proyek bangunan dengan mudah
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 -mt-4 space-y-5">
        {/* Quick Stats */}
        {(notes.length > 0 || totalTasks > 0) && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <Card className="p-4">
              <div className="flex gap-4">
                {notes.length > 0 && (
                  <motion.div 
                    variants={itemVariants}
                    className="flex-1 text-center p-3 rounded-xl bg-amber-50"
                  >
                    <p className="text-2xl font-bold text-amber-600">{notes.length}</p>
                    <p className="text-xs text-amber-700 mt-0.5">Catatan</p>
                  </motion.div>
                )}
                {totalTasks > 0 && (
                  <motion.div 
                    variants={itemVariants}
                    className="flex-1 text-center p-3 rounded-xl bg-emerald-50"
                  >
                    <p className="text-2xl font-bold text-emerald-600">{completedTasks}/{totalTasks}</p>
                    <p className="text-xs text-emerald-700 mt-0.5">Task Selesai</p>
                  </motion.div>
                )}
                {todoConfig.jumlahTukang > 0 && (
                  <motion.div 
                    variants={itemVariants}
                    className="flex-1 text-center p-3 rounded-xl bg-blue-50"
                  >
                    <p className="text-2xl font-bold text-blue-600">{todoConfig.jumlahTukang}</p>
                    <p className="text-xs text-blue-700 mt-0.5">Tukang</p>
                  </motion.div>
                )}
              </div>
            </Card>
          </motion.div>
        )}

        {/* Quick Actions */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <h2 className="text-sm font-semibold text-muted mb-3 px-1">FITUR UTAMA</h2>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <motion.div key={action.id} variants={itemVariants}>
                  <Card 
                    hover 
                    onClick={() => setPage(action.page)}
                    className="p-4 flex flex-col h-full"
                  >
                    <div className={`w-12 h-12 ${action.color} rounded-xl flex items-center justify-center mb-3`}>
                      <Icon size={24} className="text-white" />
                    </div>
                    <h3 className="font-bold text-foreground">{action.label}</h3>
                    <p className="text-xs text-muted mt-1">{action.desc}</p>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        {/* Tools Preview */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="flex items-center justify-between mb-3 px-1">
            <h2 className="text-sm font-semibold text-muted">TOOLS LAINNYA</h2>
            <motion.button 
              onClick={() => setPage('tools')}
              className="text-xs text-primary-600 font-medium flex items-center gap-1"
              whileTap={{ scale: 0.95 }}
            >
              Lihat semua <ArrowRight size={14} />
            </motion.button>
          </div>
          <Card className="divide-y divide-border">
            {toolsPreview.map((tool, index) => {
              const Icon = tool.icon;
              return (
                <motion.button
                  key={tool.label}
                  variants={itemVariants}
                  onClick={() => setPage('tools')}
                  className="w-full flex items-center gap-3 p-4 hover:bg-surface-dark active:bg-border transition-colors first:rounded-t-2xl last:rounded-b-2xl"
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="w-10 h-10 bg-surface-dark rounded-xl flex items-center justify-center">
                    <Icon size={20} className={tool.color} />
                  </div>
                  <span className="font-medium text-foreground">{tool.label}</span>
                  <ArrowRight size={16} className="text-muted ml-auto" />
                </motion.button>
              );
            })}
          </Card>
        </motion.section>

        {/* Developer Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center py-6"
        >
          <p className="text-xs text-muted">
            Dibuat oleh <span className="font-medium text-foreground">Muhamad Reza Bahtiar</span>
          </p>
          <p className="text-xs text-muted mt-1">v1.0.0</p>
        </motion.div>
      </div>
    </div>
  );
}
