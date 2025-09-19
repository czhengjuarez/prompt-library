// URL Router utility for handling direct prompt linking
// Supports hash-based routing for static hosting compatibility

export class URLRouter {
  constructor() {
    this.listeners = new Set()
  }

  // Extract prompt ID from slug-id format
  extractPromptId(slugWithId) {
    // Handle both formats: "title-slug-123456" and "123456"
    const parts = slugWithId.split('-')
    const lastPart = parts[parts.length - 1]
    
    // Check if last part is a valid timestamp-like ID
    if (/^\d{10,}$/.test(lastPart)) {
      return lastPart
    }
    
    // Fallback: assume the whole string is an ID
    return slugWithId
  }

  // Parse current URL hash for routing information
  parseCurrentURL() {
    const hash = window.location.hash.slice(1) // Remove #
    if (!hash) return { type: 'home' }

    const parts = hash.split('/').filter(part => part !== '') // Remove empty parts
    
    // Handle /prompt/{slug-id} routes
    if (parts[0] === 'prompt' && parts[1]) {
      const promptId = this.extractPromptId(parts[1])
      const result = {
        type: 'prompt',
        promptId: promptId,
        originalSlug: parts[1]
      }
      
      // Handle /prompt/{slug-id}/category/{categoryId}
      if (parts[2] === 'category' && parts[3]) {
        result.categoryId = parts[3]
      }
      
      // Handle /prompt/{slug-id}/action/{action}
      if (parts[2] === 'action' && parts[3]) {
        result.action = parts[3] // edit, customize, view
      }
      
      return result
    }
    
    return { type: 'unknown', hash }
  }

  // Create URL-safe slug from text
  createSlug(text) {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .replace(/^-|-$/g, '') // Remove leading/trailing hyphens
      .substring(0, 50) // Limit length
  }

  // Generate URL for a specific prompt with human-readable slug
  generatePromptURL(promptId, options = {}) {
    let url = `#/prompt/`
    
    // Add human-readable slug if prompt title/purpose provided
    if (options.title || options.purpose) {
      const text = options.title || options.purpose
      const slug = this.createSlug(text)
      url += `${slug}-${promptId}`
    } else {
      url += promptId
    }
    
    if (options.categoryId) {
      url += `/category/${options.categoryId}`
    }
    
    if (options.action) {
      url += `/action/${options.action}`
    }
    
    return url
  }

  // Navigate to a prompt URL
  navigateToPrompt(promptId, options = {}) {
    const url = this.generatePromptURL(promptId, options)
    window.location.hash = url
    this.notifyListeners()
  }

  // Navigate to home
  navigateToHome() {
    window.location.hash = ''
    this.notifyListeners()
  }

  // Get full shareable URL for a prompt
  getShareableURL(promptId, options = {}) {
    const baseURL = window.location.origin + window.location.pathname
    const hash = this.generatePromptURL(promptId, options)
    return baseURL + hash
  }

  // Add listener for URL changes
  addListener(callback) {
    this.listeners.add(callback)
    
    // Add browser navigation listener if this is the first listener
    if (this.listeners.size === 1) {
      window.addEventListener('hashchange', () => {
        this.notifyListeners()
      })
    }
  }

  // Remove listener
  removeListener(callback) {
    this.listeners.delete(callback)
  }

  // Notify all listeners of URL changes
  notifyListeners() {
    const routeInfo = this.parseCurrentURL()
    this.listeners.forEach(callback => callback(routeInfo))
  }

  // Initialize router and return current route
  initialize() {
    return this.parseCurrentURL()
  }
}

// Export singleton instance
export const urlRouter = new URLRouter()
export default urlRouter
