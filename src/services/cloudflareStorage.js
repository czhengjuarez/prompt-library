// Cloudflare KV Storage Service via Worker API
// This service handles data persistence using our deployed Cloudflare Worker API

const API_CONFIG = {
  baseUrl: 'https://prompt-library.coscient.workers.dev/api'
}

class CloudflareStorageService {
  constructor() {
    this.isConfigured = true // Always configured since we use our own API
  }

  getHeaders() {
    return {
      'Content-Type': 'application/json'
    }
  }

  getCategoriesUrl() {
    return `${API_CONFIG.baseUrl}/categories`
  }

  getPromptsUrl() {
    return `${API_CONFIG.baseUrl}/prompts`
  }

  // Get categories from API
  async getCategories() {
    try {
      const response = await fetch(this.getCategoriesUrl(), {
        method: 'GET',
        headers: this.getHeaders()
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error fetching categories from API:', error)
      // Fallback to localStorage
      return this.getLocalStorageData('categories')
    }
  }

  // Get prompts from API
  async getPrompts() {
    try {
      const response = await fetch(this.getPromptsUrl(), {
        method: 'GET',
        headers: this.getHeaders()
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error fetching prompts from API:', error)
      // Fallback to localStorage
      return this.getLocalStorageData('prompts')
    }
  }

  // Save category to API
  async saveCategory(category) {
    try {
      const response = await fetch(this.getCategoriesUrl(), {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(category)
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error saving category to API:', error)
      throw error
    }
  }

  // Update category via API
  async updateCategory(categoryId, category) {
    try {
      const response = await fetch(`${this.getCategoriesUrl()}/${categoryId}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(category)
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error updating category via API:', error)
      throw error
    }
  }

  // Save prompt to API
  async savePrompt(prompt) {
    try {
      const response = await fetch(this.getPromptsUrl(), {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(prompt)
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error saving prompt to API:', error)
      throw error
    }
  }

  // Update prompt via API
  async updatePrompt(promptId, prompt) {
    try {
      const response = await fetch(`${this.getPromptsUrl()}/${promptId}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(prompt)
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error updating prompt via API:', error)
      throw error
    }
  }

  // Delete category via API
  async deleteCategory(categoryId) {
    try {
      const response = await fetch(`${this.getCategoriesUrl()}/${categoryId}`, {
        method: 'DELETE',
        headers: this.getHeaders()
      })

      if (!response.ok && response.status !== 404) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return true
    } catch (error) {
      console.error('Error deleting category via API:', error)
      throw error
    }
  }

  // Delete prompt via API
  async deletePrompt(promptId) {
    try {
      const response = await fetch(`${this.getPromptsUrl()}/${promptId}`, {
        method: 'DELETE',
        headers: this.getHeaders()
      })

      if (!response.ok && response.status !== 404) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return true
    } catch (error) {
      console.error('Error deleting prompt via API:', error)
      throw error
    }
  }

  // localStorage fallback methods
  getLocalStorageData(key) {
    try {
      const data = localStorage.getItem(key)
      return data ? JSON.parse(data) : []
    } catch (error) {
      console.error(`Error reading ${key} from localStorage:`, error)
      return []
    }
  }

  saveLocalStorageData(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify(data))
      return true
    } catch (error) {
      console.error(`Error saving ${key} to localStorage:`, error)
      return false
    }
  }

  deleteLocalStorageData(key) {
    try {
      localStorage.removeItem(key)
      return true
    } catch (error) {
      console.error(`Error deleting ${key} from localStorage:`, error)
      return false
    }
  }

  // Legacy methods for backward compatibility (now use individual CRUD operations)
  async saveCategories(categories) {
    // This method is deprecated - use individual category operations
    console.warn('saveCategories is deprecated - use individual category operations')
    return this.saveLocalStorageData('categories', categories)
  }

  async savePrompts(prompts) {
    // This method is deprecated - use individual prompt operations  
    console.warn('savePrompts is deprecated - use individual prompt operations')
    return this.saveLocalStorageData('prompts', prompts)
  }

  // Sync localStorage to API (useful for migration)
  async syncLocalStorageToApi() {
    try {
      const categories = this.getLocalStorageData('categories')
      const prompts = this.getLocalStorageData('prompts')

      // Migrate categories
      for (const category of categories) {
        await this.saveCategory(category)
      }

      // Migrate prompts
      for (const prompt of prompts) {
        await this.savePrompt(prompt)
      }

      console.log('Successfully synced localStorage to API')
      return true
    } catch (error) {
      console.error('Error syncing to API:', error)
      return false
    }
  }

  // Get configuration status
  getStatus() {
    return {
      configured: this.isConfigured,
      apiUrl: API_CONFIG.baseUrl
    }
  }
}

// Export singleton instance
export const storageService = new CloudflareStorageService()
export default storageService
