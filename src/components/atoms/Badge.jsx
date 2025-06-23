import { motion } from 'framer-motion'

const Badge = ({ 
  children, 
  variant = 'default', 
  size = 'md',
  removable = false,
  onRemove,
  className = '',
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center font-medium rounded-full'
  
const variants = {
    default: 'bg-gradient-to-r from-surface-100 to-surface-200 text-surface-700 border border-surface-300/50',
    primary: 'bg-gradient-to-r from-primary/15 to-primary/5 text-primary border border-primary/20 shadow-sm',
    secondary: 'bg-gradient-to-r from-secondary/15 to-secondary/5 text-secondary border border-secondary/20 shadow-sm',
    success: 'bg-gradient-to-r from-success/15 to-success/5 text-success border border-success/20 shadow-sm',
    warning: 'bg-gradient-to-r from-warning/15 to-warning/5 text-warning border border-warning/20 shadow-sm',
    error: 'bg-gradient-to-r from-error/15 to-error/5 text-error border border-error/20 shadow-sm'
  }
  
  const sizes = {
    sm: 'px-3 py-1.5 text-xs font-semibold',
    md: 'px-4 py-2 text-sm font-semibold',
    lg: 'px-5 py-2.5 text-base font-semibold'
  }
  
  const badgeClasses = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`

return (
    <motion.span
      initial={{ scale: 0.8, opacity: 0, y: 10 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      transition={{ type: "spring", duration: 0.3 }}
      className={badgeClasses}
      {...props}
    >
      {children}
      {removable && onRemove && (
        <button
          onClick={onRemove}
          className="ml-2 hover:bg-black/15 rounded-full p-1 transition-all duration-200 hover:scale-110"
        >
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      )}
    </motion.span>
  )
}

export default Badge