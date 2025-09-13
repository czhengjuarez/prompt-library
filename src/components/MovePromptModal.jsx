import { useState } from 'react'

const MovePromptModal = ({ prompt, categories, onConfirm, onClose }) => {
  const [targetCategory, setTargetCategory] = useState('')

  const handleConfirm = () => {
    if (targetCategory) {
      onConfirm(targetCategory)
    }
  }

  const availableCategories = categories.filter(cat => cat.id !== prompt.categoryId)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Move Prompt</h2>
          
          <div className="mb-4">
            <p className="text-gray-700 dark:text-gray-300 mb-2">
              Move "<span className="font-semibold">{prompt.title || prompt.purpose}</span>" to a different category:
            </p>
            
            <div className="mt-3">
              <select
                value={targetCategory}
                onChange={(e) => setTargetCategory(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border-0 rounded-lg focus:bg-white dark:focus:bg-gray-600 focus:ring-2 focus:ring-primary focus:outline-none transition-all text-sm text-gray-900 dark:text-white"
                required
              >
                <option value="">Select target category...</option>
                {availableCategories.sort((a, b) => a.name.localeCompare(b.name)).map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleConfirm}
              disabled={!targetCategory}
              className="flex-1 bg-primary hover:bg-primary/90 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors"
            >
              Move Prompt
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-md text-sm font-medium transition-colors border border-gray-200 dark:border-gray-600"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MovePromptModal
