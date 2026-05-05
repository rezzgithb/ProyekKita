import { forwardRef } from 'react';

export const Input = forwardRef(function Input({ 
  label,
  error,
  prefix,
  suffix,
  className = '',
  inputClassName = '',
  type = 'text',
  ...props 
}, ref) {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-foreground mb-1.5">
          {label}
        </label>
      )}
      <div className={`
        flex items-center gap-2 px-4 py-3 rounded-xl 
        bg-surface border-2 transition-colors duration-150
        ${error ? 'border-danger' : 'border-border focus-within:border-primary-500'}
      `}>
        {prefix && (
          <span className="text-muted text-sm font-medium">{prefix}</span>
        )}
        <input
          ref={ref}
          type={type}
          className={`
            flex-1 bg-transparent text-foreground 
            placeholder:text-muted/60 text-base
            ${inputClassName}
          `}
          {...props}
        />
        {suffix && (
          <span className="text-muted text-sm">{suffix}</span>
        )}
      </div>
      {error && (
        <p className="mt-1.5 text-sm text-danger">{error}</p>
      )}
    </div>
  );
});

export const TextArea = forwardRef(function TextArea({ 
  label,
  error,
  className = '',
  rows = 4,
  ...props 
}, ref) {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-foreground mb-1.5">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        rows={rows}
        className={`
          w-full px-4 py-3 rounded-xl bg-surface border-2 transition-colors duration-150
          text-foreground placeholder:text-muted/60 text-base resize-none
          ${error ? 'border-danger' : 'border-border focus:border-primary-500'}
        `}
        {...props}
      />
      {error && (
        <p className="mt-1.5 text-sm text-danger">{error}</p>
      )}
    </div>
  );
});

export const Select = forwardRef(function Select({ 
  label,
  error,
  options = [],
  className = '',
  ...props 
}, ref) {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-foreground mb-1.5">
          {label}
        </label>
      )}
      <select
        ref={ref}
        className={`
          w-full px-4 py-3 rounded-xl bg-surface border-2 transition-colors duration-150
          text-foreground text-base appearance-none cursor-pointer
          ${error ? 'border-danger' : 'border-border focus:border-primary-500'}
        `}
        style={{
          backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
          backgroundPosition: 'right 0.75rem center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: '1.5em 1.5em',
          paddingRight: '2.5rem'
        }}
        {...props}
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1.5 text-sm text-danger">{error}</p>
      )}
    </div>
  );
});
