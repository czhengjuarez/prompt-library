const PromptCard = ({ prompt, onCustomize, onEdit, onDelete, onViewDetails, onDuplicate, onMove, onShare, isHighlighted, disabledActions = [] }) => {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border p-4 hover:shadow-md transition-all ${
      isHighlighted 
        ? 'border-primary dark:border-secondary ring-2 ring-primary/20 dark:ring-secondary/20' 
        : 'border-gray-200 dark:border-gray-700'
    }`}>
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
                if (!disabledActions.includes('share')) onShare();
              }}
              className={`p-2 rounded transition-colors relative z-10 ${
                disabledActions.includes('share')
                  ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
              }`}
              title={disabledActions.includes('share') ? 'Sharing disabled' : 'Copy link to prompt'}
              disabled={disabledActions.includes('share')}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
              </svg>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (!disabledActions.includes('duplicate')) {
                  console.log('Duplicate clicked');
                  onDuplicate();
                }
              }}
              className={`p-2 rounded transition-colors relative z-10 ${
                disabledActions.includes('duplicate')
                  ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
              }`}
              title={disabledActions.includes('duplicate') ? 'Duplicating disabled' : 'Duplicate prompt'}
              disabled={disabledActions.includes('duplicate')}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (!disabledActions.includes('move')) {
                  console.log('Move clicked');
                  onMove();
                }
              }}
              className={`p-2 rounded transition-colors relative z-10 ${
                disabledActions.includes('move')
                  ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
              }`}
              title={disabledActions.includes('move') ? 'Moving disabled' : 'Move to category'}
              disabled={disabledActions.includes('move')}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (!disabledActions.includes('edit')) {
                  onEdit(prompt);
                }
              }}
              className={`p-2 rounded transition-colors relative z-10 ${
                disabledActions.includes('edit')
                  ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
              }`}
              title={disabledActions.includes('edit') ? 'Editing disabled' : 'Edit prompt'}
              disabled={disabledActions.includes('edit')}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (!disabledActions.includes('delete')) {
                  onDelete(prompt);
                }
              }}
              className={`p-2 rounded transition-colors relative z-10 ${
                disabledActions.includes('delete')
                  ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
                  : 'hover:bg-red-100 dark:hover:bg-red-900/20 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400'
              }`}
              title={disabledActions.includes('delete') ? 'Deleting disabled' : 'Delete prompt'}
              disabled={disabledActions.includes('delete')}
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
