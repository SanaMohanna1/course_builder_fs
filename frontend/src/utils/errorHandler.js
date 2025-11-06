/**
 * Utility functions for consistent error handling across the application
 */

/**
 * Extract error message from various error formats
 * @param {Error|Object} err - Error object from catch block
 * @returns {string} - User-friendly error message
 */
export function getErrorMessage(err) {
  if (!err) return 'An unexpected error occurred'
  
  // Axios error response
  if (err.response?.data?.message) {
    return err.response.data.message
  }
  
  // Axios error response (alternative format)
  if (err.response?.data?.error) {
    return err.response.data.error
  }
  
  // Standard Error object
  if (err.message) {
    return err.message
  }
  
  // String error
  if (typeof err === 'string') {
    return err
  }
  
  // Fallback
  return 'An unexpected error occurred'
}

/**
 * Check if error is a network/connection error
 * @param {Error|Object} err - Error object
 * @returns {boolean}
 */
export function isNetworkError(err) {
  return !err.response && (err.message?.includes('Network') || err.code === 'ECONNABORTED')
}

/**
 * Check if error is a validation error (4xx)
 * @param {Error|Object} err - Error object
 * @returns {boolean}
 */
export function isValidationError(err) {
  return err.response?.status >= 400 && err.response?.status < 500
}

/**
 * Check if error is a server error (5xx)
 * @param {Error|Object} err - Error object
 * @returns {boolean}
 */
export function isServerError(err) {
  return err.response?.status >= 500
}

/**
 * Get appropriate error message based on error type
 * @param {Error|Object} err - Error object
 * @param {Object} options - Custom error messages
 * @returns {string}
 */
export function getContextualErrorMessage(err, options = {}) {
  if (isNetworkError(err)) {
    return options.network || 'Network error. Please check your connection and try again.'
  }
  
  if (isServerError(err)) {
    return options.server || 'Server error. Please try again later.'
  }
  
  if (isValidationError(err)) {
    return getErrorMessage(err) || options.validation || 'Invalid input. Please check your data and try again.'
  }
  
  return getErrorMessage(err) || options.default || 'An unexpected error occurred'
}

