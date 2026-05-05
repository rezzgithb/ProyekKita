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

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-surface shadow-bottom-nav border-t border-border pb-safe z-50">
      <div className="max-w-lg mx-auto flex items-center justify-around px-2 py-1">
        {navItems.map((item) => {
          const isActive = currentPage === item.id;
          const Icon = item.icon;
          
          return (
            <motion.button
              key={item.id}
              onClick={() => setPage(item.id)}
              className={`
                flex flex-col items-center justify-center py-2 px-4 rounded-xl
                transition-colors duration-150 no-select relative
                ${isActive ? 'text-primary-600' : 'text-muted'}
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
                    className="absolute -bottom-1 left-1/2 w-1 h-1 bg-primary-600 rounded-full"
                    style={{ x: '-50%' }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
              </div>
              <span className={`text-xs mt-1 font-medium ${isActive ? 'font-semibold' : ''}`}>
                {item.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
}
