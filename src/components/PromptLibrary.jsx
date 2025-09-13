import { useState } from 'react'
import { useTheme } from '../contexts/ThemeContext'
import { useCategories, usePrompts } from '../hooks/useStorage'
import { exportPromptsToExcel, getExportSummary } from '../utils/excelExport'
import CategoryForm from './CategoryForm'
import PromptForm from './PromptForm'
import PromptCard from './PromptCard'
import CategoryList from './CategoryList'
import CustomizePromptModal from './CustomizePromptModal'
import DeleteCategoryModal from './DeleteCategoryModal'
import MovePromptModal from './MovePromptModal'
import DeletePromptModal from './DeletePromptModal'
import PromptDetailsModal from './PromptDetailsModal'

const PromptLibrary = () => {
  const { isDarkMode, toggleDarkMode } = useTheme()
  const { data: categories, loading: categoriesLoading, error: categoriesError, addCategory: apiAddCategory, updateCategory: apiUpdateCategory, deleteCategory: apiDeleteCategory } = useCategories()
  const { data: prompts, loading: promptsLoading, error: promptsError, addPrompt: apiAddPrompt, updatePrompt: apiUpdatePrompt, deletePrompt: apiDeletePrompt } = usePrompts()
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [showCategoryForm, setShowCategoryForm] = useState(false)
  const [showPromptForm, setShowPromptForm] = useState(false)
  const [customizePrompt, setCustomizePrompt] = useState(null)
  const [editingCategory, setEditingCategory] = useState(null)
  const [editingPrompt, setEditingPrompt] = useState(null)
  const [deletingCategory, setDeletingCategory] = useState(null)
  const [deletingPrompt, setDeletingPrompt] = useState(null)
  const [viewingPrompt, setViewingPrompt] = useState(null)
  const [movingPrompt, setMovingPrompt] = useState(null)

  const filteredPrompts = selectedCategory 
    ? prompts.filter(prompt => prompt.categoryId === selectedCategory.id).sort((a, b) => a.title?.localeCompare(b.title) || 0)
    : prompts.sort((a, b) => a.title?.localeCompare(b.title) || 0)

  const addCategory = async (categoryData) => {
    try {
      const newCategory = {
        id: Date.now().toString(),
        ...categoryData
      }
      await apiAddCategory(newCategory)
      setShowCategoryForm(false)
    } catch (error) {
      console.error('Failed to add category:', error)
    }
  }

  const updateCategory = async (categoryData) => {
    try {
      await apiUpdateCategory(editingCategory.id, categoryData)
      setEditingCategory(null)
    } catch (error) {
      console.error('Failed to update category:', error)
    }
  }

  const deleteCategory = async (action, targetCategoryId = null) => {
    try {
      if (action === 'delete') {
        // Delete category and all its prompts
        const categoryPrompts = prompts.filter(prompt => prompt.categoryId === deletingCategory.id)
        for (const prompt of categoryPrompts) {
          await apiDeletePrompt(prompt.id)
        }
        await apiDeleteCategory(deletingCategory.id)
      } else if (action === 'move' && targetCategoryId) {
        // Move prompts to another category, then delete the category
        const categoryPrompts = prompts.filter(prompt => prompt.categoryId === deletingCategory.id)
        for (const prompt of categoryPrompts) {
          await apiUpdatePrompt(prompt.id, { ...prompt, categoryId: targetCategoryId })
        }
        await apiDeleteCategory(deletingCategory.id)
      }
      
      // Clear selected category if it was deleted
      if (selectedCategory && selectedCategory.id === deletingCategory.id) {
        setSelectedCategory(null)
      }
      
      setDeletingCategory(null)
    } catch (error) {
      console.error('Failed to delete category:', error)
    }
  }

  const addPrompt = async (promptData) => {
    try {
      const newPrompt = {
        id: Date.now().toString(),
        categoryId: selectedCategory?.id || null,
        ...promptData
      }
      await apiAddPrompt(newPrompt)
      setShowPromptForm(false)
    } catch (error) {
      console.error('Failed to add prompt:', error)
    }
  }

  const updatePrompt = async (promptData) => {
    try {
      await apiUpdatePrompt(editingPrompt.id, promptData)
      setEditingPrompt(null)
    } catch (error) {
      console.error('Failed to update prompt:', error)
    }
  }

  const deletePrompt = async () => {
    try {
      await apiDeletePrompt(deletingPrompt.id)
      setDeletingPrompt(null)
    } catch (error) {
      console.error('Failed to delete prompt:', error)
    }
  }

  const duplicatePrompt = async (originalPrompt) => {
    try {
      const duplicatedPrompt = {
        id: Date.now().toString(),
        title: `Copy ${originalPrompt.title || originalPrompt.purpose}`,
        purpose: originalPrompt.purpose,
        prompt: originalPrompt.prompt,
        aiPersona: originalPrompt.aiPersona,
        outputFormat: originalPrompt.outputFormat,
        examples: originalPrompt.examples,
        reference: originalPrompt.reference,
        customFields: originalPrompt.customFields ? [...originalPrompt.customFields] : [],
        categoryId: originalPrompt.categoryId,
      }
      await apiAddPrompt(duplicatedPrompt)
    } catch (error) {
      console.error('Failed to duplicate prompt:', error)
    }
  }

  const movePrompt = async (prompt, targetCategoryId) => {
    try {
      await apiUpdatePrompt(prompt.id, { ...prompt, categoryId: targetCategoryId })
      setMovingPrompt(null)
    } catch (error) {
      console.error('Failed to move prompt:', error)
    }
  }

  const getCategoryPrompts = (categoryId) => {
    return prompts.filter(prompt => prompt.categoryId === categoryId)
  }

  const handleExportToExcel = () => {
    try {
      const result = exportPromptsToExcel(categories, prompts)
      if (result.success) {
        // You could add a toast notification here
        console.log(`Exported ${result.promptsExported} prompts from ${result.categoriesExported} categories to ${result.filename}`)
      }
    } catch (error) {
      console.error('Export failed:', error)
      // You could add error notification here
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg transition-colors">
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">AI Prompt Library</h1>
            <p className="text-gray-600 dark:text-gray-300">Organize and customize your AI prompts</p>
          </div>
          
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDarkMode ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            )}
          </button>
        </div>

        <div className="flex gap-8">
        {/* Sidebar */}
        <div className="w-80 flex-shrink-0">
          {/* Action Links */}
          <div className="flex gap-6 mb-6 text-sm">
            <button
              onClick={() => setShowCategoryForm(true)}
              className="flex items-center gap-1 text-primary dark:text-secondary hover:text-primary/80 dark:hover:text-secondary/80 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Category
            </button>
            
            <button
              onClick={() => setShowPromptForm(true)}
              className="flex items-center gap-1 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Prompt
            </button>
            
            {prompts.length > 0 && (
              <button
                onClick={handleExportToExcel}
                className="flex items-center gap-1 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                title="Export all prompts to Excel"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Export
              </button>
            )}
          </div>
          
          {/* Divider */}
          <div className="border-t border-gray-200 dark:border-gray-700 mb-6"></div>
          
          <CategoryList
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            onEditCategory={setEditingCategory}
            onDeleteCategory={setDeletingCategory}
          />
        </div>

        {/* Prompts Grid */}
        <div className="flex-1 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {selectedCategory ? selectedCategory.name : 'All Prompts'}
              </h2>
              {selectedCategory && selectedCategory.purpose && (
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  {selectedCategory.purpose}
                </p>
              )}
            </div>
          </div>

          {/* Loading and Error States */}
          {(categoriesLoading || promptsLoading) && (
            <div className="flex justify-center items-center py-8">
              <div className="text-gray-500 dark:text-gray-400">Loading...</div>
            </div>
          )}

          {(categoriesError || promptsError) && (
            <div className="bg-red-100 dark:bg-red-900 border border-red-400 text-red-700 dark:text-red-200 px-4 py-3 rounded mb-4">
              Error: {categoriesError || promptsError}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPrompts.map(prompt => (
              <PromptCard
                key={prompt.id}
                prompt={prompt}
                onEdit={() => {
                  console.log('Setting editing prompt:', prompt);
                  setEditingPrompt(prompt);
                }}
                onDuplicate={() => duplicatePrompt(prompt)}
                onMove={() => setMovingPrompt(prompt)}
                onDelete={() => setDeletingPrompt(prompt)}
                onCustomize={() => setCustomizePrompt(prompt)}
                onViewDetails={() => setViewingPrompt(prompt)}
              />
            ))}
          </div>

          {filteredPrompts.length === 0 && !categoriesLoading && !promptsLoading && selectedCategory && (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-300 mb-4">
                No prompts in this category
              </p>
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
      {(showPromptForm || editingPrompt) && (
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
          categories={categories.filter(cat => cat.id !== deletingCategory.id).sort((a, b) => a.name.localeCompare(b.name))}
          promptCount={getCategoryPrompts(deletingCategory.id).length}
          onConfirm={deleteCategory}
          onClose={() => setDeletingCategory(null)}
        />
      )}

      {/* Delete Prompt Modal */}
      {deletingPrompt && (
        <DeletePromptModal
          prompt={deletingPrompt}
          onConfirm={deletePrompt}
          onClose={() => setDeletingPrompt(null)}
        />
      )}

      {/* Move Prompt Modal */}
      {movingPrompt && (
        <MovePromptModal
          prompt={movingPrompt}
          categories={categories}
          onConfirm={(targetCategoryId) => movePrompt(movingPrompt, targetCategoryId)}
          onClose={() => setMovingPrompt(null)}
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
    </div>
  )
}

export default PromptLibrary
