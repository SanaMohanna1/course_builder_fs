export default function Button({ 
  children, 
  variant = 'primary', 
  size = 'md',
  className = '', 
  ...props 
}) {
  const base = 'inline-flex items-center justify-center font-semibold rounded-button transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
  const variants = {
    primary: 'bg-brand-primary text-white shadow-button-primary hover:shadow-button-primary-hover hover:bg-brand-primary-dark focus-visible:ring-brand-primary',
    secondary: 'bg-neutral-100 text-neutral-900 border border-neutral-300 hover:bg-neutral-200 focus-visible:ring-neutral-300',
    outline: 'bg-transparent text-brand-primary border border-brand-primary hover:bg-neutral-100 focus-visible:ring-brand-primary',
    danger: 'bg-state-error text-white hover:bg-red-700 focus-visible:ring-red-500'
  }
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base'
  }
  
  return (
    <button 
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} 
      {...props}
    >
      {children}
    </button>
  )
}
