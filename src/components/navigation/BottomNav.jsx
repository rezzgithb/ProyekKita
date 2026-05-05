import { motion } from 'framer-motion';
import { Home, Calculator, LayoutGrid, FileText, Wrench } from 'lucide-react';
import { useNavigationStore } from '../../store';

const navItems = [
  { id: 'home', icon: Home, label: 'Home' },
  { id: 'budget', icon: Calculator, label: 'Budget' },
  { id: 'layout', icon: LayoutGrid, label: 'Layout' },
  { id: 'catatan', icon: FileText, label: 'Catatan' },
  { id: 'tools', icon: Wrench, label: 'Tools' },
];

export function BottomNav() {
  const { currentPage, setPage } = useNavigationStore();

  const handleNavClick = (e, pageId) => {
    e.stopPropagation();
    setPage(pageId);
  };

  return (
    <nav className="flex-shrink-0 bg-white border-t border-slate-200 pb-safe z-50">
      <div className="max-w-lg mx-auto flex items-center justify-around px-2 py-1.5">
        {navItems.map((item) => {
          const isActive = currentPage === item.id;
          const Icon = item.icon;
          
          return (
            <motion.button
              key={item.id}
              type="button"
              onClick={(e) => handleNavClick(e, item.id)}
              className={`
                flex flex-col items-center justify-center py-2 px-3 rounded-xl
                transition-colors duration-150 select-none relative min-w-[56px]
                ${isActive ? 'text-blue-600' : 'text-slate-400'}
              `}
              whileTap={{ scale: 0.9 }}
            >
              <div className="relative">
                <Icon 
                  size={24} 
                  strokeWidth={isActive ? 2.5 : 2}
                />
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute -bottom-1 left-1/2 w-1 h-1 bg-blue-600 rounded-full -translate-x-1/2"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
              </div>
              <span className={`text-[10px] mt-1 ${isActive ? 'font-semibold' : 'font-medium'}`}>
                {item.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
}
