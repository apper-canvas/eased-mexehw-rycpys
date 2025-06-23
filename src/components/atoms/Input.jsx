import { useState } from 'react'

const Input = ({ 
  label, 
  type = 'text', 
  value, 
  onChange, 
  placeholder,
  error,
  required = false,
  className = '',
  ...props 
}) => {
  const [focused, setFocused] = useState(false)
  const hasValue = value && value.toString().length > 0

  return (
    <div className={`relative ${className}`}>
      {label && (
        <label 
          className={`absolute left-3 transition-all duration-200 pointer-events-none ${
            focused || hasValue 
              ? 'top-1 text-xs text-primary' 
              : 'top-3 text-sm text-surface-500'
          }`}
        >
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </label>
      )}
<input
        type={type}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        className={`
          w-full px-3 py-3 border rounded-md transition-all duration-200
          ${label ? 'pt-6 pb-2' : 'py-3'}
          ${error 
            ? 'border-error focus:border-error focus:ring-error/20' 
            : 'border-surface-300 focus:border-primary focus:ring-primary/20'
          }
          focus:outline-none focus:ring-2
          text-surface-900 caret-surface-900
          placeholder:text-surface-400
        `}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-error">{error}</p>
      )}
    </div>
  )
}

export default Input