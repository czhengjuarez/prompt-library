const PromptDetailsModal = ({ prompt, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{prompt.title || prompt.purpose}</h2>
              {prompt.title && (
                <p className="text-gray-600">{prompt.purpose}</p>
              )}
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-6">
            {prompt.aiPersona && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">AI Persona</h3>
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{prompt.aiPersona}</p>
                </div>
              </div>
            )}

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Prompt</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-700 font-mono leading-relaxed whitespace-pre-wrap">{prompt.prompt}</p>
              </div>
            </div>

            {prompt.outputFormat && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Output Format</h3>
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{prompt.outputFormat}</p>
                </div>
              </div>
            )}

            {prompt.example && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Example</h3>
                <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{prompt.example}</p>
                </div>
              </div>
            )}

            {prompt.reference && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Reference Context</h3>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{prompt.reference}</p>
                </div>
              </div>
            )}

            {prompt.customFields && prompt.customFields.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Custom Fields</h3>
                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <div className="grid grid-cols-2 gap-3">
                    {prompt.customFields.map((field, index) => (
                      <div key={index} className="flex items-center">
                        <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-primary/10 text-primary">
                          {field.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-6 mt-6 border-t border-gray-200">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-md text-sm font-medium transition-colors border border-gray-200"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PromptDetailsModal
