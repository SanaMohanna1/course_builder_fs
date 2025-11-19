const resolveEndpoint = () => {
  const defaultPath = '/api/enrichment/assets'
  const raw = import.meta.env.VITE_API_URL

  if (!raw) {
    return defaultPath
  }

  try {
    const base = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'
    const url = new URL(raw, base)
    const pathname = url.pathname.replace(/\/$/, '')
    const apiRoot = pathname.endsWith('/api/v1') ? pathname.slice(0, -'/api/v1'.length) : pathname
    const nextPath = `${apiRoot}/api/enrichment/assets`.replace(/\/{2,}/g, '/')
    url.pathname = nextPath.startsWith('/') ? nextPath : `/${nextPath}`
    return url.toString()
  } catch (error) {
    console.warn('Failed to resolve enrichment endpoint from VITE_API_URL, falling back to relative path.', error)
    return defaultPath
  }
}

const ENRICHMENT_ENDPOINT = resolveEndpoint()

export const enrichAssets = async (assetData = {}) => {
  try {
    // Get user role from localStorage for trainer headers
    const getStoredRole = () => {
      if (typeof window === 'undefined') return 'learner'
      const stored = window.localStorage.getItem('coursebuilder:userRole')
      return stored && ['learner', 'trainer'].includes(stored) ? stored : 'learner'
    }
    
    const role = getStoredRole()
    const headers = {
      'Content-Type': 'application/json'
    }
    
    // Add trainer headers if role is trainer
    if (role === 'trainer') {
      headers['x-user-role'] = 'trainer'
      headers['x-service-id'] = 'CourseBuilder'
      if (import.meta.env.VITE_SERVICE_API_KEY) {
        headers['x-api-key'] = import.meta.env.VITE_SERVICE_API_KEY
      }
    }
    
    const response = await fetch(ENRICHMENT_ENDPOINT, {
      method: 'POST',
      headers,
      body: JSON.stringify(assetData)
    })

    if (!response.ok) {
      let errorMessage = 'Failed to enrich assets'
      try {
        const errorData = await response.json()
        errorMessage = errorData.message || errorData.error || errorMessage
      } catch {
        const errorText = await response.text().catch(() => '')
        errorMessage = errorText || errorMessage
      }
      const error = new Error(errorMessage)
      error.status = response.status
      throw error
    }

    return await response.json()
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error('Network error: Unable to connect to enrichment service')
  }
}

export default {
  enrichAssets
}

