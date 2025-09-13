// Cloudflare KV Storage Service
// This service handles data persistence using Cloudflare KV storage

const CLOUDFLARE_CONFIG = {
  // These will need to be set as environment variables
  accountId: import.meta.env.VITE_CLOUDFLARE_ACCOUNT_ID,
  namespaceId: import.meta.env.VITE_CLOUDFLARE_KV_NAMESPACE_ID,
  apiToken: import.meta.env.VITE_CLOUDFLARE_API_TOKEN,
  baseUrl: 'https://api.cloudflare.com/client/v4'
}

class CloudflareStorageService {
  constructor() {
    this.isConfigured = this.checkConfiguration()
  }

  checkConfiguration() {
    return !!(CLOUDFLARE_CONFIG.accountId && 
              CLOUDFLARE_CONFIG.namespaceId && 
              CLOUDFLARE_CONFIG.apiToken)
  }

  getHeaders() {
    return {
      'Authorization': `Bearer ${CLOUDFLARE_CONFIG.apiToken}`,
      'Content-Type': 'application/json'
    }
  }

  getKvUrl(key) {
    return `${CLOUDFLARE_CONFIG.baseUrl}/accounts/${CLOUDFLARE_CONFIG.accountId}/storage/kv/namespaces/${CLOUDFLARE_CONFIG.namespaceId}/values/${key}`
  }

  // Get data from KV storage
  async getData(key) {
    if (!this.isConfigured) {
      console.warn('Cloudflare not configured, falling back to localStorage')
      return this.getLocalStorageData(key)
    }

    try {
      const response = await fetch(this.getKvUrl(key), {
        method: 'GET',
        headers: this.getHeaders()
      })

      if (response.status === 404) {
        // Key doesn't exist, return empty array
        return []
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error(`Error fetching ${key} from Cloudflare KV:`, error)
      // Fallback to localStorage
      return this.getLocalStorageData(key)
    }
  }

  // Save data to KV storage
  async saveData(key, data) {
    if (!this.isConfigured) {
      console.warn('Cloudflare not configured, falling back to localStorage')
      return this.saveLocalStorageData(key, data)
    }

    try {
      const response = await fetch(this.getKvUrl(key), {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(data)
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      // Also save to localStorage as backup
      this.saveLocalStorageData(key, data)
      return true
    } catch (error) {
      console.error(`Error saving ${key} to Cloudflare KV:`, error)
      // Fallback to localStorage
      return this.saveLocalStorageData(key, data)
    }
  }

  // Delete data from KV storage
  async deleteData(key) {
    if (!this.isConfigured) {
      console.warn('Cloudflare not configured, falling back to localStorage')
      return this.deleteLocalStorageData(key)
    }

    try {
      const response = await fetch(this.getKvUrl(key), {
        method: 'DELETE',
        headers: this.getHeaders()
      })

      if (!response.ok && response.status !== 404) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      // Also remove from localStorage
      this.deleteLocalStorageData(key)
      return true
    } catch (error) {
      console.error(`Error deleting ${key} from Cloudflare KV:`, error)
      // Fallback to localStorage
      return this.deleteLocalStorageData(key)
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

  // Specific methods for our app data
  async getCategories() {
    return await this.getData('categories')
  }

  async saveCategories(categories) {
    return await this.saveData('categories', categories)
  }

  async getPrompts() {
    return await this.getData('prompts')
  }

  async savePrompts(prompts) {
    return await this.saveData('prompts', prompts)
  }

  // Sync localStorage to KV (useful for migration)
  async syncLocalStorageToKv() {
    if (!this.isConfigured) {
      console.warn('Cloudflare not configured, cannot sync')
      return false
    }

    try {
      const categories = this.getLocalStorageData('categories')
      const prompts = this.getLocalStorageData('prompts')

      await Promise.all([
        this.saveData('categories', categories),
        this.saveData('prompts', prompts)
      ])

      console.log('Successfully synced localStorage to Cloudflare KV')
      return true
    } catch (error) {
      console.error('Error syncing to Cloudflare KV:', error)
      return false
    }
  }

  // Get configuration status
  getStatus() {
    return {
      configured: this.isConfigured,
      accountId: !!CLOUDFLARE_CONFIG.accountId,
      namespaceId: !!CLOUDFLARE_CONFIG.namespaceId,
      apiToken: !!CLOUDFLARE_CONFIG.apiToken
    }
  }
}

// Export singleton instance
export const storageService = new CloudflareStorageService()
export default storageService
