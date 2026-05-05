import { ChevronLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export function Header({ title, subtitle, showBack = false, onBack, rightAction }) {
  return (
    <header className="flex-shrink-0 bg-white/95 backdrop-blur-sm border-b border-slate-200 pt-safe">
      <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
        {showBack && (
          <motion.button
            type="button"
            onClick={(e) => { e.stopPropagation(); onBack?.(); }}
            className="p-1.5 -ml-1.5 rounded-xl active:bg-slate-100 transition-colors"
            whileTap={{ scale: 0.9 }}
          >
            <ChevronLeft size={24} className="text-slate-800" />
          </motion.button>
        )}
        
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-bold text-slate-800 truncate">{title}</h1>
          {subtitle && (
            <p className="text-sm text-slate-500 truncate">{subtitle}</p>
          )}
        </div>
        
        {rightAction && (
          <div className="flex-shrink-0">
            {rightAction}
          </div>
        )}
      </div>
    </header>
  );
}
