export default function Input({ label, error, className = '', ...props }) {
  return (
    <label className="block mb-4">
      {label && (
        <span className="block mb-1 text-neutral-500 text-sm font-medium">
          {label}
        </span>
      )}
      <input
        className={[
          'w-full rounded-input bg-white text-neutral-900',
          'border transition-colors',
          error
            ? 'border-state-error focus:border-state-error focus:ring-2 focus:ring-state-error/30'
            : 'border-neutral-300 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20',
          'px-4 py-3',
          'dark:bg-surface-dark dark:text-neutral-50 dark:border-neutral-700',
          'dark:focus:border-brand-primary-light dark:focus:ring-brand-primary/30',
          className
        ].join(' ')}
        {...props}
      />
      {error && (
        <span className="block text-xs text-state-error mt-1">
          {error}
        </span>
      )}
    </label>
  )
}
