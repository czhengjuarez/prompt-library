import { useState } from 'react'
import PromptCard from './PromptCard'
import CustomizePromptModal from './CustomizePromptModal'
import PromptDetailsModal from './PromptDetailsModal'
import ShareLinkModal from './ShareLinkModal'
import { useURLRouter } from '../hooks/useURLRouter'

const SharedPromptView = ({ prompt, category, onBackToLibrary, isLoading }) => {
  const [customizePrompt, setCustomizePrompt] = useState(null)
  const [viewingPrompt, setViewingPrompt] = useState(null)
  const [sharingPrompt, setSharingPrompt] = useState(null)
  const { getShareableURL } = useURLRouter()

  const handleCustomize = () => {
    setCustomizePrompt(prompt)
  }

  const handleViewDetails = () => {
    setViewingPrompt(prompt)
  }

  const handleShare = () => {
    setSharingPrompt(prompt)
  }

  // Show loading state if data is still loading
  if (isLoading || !prompt) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-bg transition-colors">
        <div className="p-6">
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={onBackToLibrary}
              className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Library
            </button>
          </div>
          
          <div className="max-w-2xl mx-auto text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Loading Shared Prompt...
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Please wait while we fetch the prompt details.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg transition-colors">
      <div className="p-6">
        {/* Header with back navigation */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={onBackToLibrary}
              className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Library
            </button>
          </div>
          
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
              </svg>
              <div>
                <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                  Shared Prompt
                </h3>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  You're viewing a shared prompt. {category && `This prompt belongs to the "${category.name}" category.`}
                </p>
              </div>
            </div>
          </div>

          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {prompt.title || prompt.purpose}
            </h1>
            {prompt.title && (
              <p className="text-lg text-gray-600 dark:text-gray-300">
                {prompt.purpose}
              </p>
            )}
            {category && (
              <div className="mt-3">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary">
                  📁 {category.name}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Centered prompt card */}
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <PromptCard
              prompt={prompt}
              onCustomize={handleCustomize}
              onViewDetails={handleViewDetails}
              onShare={handleShare}
              onEdit={handleViewDetails} // Show details instead of edit
              onDuplicate={() => {}} // Disabled in shared view
              onMove={() => {}} // Disabled in shared view
              onDelete={() => {}} // Disabled in shared view
              isHighlighted={true}
              disabledActions={['duplicate', 'move', 'delete']}
            />
          </div>

        </div>
      </div>

      {/* Modals */}
      {customizePrompt && (
        <CustomizePromptModal
          prompt={customizePrompt}
          onClose={() => setCustomizePrompt(null)}
        />
      )}

      {viewingPrompt && (
        <PromptDetailsModal
          prompt={viewingPrompt}
          onClose={() => setViewingPrompt(null)}
        />
      )}

      {sharingPrompt && (
        <ShareLinkModal
          prompt={sharingPrompt}
          shareURL={getShareableURL(sharingPrompt.id, {
            title: sharingPrompt.title,
            purpose: sharingPrompt.purpose,
            categoryId: sharingPrompt.categoryId
          })}
          onClose={() => setSharingPrompt(null)}
        />
      )}
    </div>
  )
}

export default SharedPromptView
