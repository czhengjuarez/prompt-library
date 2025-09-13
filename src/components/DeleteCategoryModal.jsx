import { useState } from 'react'

const DeleteCategoryModal = ({ category, categories, promptCount, onConfirm, onClose }) => {
  const [action, setAction] = useState('delete') // 'delete' or 'move'
  const [targetCategory, setTargetCategory] = useState('')

  const handleConfirm = () => {
    if (action === 'move' && targetCategory) {
      onConfirm('move', targetCategory)
    } else {
      onConfirm('delete')
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Delete Category</h2>
          
          <div className="mb-4">
            <p className="text-gray-700 mb-2">
              Are you sure you want to delete "<span className="font-semibold">{category.name}</span>"?
            </p>
            
            {promptCount > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                <p className="text-yellow-800 text-sm font-medium mb-2">
                  ⚠️ This category contains {promptCount} prompt{promptCount > 1 ? 's' : ''}
                </p>
                
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="action"
                      value="delete"
                      checked={action === 'delete'}
                      onChange={(e) => setAction(e.target.value)}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">Delete all prompts with the category</span>
                  </label>
                  
                  {categories.length > 0 && (
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="action"
                        value="move"
                        checked={action === 'move'}
                        onChange={(e) => setAction(e.target.value)}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">Move prompts to another category</span>
                    </label>
                  )}
                </div>
                
                {action === 'move' && categories.length > 0 && (
                  <div className="mt-3">
                    <select
                      value={targetCategory}
                      onChange={(e) => setTargetCategory(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-50 border-0 rounded-lg focus:bg-white focus:ring-2 focus:ring-primary focus:outline-none transition-all text-sm"
                      required
                    >
                      <option value="">Select target category...</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleConfirm}
              disabled={action === 'move' && !targetCategory}
              className="flex-1 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-300 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors"
            >
              Delete Category
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-md text-sm font-medium transition-colors border border-gray-200"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DeleteCategoryModal
