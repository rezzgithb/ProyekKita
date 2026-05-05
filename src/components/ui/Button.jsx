import { forwardRef } from 'react';
import { motion } from 'framer-motion';

const variants = {
  primary: 'bg-blue-600 text-white active:bg-blue-700',
  secondary: 'bg-slate-100 text-slate-700 active:bg-slate-200',
  outline: 'bg-transparent border-2 border-blue-600 text-blue-600 active:bg-blue-50',
  ghost: 'bg-transparent text-slate-600 active:bg-slate-100',
  danger: 'bg-red-500 text-white active:bg-red-600',
  success: 'bg-emerald-500 text-white active:bg-emerald-600',
};

const sizes = {
  sm: 'px-3 py-2 text-sm rounded-lg',
  md: 'px-4 py-3 text-sm rounded-xl',
  lg: 'px-6 py-3.5 text-base rounded-xl',
  icon: 'p-2.5 rounded-xl',
};

export const Button = forwardRef(function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  disabled = false,
  fullWidth = false,
  className = '',
  onClick,
  type = 'button',
  ...props 
}, ref) {
  const handleClick = (e) => {
    e.stopPropagation();
    if (onClick && !disabled) {
      onClick(e);
    }
  };

  return (
    <motion.button
      ref={ref}
      type={type}
      className={`
        ${variants[variant]} 
        ${sizes[size]} 
        ${fullWidth ? 'w-full' : ''} 
        font-semibold 
        disabled:opacity-50 disabled:cursor-not-allowed
        flex items-center justify-center gap-2
        select-none
        ${className}
      `.trim().replace(/\s+/g, ' ')}
      disabled={disabled}
      onClick={handleClick}
      whileTap={disabled ? undefined : { scale: 0.97 }}
      {...props}
    >
      {children}
    </motion.button>
  );
});
