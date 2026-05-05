import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from './Button';

export function Modal({ isOpen, onClose, title, children, actions }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-50 max-w-md mx-auto"
          >
            <div className="bg-surface rounded-2xl shadow-xl overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <h2 className="text-lg font-bold text-foreground">{title}</h2>
                <motion.button
                  onClick={onClose}
                  className="p-1.5 rounded-lg hover:bg-surface-dark active:bg-border transition-colors"
                  whileTap={{ scale: 0.9 }}
                >
                  <X size={20} className="text-muted" />
                </motion.button>
              </div>
              
              {/* Content */}
              <div className="p-4 max-h-[60vh] overflow-y-auto">
                {children}
              </div>
              
              {/* Actions */}
              {actions && (
                <div className="flex gap-3 p-4 border-t border-border">
                  {actions}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export function ConfirmModal({ isOpen, onClose, onConfirm, title, message, confirmText = 'Hapus', confirmVariant = 'danger' }) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      actions={
        <>
          <Button variant="secondary" onClick={onClose} fullWidth>
            Batal
          </Button>
          <Button variant={confirmVariant} onClick={onConfirm} fullWidth>
            {confirmText}
          </Button>
        </>
      }
    >
      <p className="text-muted">{message}</p>
    </Modal>
  );
}
