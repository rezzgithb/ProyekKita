import { forwardRef } from 'react';
import { motion } from 'framer-motion';

export const Card = forwardRef(function Card({ 
  children, 
  className = '', 
  onClick, 
  interactive = false,
  as = 'div',
  ...props 
}, ref) {
  const isClickable = onClick || interactive;
  const Component = isClickable ? motion.button : motion.div;
  
  const handleClick = (e) => {
    if (onClick) {
      e.stopPropagation();
      onClick(e);
    }
  };
  
  return (
    <Component
      ref={ref}
      type={isClickable ? 'button' : undefined}
      className={`card ${isClickable ? 'card-interactive' : ''} ${className}`.trim()}
      onClick={isClickable ? handleClick : undefined}
      whileTap={isClickable ? { scale: 0.98 } : undefined}
      {...props}
    >
      {children}
    </Component>
  );
});

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
    <h3 className={`text-lg font-bold text-slate-900 ${className}`}>
      {children}
    </h3>
  );
}

export function CardDescription({ children, className = '' }) {
  return (
    <p className={`text-sm text-slate-500 mt-1 ${className}`}>
      {children}
    </p>
  );
}
