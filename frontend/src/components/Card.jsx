export default function Card({ children, className = '', onClick, style = {} }) {
  return (
    <div
      className={[
        'rounded-card bg-white shadow-lg border border-neutral-200',
        'p-6',
        'hover:shadow-brand transition-shadow',
        'dark:bg-surface-dark dark:border-neutral-700',
        className
      ].filter(Boolean).join(' ')}
      onClick={onClick}
      style={{
        cursor: onClick ? 'pointer' : 'default',
        ...style
      }}
    >
      {children}
    </div>
  )
}
