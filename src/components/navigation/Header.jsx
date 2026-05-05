import { ChevronLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export function Header({ title, subtitle, showBack = false, onBack, rightAction }) {
  return (
    <header className="sticky top-0 z-40 bg-surface/95 backdrop-blur-sm border-b border-border pt-safe">
      <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
        {showBack && (
          <motion.button
            onClick={onBack}
            className="p-1.5 -ml-1.5 rounded-xl hover:bg-surface-dark active:bg-border transition-colors"
            whileTap={{ scale: 0.9 }}
          >
            <ChevronLeft size={24} className="text-foreground" />
          </motion.button>
        )}
        
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-bold text-foreground truncate">{title}</h1>
          {subtitle && (
            <p className="text-sm text-muted truncate">{subtitle}</p>
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
