const DeletePromptModal = ({ prompt, onConfirm, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Delete Prompt</h2>
          
          <div className="mb-6">
            <p className="text-gray-700 mb-3">
              Are you sure you want to delete this prompt?
            </p>
            
            <div className="bg-gray-50 p-3 rounded-lg max-h-48 overflow-y-auto">
              <p className="text-sm font-medium text-gray-900 mb-1">Purpose:</p>
              <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                {prompt.purpose.length > 120 
                  ? `${prompt.purpose.substring(0, 120)}...` 
                  : prompt.purpose
                }
              </p>
              
              <p className="text-sm font-medium text-gray-900 mb-1">Prompt:</p>
              <div className="text-sm text-gray-600 font-mono leading-relaxed">
                {prompt.prompt.length > 200 
                  ? (
                    <>
                      {prompt.prompt.substring(0, 200)}
                      <span className="text-gray-400">... ({prompt.prompt.length - 200} more characters)</span>
                    </>
                  )
                  : prompt.prompt
                }
              </div>
              
              {/* Show other fields if they exist */}
              {prompt.aiPersona && (
                <>
                  <p className="text-sm font-medium text-gray-900 mb-1 mt-3">AI Persona:</p>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {prompt.aiPersona.length > 100 
                      ? `${prompt.aiPersona.substring(0, 100)}...` 
                      : prompt.aiPersona
                    }
                  </p>
                </>
              )}
              
              {prompt.customFields && prompt.customFields.length > 0 && (
                <>
                  <p className="text-sm font-medium text-gray-900 mb-1 mt-3">Custom Fields:</p>
                  <div className="flex flex-wrap gap-1">
                    {prompt.customFields.slice(0, 3).map((field, index) => (
                      <span key={index} className="inline-flex items-center px-2 py-1 rounded text-xs bg-primary/10 text-primary">
                        {field.name}
                      </span>
                    ))}
                    {prompt.customFields.length > 3 && (
                      <span className="text-xs text-gray-500">+{prompt.customFields.length - 3} more</span>
                    )}
                  </div>
                </>
              )}
            </div>
            
            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm font-medium">
                ⚠️ This action cannot be undone
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onConfirm}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors"
            >
              Delete Prompt
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

export default DeletePromptModal
