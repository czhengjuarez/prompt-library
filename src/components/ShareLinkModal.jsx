import { useState } from 'react'

const ShareLinkModal = ({ prompt, shareURL, onClose }) => {
  const [copied, setCopied] = useState(false)

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareURL).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }).catch(() => {
      // Fallback for older browsers
      console.log('Share URL:', shareURL)
    })
  }

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Share Prompt
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            Sharing: <span className="font-medium text-gray-900 dark:text-white">
              {prompt.title || prompt.purpose}
            </span>
          </p>
          
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 border">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Link:</p>
            <p className="text-sm text-gray-900 dark:text-white font-mono break-all">
              {shareURL}
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleCopyLink}
            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
              copied
                ? 'bg-green-600 text-white'
                : 'bg-primary hover:bg-primary-dark text-white'
            }`}
          >
            {copied ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Copied!
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copy Link
              </span>
            )}
          </button>
          
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Close
          </button>
        </div>

        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p className="text-xs text-blue-700 dark:text-blue-300">
            💡 Recipients will see "{prompt.title || prompt.purpose}" in the URL and can access this prompt directly.
          </p>
        </div>
      </div>
    </div>
  )
}

export default ShareLinkModal
