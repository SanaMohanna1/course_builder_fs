import { useApp } from '../context/AppContext'

export default function Toast() {
  const { toast } = useApp()

  if (!toast) return null

  const getToastStyle = () => {
    switch (toast.type) {
      case 'success':
        return {
          bgColor: 'var(--accent-green)',
          icon: 'fas fa-check-circle'
        }
      case 'info':
        return {
          bgColor: 'var(--primary-cyan)',
          icon: 'fas fa-info-circle'
        }
      default:
        return {
          bgColor: '#EF4444',
          icon: 'fas fa-times-circle'
        }
    }
  }
  
  const { bgColor, icon } = getToastStyle()

  return (
    <div style={{
      position: 'fixed',
      bottom: 'var(--spacing-lg)',
      right: 'var(--spacing-lg)',
      background: bgColor,
      color: 'white',
      padding: 'var(--spacing-md) var(--spacing-lg)',
      borderRadius: 'var(--radius-md)',
      boxShadow: 'var(--shadow-card)',
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--spacing-sm)',
      zIndex: 10000,
      animation: 'fadeInUp 0.3s ease-out'
    }}>
      <i className={icon} style={{ fontSize: '1.2rem' }}></i>
      <span>{toast.message}</span>
    </div>
  )
}
