import { motion } from 'framer-motion';

export function Card({ children, className = '', onClick, hover = false }) {
  const Component = onClick ? motion.button : motion.div;
  
  return (
    <Component
      className={`card ${hover ? 'card-hover' : ''} ${className}`}
      onClick={onClick}
      whileTap={onClick ? { scale: 0.98 } : undefined}
    >
      {children}
    </Component>
  );
}

export function CardHeader({ children, className = '' }) {
  return (
    <div className={`px-4 pt-4 pb-2 ${className}`}>
      {children}
    </div>
  );
}

export function CardContent({ children, className = '' }) {
  return (
    <div className={`px-4 pb-4 ${className}`}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className = '' }) {
  return (
    <h3 className={`text-lg font-bold text-foreground ${className}`}>
      {children}
    </h3>
  );
}

export function CardDescription({ children, className = '' }) {
  return (
    <p className={`text-sm text-muted mt-1 ${className}`}>
      {children}
    </p>
  );
}
