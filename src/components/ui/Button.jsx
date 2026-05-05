import { motion } from 'framer-motion';

const variants = {
  primary: 'bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800',
  secondary: 'bg-surface-dark text-foreground hover:bg-border active:bg-gray-200',
  outline: 'bg-transparent border-2 border-primary-600 text-primary-600 hover:bg-primary-50 active:bg-primary-100',
  ghost: 'bg-transparent text-foreground hover:bg-surface-dark active:bg-border',
  danger: 'bg-danger text-white hover:bg-red-600 active:bg-red-700',
  success: 'bg-success text-white hover:bg-green-600 active:bg-green-700',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm rounded-lg',
  md: 'px-4 py-2.5 text-base rounded-xl',
  lg: 'px-6 py-3 text-lg rounded-xl',
  icon: 'p-2.5 rounded-xl',
};

export function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  disabled = false,
  fullWidth = false,
  className = '',
  onClick,
  type = 'button',
  ...props 
}) {
  return (
    <motion.button
      type={type}
      className={`
        ${variants[variant]} 
        ${sizes[size]} 
        ${fullWidth ? 'w-full' : ''} 
        font-semibold transition-colors duration-150 
        disabled:opacity-50 disabled:cursor-not-allowed
        flex items-center justify-center gap-2
        btn-press no-select
        ${className}
      `}
      disabled={disabled}
      onClick={onClick}
      whileTap={disabled ? undefined : { scale: 0.97 }}
      {...props}
    >
      {children}
    </motion.button>
  );
}
