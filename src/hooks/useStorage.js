import { useState, useEffect } from 'react'
import storageService from '../services/cloudflareStorage'

// Custom hook for managing categories with API
export const useCategories = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Load categories on mount
  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)
      const result = await storageService.getCategories()
      setData(result || [])
    } catch (err) {
      setError(err.message)
      console.error('Error loading categories:', err)
      setData([])
    } finally {
      setLoading(false)
    }
  }

  const updateData = async (updateFn) => {
    try {
      setError(null)
      const newData = updateFn(data)
      setData(newData)
      return true
    } catch (err) {
      setError(err.message)
      console.error('Error updating categories:', err)
      return false
    }
  }

  const addCategory = async (categoryData) => {
    try {
      setError(null)
      const newCategory = await storageService.saveCategory(categoryData)
      setData(prev => [...prev, newCategory])
      return newCategory
    } catch (err) {
      setError(err.message)
      console.error('Error adding category:', err)
      throw err
    }
  }

  const updateCategory = async (categoryId, categoryData) => {
    try {
      setError(null)
      const updatedCategory = await storageService.updateCategory(categoryId, categoryData)
      setData(prev => prev.map(cat => cat.id === categoryId ? updatedCategory : cat))
      return updatedCategory
    } catch (err) {
      setError(err.message)
      console.error('Error updating category:', err)
      throw err
    }
  }

  const deleteCategory = async (categoryId) => {
    try {
      setError(null)
      await storageService.deleteCategory(categoryId)
      setData(prev => prev.filter(cat => cat.id !== categoryId))
      return true
    } catch (err) {
      setError(err.message)
      console.error('Error deleting category:', err)
      throw err
    }
  }

  return {
    data,
    loading,
    error,
    updateData,
    addCategory,
    updateCategory,
    deleteCategory,
    reload: loadData
  }
}

// Custom hook for managing prompts with API
export const usePrompts = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Load prompts on mount
  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)
      const result = await storageService.getPrompts()
      setData(result || [])
    } catch (err) {
      setError(err.message)
      console.error('Error loading prompts:', err)
      setData([])
    } finally {
      setLoading(false)
    }
  }

  const updateData = async (updateFn) => {
    try {
      setError(null)
      const newData = updateFn(data)
      setData(newData)
      return true
    } catch (err) {
      setError(err.message)
      console.error('Error updating prompts:', err)
      return false
    }
  }

  const addPrompt = async (promptData) => {
    try {
      setError(null)
      const newPrompt = await storageService.savePrompt(promptData)
      setData(prev => [...prev, newPrompt])
      return newPrompt
    } catch (err) {
      setError(err.message)
      console.error('Error adding prompt:', err)
      throw err
    }
  }

  const updatePrompt = async (promptId, promptData) => {
    try {
      setError(null)
      const updatedPrompt = await storageService.updatePrompt(promptId, promptData)
      setData(prev => prev.map(prompt => prompt.id === promptId ? updatedPrompt : prompt))
      return updatedPrompt
    } catch (err) {
      setError(err.message)
      console.error('Error updating prompt:', err)
      throw err
    }
  }

  const deletePrompt = async (promptId) => {
    try {
      setError(null)
      await storageService.deletePrompt(promptId)
      setData(prev => prev.filter(prompt => prompt.id !== promptId))
      return true
    } catch (err) {
      setError(err.message)
      console.error('Error deleting prompt:', err)
      throw err
    }
  }

  return {
    data,
    loading,
    error,
    updateData,
    addPrompt,
    updatePrompt,
    deletePrompt,
    reload: loadData
  }
}

// Legacy hook for backward compatibility
export const useStorage = (key, initialValue = []) => {
  console.warn('useStorage is deprecated - use useCategories or usePrompts instead')
  
  if (key === 'categories') {
    return useCategories()
  } else if (key === 'prompts') {
    return usePrompts()
  }
  
  // Fallback for other keys
  const [data, setData] = useState(initialValue)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  
  return {
    data,
    loading,
    error,
    saveData: () => Promise.resolve(true),
    updateData: (updateFn) => {
      setData(updateFn(data))
      return Promise.resolve(true)
    },
    reload: () => Promise.resolve()
  }
}
