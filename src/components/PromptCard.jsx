const PromptCard = ({ prompt, onCustomize, onEdit, onDelete, onViewDetails, onDuplicate }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow">
      <div className="mb-3">
        <div className="flex items-start justify-between">
          <button
            onClick={() => onViewDetails(prompt)}
            className="text-left flex-1 group pr-2"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-primary transition-colors">
              {prompt.title || prompt.purpose}
            </h3>
          </button>
          <div className="flex items-center gap-1 relative z-10">
            <button
              onClick={(e) => {
                e.stopPropagation();
                console.log('Duplicate clicked');
                onDuplicate();
              }}
              className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors relative z-10"
              title="Duplicate prompt"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                console.log('Edit clicked');
                onEdit();
              }}
              className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors relative z-10"
              title="Edit prompt"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                console.log('Delete clicked');
                onDelete();
              }}
              className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors relative z-10"
              title="Delete prompt"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
        {prompt.title && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
            {prompt.purpose.length > 80 
              ? `${prompt.purpose.substring(0, 80)}...` 
              : prompt.purpose
            }
          </p>
        )}
        
        {/* Show custom fields count if any */}
        {prompt.customFields && prompt.customFields.length > 0 && (
          <div className="mt-2">
            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-primary/10 text-primary">
              {prompt.customFields.length} custom field{prompt.customFields.length !== 1 ? 's' : ''}
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <button
          onClick={onCustomize}
          className="w-full bg-gray-600 hover:bg-gray-700 text-white py-2 px-3 rounded-md text-sm font-medium transition-colors"
        >
          Customize & Copy
        </button>
      </div>
    </div>
  )
}

export default PromptCard
