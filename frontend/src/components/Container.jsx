export default function Container({ children, className = '' }) {
  const classes = ['container', className].filter(Boolean).join(' ')
  return <div className={classes}>{children}</div>
}


