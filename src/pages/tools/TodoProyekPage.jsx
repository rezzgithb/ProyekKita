import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ListTodo, Plus, Trash2, Check, Calendar, Users, RotateCcw, ChevronDown, ChevronRight, X } from 'lucide-react';
import { Header } from '../../components/navigation/Header';
import { Card, Button, Input, Alert, ConfirmModal } from '../../components/ui';
import { useTodoStore } from '../../store';
import { validatePositiveNumber } from '../../utils/helpers';

export function TodoProyekPage() {
  const { todoConfig, setTodoConfig, days, generateDays, addTask, toggleTask, deleteTask, resetTodo } = useTodoStore();
  const [input, setInput] = useState({
    jumlahTukang: todoConfig.jumlahTukang || '',
    estimasiHari: todoConfig.estimasiHari || ''
  });
  const [errors, setErrors] = useState({});
  const [newTaskText, setNewTaskText] = useState({});
  const [expandedDays, setExpandedDays] = useState({});
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  
  const handleInputChange = (field, value) => {
    setInput({ ...input, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: null });
    }
  };
  
  const validateInputs = () => {
    const newErrors = {};
    if (!input.jumlahTukang || !validatePositiveNumber(input.jumlahTukang)) {
      newErrors.jumlahTukang = 'Masukkan jumlah yang valid';
    }
    if (!input.estimasiHari || !validatePositiveNumber(input.estimasiHari)) {
      newErrors.estimasiHari = 'Masukkan jumlah hari yang valid';
    }
    if (parseInt(input.estimasiHari) > 365) {
      newErrors.estimasiHari = 'Maksimal 365 hari';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleGenerate = () => {
    if (!validateInputs()) return;
    
    const config = {
      jumlahTukang: parseInt(input.jumlahTukang),
      estimasiHari: parseInt(input.estimasiHari)
    };
    
    setTodoConfig(config);
    generateDays(config.estimasiHari);
    
    // Expand first day by default
    setExpandedDays({ 0: true });
  };
  
  const handleAddTask = (dayIndex) => {
    const text = newTaskText[dayIndex]?.trim();
    if (!text) return;
    
    addTask(dayIndex, text);
    setNewTaskText({ ...newTaskText, [dayIndex]: '' });
  };
  
  const toggleExpand = (dayIndex) => {
    setExpandedDays({ ...expandedDays, [dayIndex]: !expandedDays[dayIndex] });
  };
  
  const handleReset = () => {
    resetTodo();
    setInput({ jumlahTukang: '', estimasiHari: '' });
    setExpandedDays({});
    setShowResetConfirm(false);
  };
  
  const totalTasks = days.reduce((sum, d) => sum + d.tasks.length, 0);
  const completedTasks = days.reduce((sum, d) => sum + d.tasks.filter(t => t.completed).length, 0);
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <div className="flex flex-col h-full">
      <Header 
        title="To-Do Proyek" 
        subtitle={days.length > 0 ? `${completedTasks}/${totalTasks} task selesai` : 'Atur jadwal kerja'}
        rightAction={
          days.length > 0 && (
            <motion.button
              onClick={() => setShowResetConfirm(true)}
              className="p-2 rounded-xl hover:bg-red-50 active:bg-red-100 transition-colors"
              whileTap={{ scale: 0.9 }}
            >
              <RotateCcw size={20} className="text-danger" />
            </motion.button>
          )
        }
      />
      
      <div className="flex-1 overflow-y-auto pb-4">
        <div className="max-w-lg mx-auto px-4 py-4 space-y-4">
          {/* Setup Form */}
          {days.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="p-4 space-y-4">
                <div className="flex items-center gap-2">
                  <ListTodo size={20} className="text-primary-600" />
                  <span className="font-semibold text-foreground">Setup Proyek</span>
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
                    label="Estimasi Hari"
                    type="number"
                    placeholder="0"
                    suffix="hari"
                    value={input.estimasiHari}
                    onChange={(e) => handleInputChange('estimasiHari', e.target.value)}
                    error={errors.estimasiHari}
                  />
                </div>
                
                <Button onClick={handleGenerate} fullWidth>
                  <Calendar size={18} />
                  Generate Jadwal Kerja
                </Button>
              </Card>
              
              <Alert variant="info" className="mt-4">
                Generate jadwal kerja harian untuk memantau progres proyek Anda.
              </Alert>
            </motion.div>
          )}
          
          {/* Progress Bar */}
          {days.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users size={18} className="text-primary-600" />
                    <span className="text-sm font-medium text-foreground">{todoConfig.jumlahTukang} Tukang</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={18} className="text-emerald-500" />
                    <span className="text-sm font-medium text-foreground">{days.length} Hari</span>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted">Progress</span>
                    <span className="font-medium text-foreground">{progress.toFixed(0)}%</span>
                  </div>
                  <div className="h-3 bg-surface-dark rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-primary-500 to-emerald-500 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.5, ease: 'easeOut' }}
                    />
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
          
          {/* Days List */}
          {days.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-3"
            >
              {days.map((day, dayIndex) => {
                const dayCompleted = day.tasks.filter(t => t.completed).length;
                const dayTotal = day.tasks.length;
                const isExpanded = expandedDays[dayIndex];
                const isDayComplete = dayTotal > 0 && dayCompleted === dayTotal;
                
                return (
                  <motion.div
                    key={dayIndex}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: dayIndex * 0.03 }}
                  >
                    <Card className={`overflow-hidden ${isDayComplete ? 'ring-2 ring-emerald-500' : ''}`}>
                      {/* Day Header */}
                      <motion.button
                        onClick={() => toggleExpand(dayIndex)}
                        className="w-full p-4 flex items-center justify-between hover:bg-surface-dark transition-colors"
                        whileTap={{ scale: 0.99 }}
                      >
                        <div className="flex items-center gap-3">
                          {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                          <div className="text-left">
                            <h3 className={`font-bold ${isDayComplete ? 'text-emerald-600' : 'text-foreground'}`}>
                              Day {day.day}
                            </h3>
                            <p className="text-xs text-muted">
                              {dayTotal === 0 ? 'Belum ada task' : `${dayCompleted}/${dayTotal} selesai`}
                            </p>
                          </div>
                        </div>
                        {isDayComplete && (
                          <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                            <Check size={18} className="text-emerald-600" />
                          </div>
                        )}
                      </motion.button>
                      
                      {/* Day Content */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="px-4 pb-4 space-y-2">
                              {/* Tasks */}
                              {day.tasks.map((task) => (
                                <motion.div
                                  key={task.id}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  className={`flex items-center gap-3 p-3 rounded-xl ${
                                    task.completed ? 'bg-emerald-50' : 'bg-surface-dark'
                                  }`}
                                >
                                  <motion.button
                                    onClick={() => toggleTask(dayIndex, task.id)}
                                    className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-colors ${
                                      task.completed 
                                        ? 'bg-emerald-500 border-emerald-500' 
                                        : 'border-border hover:border-primary-500'
                                    }`}
                                    whileTap={{ scale: 0.9 }}
                                  >
                                    {task.completed && <Check size={14} className="text-white" />}
                                  </motion.button>
                                  <span className={`flex-1 text-sm ${
                                    task.completed ? 'text-muted line-through' : 'text-foreground'
                                  }`}>
                                    {task.text}
                                  </span>
                                  <motion.button
                                    onClick={() => deleteTask(dayIndex, task.id)}
                                    className="p-1.5 rounded-lg hover:bg-red-100 active:bg-red-200 transition-colors"
                                    whileTap={{ scale: 0.9 }}
                                  >
                                    <X size={14} className="text-danger" />
                                  </motion.button>
                                </motion.div>
                              ))}
                              
                              {/* Add Task Input */}
                              <div className="flex gap-2 pt-2">
                                <input
                                  type="text"
                                  placeholder="Tambah task baru..."
                                  value={newTaskText[dayIndex] || ''}
                                  onChange={(e) => setNewTaskText({ ...newTaskText, [dayIndex]: e.target.value })}
                                  onKeyDown={(e) => e.key === 'Enter' && handleAddTask(dayIndex)}
                                  className="flex-1 px-3 py-2 rounded-xl bg-surface border-2 border-border focus:border-primary-500 transition-colors text-sm text-foreground placeholder:text-muted/60"
                                />
                                <Button 
                                  size="icon"
                                  onClick={() => handleAddTask(dayIndex)}
                                  disabled={!newTaskText[dayIndex]?.trim()}
                                >
                                  <Plus size={18} />
                                </Button>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </div>
      </div>
      
      {/* Reset Confirmation */}
      <ConfirmModal
        isOpen={showResetConfirm}
        onClose={() => setShowResetConfirm(false)}
        onConfirm={handleReset}
        title="Reset To-Do"
        message="Yakin ingin mereset semua jadwal dan task? Tindakan ini tidak dapat dibatalkan."
        confirmText="Reset"
      />
    </div>
  );
}
