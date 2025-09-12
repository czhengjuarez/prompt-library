import { useState } from 'react'
import { useTheme } from '../contexts/ThemeContext'
import CategoryForm from './CategoryForm'
import PromptForm from './PromptForm'
import PromptCard from './PromptCard'
import CategoryList from './CategoryList'
import CustomizePromptModal from './CustomizePromptModal'
import DeleteCategoryModal from './DeleteCategoryModal'
import DeletePromptModal from './DeletePromptModal'
import PromptDetailsModal from './PromptDetailsModal'

const PromptLibrary = () => {
  const { isDarkMode, toggleDarkMode } = useTheme()
  const [categories, setCategories] = useState([])
  const [prompts, setPrompts] = useState([])
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [showCategoryForm, setShowCategoryForm] = useState(false)
  const [showPromptForm, setShowPromptForm] = useState(false)
  const [customizePrompt, setCustomizePrompt] = useState(null)
  const [editingCategory, setEditingCategory] = useState(null)
  const [editingPrompt, setEditingPrompt] = useState(null)
  const [deletingCategory, setDeletingCategory] = useState(null)
  const [deletingPrompt, setDeletingPrompt] = useState(null)
  const [viewingPrompt, setViewingPrompt] = useState(null)

  const addCategory = (categoryData) => {
    const newCategory = {
      id: Date.now(),
      ...categoryData
    }
    setCategories([...categories, newCategory])
    setShowCategoryForm(false)
  }

  const updateCategory = (categoryData) => {
    setCategories(categories.map(cat => 
      cat.id === editingCategory.id ? { ...cat, ...categoryData } : cat
    ))
    setEditingCategory(null)
  }

  const deleteCategory = (categoryId, moveToCategory = null) => {
    if (moveToCategory) {
      // Move prompts to another category
      setPrompts(prompts.map(prompt => 
        prompt.categoryId === categoryId 
          ? { ...prompt, categoryId: moveToCategory }
          : prompt
      ))
    } else {
      // Delete prompts with category
      setPrompts(prompts.filter(prompt => prompt.categoryId !== categoryId))
    }
    
    setCategories(categories.filter(cat => cat.id !== categoryId))
    setDeletingCategory(null)
    
    // Reset selected category if it was deleted
    if (selectedCategory?.id === categoryId) {
      setSelectedCategory(null)
    }
  }

  const addPrompt = (promptData) => {
    const newPrompt = {
      id: Date.now(),
      categoryId: selectedCategory.id,
      ...promptData
    }
    setPrompts([...prompts, newPrompt])
    setShowPromptForm(false)
  }

  const updatePrompt = (promptData) => {
    setPrompts(prompts.map(prompt => 
      prompt.id === editingPrompt.id 
        ? { ...prompt, ...promptData, categoryId: editingPrompt.categoryId }
        : prompt
    ))
    setEditingPrompt(null)
  }

  const confirmDeletePrompt = (promptId) => {
    setPrompts(prompts.filter(prompt => prompt.id !== promptId))
    setDeletingPrompt(null)
  }

  const getCategoryPrompts = (categoryId) => {
    return prompts.filter(prompt => prompt.categoryId === categoryId)
  }

  return (
    <div className="min-h-screen w-full p-8 bg-white dark:bg-gray-900 transition-colors">
      {/* Header */}
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">AI Prompt Library</h1>
          <p className="text-gray-600 dark:text-gray-300">Organize and customize your AI prompts</p>
        </div>
        
        {/* Dark Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors"
          title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDarkMode ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          )}
        </button>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 mb-8">
        <button
          onClick={() => setShowCategoryForm(true)}
          className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
        >
          + Add Category
        </button>
        {selectedCategory && (
          <button
            onClick={() => setShowPromptForm(true)}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm font-medium transition-colors border border-gray-200"
          >
            + Add Prompt
          </button>
        )}
      </div>

      <div className="flex gap-8">
        {/* Sidebar */}
        <div className="w-80 flex-shrink-0">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 h-fit">
            <CategoryList
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              onEditCategory={setEditingCategory}
              onDeleteCategory={setDeletingCategory}
            />
            
          </div>
        </div>

        {/* Prompts Grid */}
        <div className="flex-1">
          {selectedCategory ? (
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{selectedCategory.name}</h2>
                <p className="text-gray-600 dark:text-gray-300">{selectedCategory.purpose}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {getCategoryPrompts(selectedCategory.id).map(prompt => (
                <PromptCard
                  key={prompt.id}
                  prompt={prompt}
                  onCustomize={() => setCustomizePrompt(prompt)}
                  onEdit={() => setEditingPrompt(prompt)}
                  onDelete={() => setDeletingPrompt(prompt)}
                  onViewDetails={() => setViewingPrompt(prompt)}
                />
              ))}
              </div>
              
              {getCategoryPrompts(selectedCategory.id).length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500 dark:text-gray-300 mb-4">No prompts in this category yet</p>
                  <button
                    onClick={() => setShowPromptForm(true)}
                    className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Add your first prompt
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-300 mb-4">Select a category to view prompts</p>
              <button
                onClick={() => setShowCategoryForm(true)}
                className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Create your first category
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Category Form Modal */}
      {(showCategoryForm || editingCategory) && (
        <CategoryForm
          category={editingCategory}
          onSubmit={editingCategory ? updateCategory : addCategory}
          onClose={() => {
            setShowCategoryForm(false)
            setEditingCategory(null)
          }}
        />
      )}

      {/* Prompt Form Modal */}
      {(showPromptForm || editingPrompt) && selectedCategory && (
        <PromptForm
          selectedCategory={selectedCategory}
          editingPrompt={editingPrompt}
          onSubmit={editingPrompt ? updatePrompt : addPrompt}
          onClose={() => {
            setShowPromptForm(false)
            setEditingPrompt(null)
          }}
        />
      )}

      {/* Customize Prompt Modal */}
      {customizePrompt && (
        <CustomizePromptModal
          prompt={customizePrompt}
          onClose={() => setCustomizePrompt(null)}
        />
      )}

      {/* Delete Category Modal */}
      {deletingCategory && (
        <DeleteCategoryModal
          category={deletingCategory}
          categories={categories.filter(cat => cat.id !== deletingCategory.id)}
          promptCount={getCategoryPrompts(deletingCategory.id).length}
          onConfirm={deleteCategory}
          onClose={() => setDeletingCategory(null)}
        />
      )}

      {/* Delete Prompt Modal */}
      {deletingPrompt && (
        <DeletePromptModal
          prompt={deletingPrompt}
          onConfirm={() => confirmDeletePrompt(deletingPrompt.id)}
          onClose={() => setDeletingPrompt(null)}
        />
      )}

      {/* Prompt Details Modal */}
      {viewingPrompt && (
        <PromptDetailsModal
          prompt={viewingPrompt}
          onClose={() => setViewingPrompt(null)}
        />
      )}
    </div>
  )
}

export default PromptLibrary
