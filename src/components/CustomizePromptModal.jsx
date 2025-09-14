import { useState, useEffect } from 'react'

const CustomizePromptModal = ({ prompt, onClose }) => {
  const [customFields, setCustomFields] = useState({})
  const [customizedPrompt, setCustomizedPrompt] = useState('')
  const [copied, setCopied] = useState(false)

  // Extract placeholders from prompt (e.g., {topic}, {audience})
  const extractPlaceholders = (text) => {
    const matches = text.match(/\{([^}]+)\}/g)
    return matches ? matches.map(match => match.slice(1, -1)) : []
  }

  // Extract placeholders from all text fields
  const promptPlaceholders = extractPlaceholders(prompt.prompt || '')
  const personaPlaceholders = extractPlaceholders(prompt.aiPersona || '')
  const outputFormatPlaceholders = extractPlaceholders(prompt.outputFormat || '')
  const examplePlaceholders = extractPlaceholders(prompt.example || '')
  const referencePlaceholders = extractPlaceholders(prompt.reference || '')
  
  const allTemplatePlaceholders = [...new Set([
    ...promptPlaceholders,
    ...personaPlaceholders, 
    ...outputFormatPlaceholders,
    ...examplePlaceholders,
    ...referencePlaceholders
  ])]
  
  const customFieldNames = prompt.customFields ? prompt.customFields.map(field => field.name) : []
  const allFields = [...new Set([...allTemplatePlaceholders, ...customFieldNames])]

  useEffect(() => {
    // Initialize custom fields
    const initialFields = {}
    allFields.forEach(field => {
      initialFields[field] = ''
    })
    setCustomFields(initialFields)
  }, [prompt])

  // Helper function to replace placeholders in text
  const replaceCustomFields = (text) => {
    if (!text) return ''
    let result = text
    Object.entries(customFields).forEach(([key, value]) => {
      result = result.replace(new RegExp(`\\{${key}\\}`, 'g'), value || `{${key}}`)
    })
    return result
  }

  useEffect(() => {
    // Generate customized prompt
    let customized = ''
    
    // Add AI Persona if it exists
    if (prompt.aiPersona) {
      customized += replaceCustomFields(prompt.aiPersona) + '\n\n'
    }
    
    // Only add "Input Details" for custom fields that are NOT placeholders (i.e., don't appear in any text)
    if (prompt.customFields && prompt.customFields.length > 0) {
      const filledCustomFields = prompt.customFields.filter(field => {
        const fieldName = field.name.trim()
        const hasValue = customFields[fieldName] && customFields[fieldName].trim()
        // Only include if it has a value AND is not a template placeholder
        const isTemplatePlaceholder = allTemplatePlaceholders.includes(fieldName)
        return fieldName && hasValue && !isTemplatePlaceholder
      })
      
      if (filledCustomFields.length > 0) {
        customized += 'Input Details:\n'
        filledCustomFields.forEach(field => {
          const value = customFields[field.name] || '[Not specified]'
          customized += `- ${field.name}: ${value}\n`
        })
        customized += '\n'
      }
    }
    
    // Add main prompt
    customized += replaceCustomFields(prompt.prompt)

    // Add output format if it exists
    if (prompt.outputFormat) {
      customized += `\n\nOutput Format:\n${replaceCustomFields(prompt.outputFormat)}`
    }

    // Add example if it exists
    if (prompt.example) {
      customized += `\n\nExample:\n${replaceCustomFields(prompt.example)}`
    }

    // Add reference context if it exists
    if (prompt.reference) {
      customized += `\n\nReference Context:\n${replaceCustomFields(prompt.reference)}`
    }

    setCustomizedPrompt(customized)
  }, [customFields, prompt, allTemplatePlaceholders])

  const handleFieldChange = (field, value) => {
    setCustomFields(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(customizedPrompt)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Customize Prompt</h2>
              <h3 className="text-lg font-semibold text-gray-700 mb-1">{prompt.title || 'Untitled Prompt'}</h3>
              <p className="text-gray-600">{prompt.purpose}</p>
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Customization Fields */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Customize Fields</h3>
              
              {allFields.length > 0 ? (
                <div className="space-y-4">
                  {allFields.map(fieldName => {
                    const customField = prompt.customFields?.find(f => f.name === fieldName)
                    const displayName = customField ? customField.name : fieldName
                    const description = customField ? customField.description : ''
                    
                    return (
                      <div key={fieldName}>
                        <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                          {displayName.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </label>
                        {description && (
                          <p className="text-xs text-gray-500 mb-2">{description}</p>
                        )}
                        <input
                          type="text"
                          value={customFields[fieldName] || ''}
                          onChange={(e) => handleFieldChange(fieldName, e.target.value)}
                          placeholder={description || `Enter ${displayName}...`}
                          className="w-full px-4 py-3 bg-gray-50 border-0 rounded-lg focus:bg-white focus:ring-2 focus:ring-primary focus:outline-none transition-all"
                        />
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No customizable fields found in this prompt.</p>
                  <p className="text-sm mt-2">Add placeholders like {"{topic}"} or custom fields to make prompts customizable.</p>
                </div>
              )}
            </div>

            {/* Preview */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Preview</h3>
                <button
                  onClick={copyToClipboard}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    copied
                      ? 'bg-green-100 text-green-800'
                      : 'bg-primary hover:bg-primary/90 text-white'
                  }`}
                >
                  {copied ? (
                    <>
                      <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Copied!
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      Copy to Clipboard
                    </>
                  )}
                </button>
              </div>
              
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 max-h-96 overflow-y-auto">
                <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono leading-relaxed">
                  {customizedPrompt}
                </pre>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md text-sm font-medium transition-colors border border-gray-200"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CustomizePromptModal
