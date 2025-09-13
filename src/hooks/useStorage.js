import { useState, useEffect } from 'react'
import storageService from '../services/cloudflareStorage'

// Custom hook for managing data with Cloudflare KV storage
export const useStorage = (key, initialValue = []) => {
  const [data, setData] = useState(initialValue)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Load data on mount
  useEffect(() => {
    loadData()
  }, [key])

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)
      const result = await storageService.getData(key)
      setData(result || initialValue)
    } catch (err) {
      setError(err.message)
      console.error(`Error loading ${key}:`, err)
      setData(initialValue)
    } finally {
      setLoading(false)
    }
  }

  const saveData = async (newData) => {
    try {
      setError(null)
      const success = await storageService.saveData(key, newData)
      if (success) {
        setData(newData)
      }
      return success
    } catch (err) {
      setError(err.message)
      console.error(`Error saving ${key}:`, err)
      return false
    }
  }

  const updateData = async (updateFn) => {
    try {
      setError(null)
      const newData = updateFn(data)
      const success = await storageService.saveData(key, newData)
      if (success) {
        setData(newData)
      }
      return success
    } catch (err) {
      setError(err.message)
      console.error(`Error updating ${key}:`, err)
      return false
    }
  }

  return {
    data,
    loading,
    error,
    saveData,
    updateData,
    reload: loadData
  }
}

// Specific hooks for categories and prompts
export const useCategories = () => {
  return useStorage('categories', [])
}

export const usePrompts = () => {
  return useStorage('prompts', [])
}
