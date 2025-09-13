const CategoryList = ({ categories, onSelectCategory, selectedCategory, onEditCategory, onDeleteCategory, onSelectAllPrompts, showingAllPrompts }) => {
  return (
    <div className="">
      <div className="mb-4">
        <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-1">Categories</h3>
        <p className="text-sm text-gray-500 dark:text-gray-300">Select a category to view prompts</p>
      </div>
      
      <div className="space-y-1">
        {/* All Prompts Option */}
        <div className="relative group">
          <div
            onClick={onSelectAllPrompts}
            className={`w-full text-left px-3 py-2 transition-colors flex items-center justify-between cursor-pointer ${
              showingAllPrompts
                ? 'bg-primary/10 text-primary dark:bg-primary/30 dark:text-white'
                : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="font-medium">All Prompts</span>
            </div>
          </div>
        </div>
        
        {/* Divider */}
        {categories.length > 0 && (
          <div className="border-t border-gray-200 dark:border-gray-600 my-2"></div>
        )}
        {categories.length === 0 ? (
          <div className="py-4 text-gray-500 dark:text-gray-300 text-sm">
            No categories yet
          </div>
        ) : (
          categories.sort((a, b) => a.name.localeCompare(b.name)).map(category => (
            <div key={category.id} className="relative group">
              <div
                onClick={() => onSelectCategory(category)}
                className={`w-full text-left px-3 py-2 transition-colors flex items-center justify-between cursor-pointer ${
                  selectedCategory?.id === category.id
                    ? 'bg-primary/10 text-primary dark:bg-primary/30 dark:text-white'
                    : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <span className="font-medium">{category.name}</span>
                
                {/* Edit/Delete buttons - always visible on mobile, hover on desktop */}
                <div className="flex gap-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onEditCategory(category)
                    }}
                    className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100 transition-colors"
                    title="Edit category"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onDeleteCategory(category)
                    }}
                    className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-500 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-300 transition-colors"
                    title="Delete category"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default CategoryList
