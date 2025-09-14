import { useState, useEffect } from 'react'

const PromptForm = ({ selectedCategory, editingPrompt, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    whenINeedTo: '',
    iWant: '',
    soICan: '',
    aiPersona: '',
    prompt: '',
    reference: '',
    outputFormat: '',
    example: ''
  })
  const [customFields, setCustomFields] = useState([{ name: '', type: 'text' }])
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (editingPrompt) {
      setFormData({
        title: editingPrompt.title || '',
        whenINeedTo: editingPrompt.purpose ? editingPrompt.purpose.split(', I want ')[0]?.replace('When I need to ', '') || '' : '',
        iWant: editingPrompt.purpose ? editingPrompt.purpose.split(', I want ')[1]?.split(' so I can ')[0] || '' : '',
        soICan: editingPrompt.purpose ? editingPrompt.purpose.split(' so I can ')[1] || '' : '',
        aiPersona: editingPrompt.aiPersona || '',
        prompt: editingPrompt.prompt || '',
        reference: editingPrompt.reference || '',
        outputFormat: editingPrompt.outputFormat || '',
        example: editingPrompt.example || ''
      })
      setCustomFields(editingPrompt.customFields || [{ name: '', type: 'text' }])
    } else {
      setFormData({
        title: '',
        whenINeedTo: '',
        iWant: '',
        soICan: '',
        aiPersona: '',
        prompt: '',
        reference: '',
        outputFormat: '',
        example: ''
      })
      setCustomFields([{ name: '', type: 'text' }])
    }
  }, [editingPrompt])

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Clear previous errors
    setErrors({})
    
    // Validate required fields
    const newErrors = {}
    if (!formData.title.trim()) newErrors.title = 'Title is required'
    if (!formData.whenINeedTo.trim()) newErrors.whenINeedTo = 'This field is required'
    if (!formData.iWant.trim()) newErrors.iWant = 'This field is required'
    if (!formData.soICan.trim()) newErrors.soICan = 'This field is required'
    if (!formData.prompt.trim()) newErrors.prompt = 'Prompt template is required'
    if (!formData.outputFormat.trim()) newErrors.outputFormat = 'Output format is required'
    
    // If there are errors, set them and return
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    // Create purpose from job-to-be-done framework
    const purpose = `When I need to ${formData.whenINeedTo}, I want ${formData.iWant} so I can ${formData.soICan}`

    // Extract placeholders from all prompt-related fields
    const allText = `${formData.prompt} ${formData.aiPersona} ${formData.outputFormat} ${formData.example} ${formData.reference}`
    const templatePlaceholders = extractPlaceholders(allText)
    
    // Get manual custom fields with their descriptions
    const manualCustomFields = customFields
      .filter(field => field.name.trim())
      .map(field => ({ 
        name: field.name.trim(), 
        type: 'text',
        description: field.description?.trim() || ''
      }))
    
    // Create a map to preserve descriptions for existing fields
    const fieldDescriptionMap = {}
    manualCustomFields.forEach(field => {
      fieldDescriptionMap[field.name] = field.description
    })
    
    // If editing, also preserve existing field descriptions
    if (editingPrompt?.customFields) {
      editingPrompt.customFields.forEach(field => {
        if (!fieldDescriptionMap[field.name]) {
          fieldDescriptionMap[field.name] = field.description || ''
        }
      })
    }
    
    // Merge and deduplicate, preserving descriptions
    const allFieldNames = [...new Set([...templatePlaceholders, ...manualCustomFields.map(f => f.name)])]
    const allCustomFields = allFieldNames.map(name => ({
      name,
      type: 'text',
      description: fieldDescriptionMap[name] || ''
    }))

    const newPrompt = {
      id: editingPrompt?.id || Date.now().toString(),
      categoryId: selectedCategory?.id || editingPrompt?.categoryId || null,
      title: formData.title.trim(),
      purpose: purpose,
      prompt: formData.prompt.trim(),
      aiPersona: formData.aiPersona.trim(),
      outputFormat: formData.outputFormat.trim(),
      example: formData.example.trim(),
      reference: formData.reference.trim(),
      customFields: allCustomFields
    }

    onSubmit(newPrompt)
    
    if (!editingPrompt) {
      setFormData({
        title: '',
        whenINeedTo: '',
        iWant: '',
        soICan: '',
        aiPersona: '',
        prompt: '',
        reference: '',
        outputFormat: '',
        example: ''
      })
      setCustomFields([{ name: '', type: 'text' }])
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const getAutoDetectedFields = () => {
    const allText = `${formData.prompt} ${formData.aiPersona} ${formData.outputFormat} ${formData.example} ${formData.reference}`
    return extractPlaceholders(allText)
  }

  // Extract placeholders from text
  const extractPlaceholders = (text) => {
    const matches = text.match(/\{([^}]+)\}/g)
    return matches ? matches.map(match => match.slice(1, -1)) : []
  }

  const addCustomField = () => {
    setCustomFields([...customFields, { name: '', type: 'text' }])
  }

  const removeCustomField = (index) => {
    if (customFields.length > 1) {
      setCustomFields(customFields.filter((_, i) => i !== index))
    }
  }

  const updateCustomField = (index, field, value) => {
    const updated = customFields.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    )
    setCustomFields(updated)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            {editingPrompt ? 'Edit Prompt' : 'Add New Prompt'}
          </h2>
          <p className="text-gray-600 mb-6">Category: {selectedCategory?.name || 'All Prompts'}</p>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Interview Plan, Blog Post, Meeting Agenda"
                className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent ${
                  errors.title ? 'border-red-500' : 'border-gray-300'
                }`}
                required
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title}</p>
              )}
            </div>

            {/* Purpose */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Purpose</h3>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="whenINeedTo" className="block text-sm font-medium text-gray-700 mb-1">
                    When I need to... *
                  </label>
                  <input
                    type="text"
                    id="whenINeedTo"
                    name="whenINeedTo"
                    value={formData.whenINeedTo}
                    onChange={handleChange}
                    placeholder="e.g., write a blog post, analyze data, create social media content"
                    className={`w-full px-4 py-3 border-0 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none transition-all ${
                      errors.whenINeedTo ? 'bg-red-50 ring-1 ring-red-200' : 'bg-gray-50 focus:bg-white'
                    }`}
                    required
                  />
                  {errors.whenINeedTo && (
                    <p className="text-red-500 text-sm mt-1">{errors.whenINeedTo}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="iWant" className="block text-sm font-medium text-gray-700 mb-1">
                    I want... *
                  </label>
                  <input
                    type="text"
                    id="iWant"
                    name="iWant"
                    value={formData.iWant}
                    onChange={handleChange}
                    placeholder="e.g., engaging content, clear insights, compelling copy"
                    className={`w-full px-4 py-3 border-0 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none transition-all ${
                      errors.iWant ? 'bg-red-50 ring-1 ring-red-200' : 'bg-gray-50 focus:bg-white'
                    }`}
                    required
                  />
                  {errors.iWant && (
                    <p className="text-red-500 text-sm mt-1">{errors.iWant}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="soICan" className="block text-sm font-medium text-gray-700 mb-1">
                    So I can... *
                  </label>
                  <input
                    type="text"
                    id="soICan"
                    name="soICan"
                    value={formData.soICan}
                    onChange={handleChange}
                    placeholder="e.g., attract more readers, make better decisions, increase conversions"
                    className={`w-full px-4 py-3 border-0 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none transition-all ${
                      errors.soICan ? 'bg-red-50 ring-1 ring-red-200' : 'bg-gray-50 focus:bg-white'
                    }`}
                    required
                  />
                  {errors.soICan && (
                    <p className="text-red-500 text-sm mt-1">{errors.soICan}</p>
                  )}
                </div>

                {/* Purpose Preview */}
                {(formData.whenINeedTo || formData.iWant || formData.soICan) && (
                  <div className="mt-3 p-3 bg-white border border-gray-200 rounded-lg">
                    <p className="text-sm text-gray-600 font-medium">Purpose Preview:</p>
                    <p className="text-sm text-gray-800 mt-1">
                      When I need to <span className="font-medium">{formData.whenINeedTo || '[...]'}</span>, 
                      I want <span className="font-medium">{formData.iWant || '[...]'}</span> so 
                      I can <span className="font-medium">{formData.soICan || '[...]'}</span>
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* AI Persona */}
            <div>
              <label htmlFor="aiPersona" className="block text-sm font-medium text-gray-700 mb-1">
                AI Persona (Optional)
              </label>
              <textarea
                id="aiPersona"
                name="aiPersona"
                value={formData.aiPersona}
                onChange={handleChange}
                placeholder="You are an expert hiring manager and recruitment strategist at {company}. Your mission is to create a comprehensive and effective interview plan tailored to a specific role and level, ensuring a fair and insightful assessment of the candidate..."
                rows={4}
                className="w-full px-4 py-3 bg-gray-50 border-0 rounded-lg focus:bg-white focus:ring-2 focus:ring-primary focus:outline-none transition-all resize-none"
              />
              <div className="mt-2 p-3 bg-green-50 rounded-lg border border-green-200">
                <p className="text-xs text-green-800 font-medium mb-1">✨ AI Persona Tips:</p>
                <ul className="text-xs text-green-700 space-y-1">
                  <li>• Define the AI's role: "You are a senior marketing strategist..."</li>
                  <li>• Include expertise areas and context</li>
                  <li>• You can use placeholders here too: "You are an expert at {"{company}"}..."</li>
                </ul>
              </div>
            </div>

            {/* Prompt */}
            <div>
              <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-1">
                Prompt Template *
              </label>
              <textarea
                id="prompt"
                name="prompt"
                value={formData.prompt}
                onChange={handleChange}
                placeholder="Enter your AI prompt template here. Use placeholders like {topic}, {audience}, {tone} for customization..."
                rows={6}
                className={`w-full px-4 py-3 border-0 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none transition-all resize-none ${
                  errors.prompt ? 'bg-red-50 ring-1 ring-red-200' : 'bg-gray-50 focus:bg-white'
                }`}
                required
              />
              {errors.prompt && (
                <p className="text-red-500 text-sm mt-1">{errors.prompt}</p>
              )}
              <div className="mt-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-xs text-blue-800 font-medium mb-1">💡 Making Your Prompt Customizable:</p>
                <ul className="text-xs text-blue-700 space-y-1">
                  <li>• Use placeholders like {"{topic}"}, {"{audience}"}, {"{tone}"} in your prompt</li>
                  <li>• These will automatically become customizable fields</li>
                  <li>• You can also manually add custom fields below for more detailed descriptions</li>
                  <li>• Avoid duplicating field names between placeholders and custom fields</li>
                </ul>
              </div>
            </div>

            {/* Reference */}
            <div>
              <label htmlFor="reference" className="block text-sm font-medium text-gray-700 mb-1">
                Reference Context (Optional)
              </label>
              <textarea
                id="reference"
                name="reference"
                value={formData.reference}
                onChange={handleChange}
                placeholder="Add detailed context, examples, or additional information to help AI generate more accurate results..."
                rows={4}
                className="w-full px-4 py-3 bg-gray-50 border-0 rounded-lg focus:bg-white focus:ring-2 focus:ring-primary focus:outline-none transition-all resize-none"
              />
              <p className="text-xs text-gray-500 mt-1">
                This context will be combined with the prompt for better AI results
              </p>
            </div>

            {/* Output Format */}
            <div>
              <label htmlFor="outputFormat" className="block text-sm font-medium text-gray-700 mb-1">
                Output Format *
              </label>
              <textarea
                id="outputFormat"
                name="outputFormat"
                value={formData.outputFormat}
                onChange={handleChange}
                placeholder="Specify the desired output format, structure, or style. E.g., 'Provide a bulleted list with 5 items', 'Format as JSON', 'Write in markdown with headers'..."
                rows={3}
                className={`w-full px-4 py-3 border-0 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none transition-all resize-none ${
                  errors.outputFormat ? 'bg-red-50 ring-1 ring-red-200' : 'bg-gray-50 focus:bg-white'
                }`}
                required
              />
              {errors.outputFormat && (
                <p className="text-red-500 text-sm mt-1">{errors.outputFormat}</p>
              )}
              <div className="mt-2 p-3 bg-purple-50 rounded-lg border border-purple-200">
                <p className="text-xs text-purple-800 font-medium mb-1">📋 Output Format Examples:</p>
                <ul className="text-xs text-purple-700 space-y-1">
                  <li>• "Provide 3 bullet points with actionable recommendations"</li>
                  <li>• "Format as a table with columns: Task, Priority, Timeline"</li>
                  <li>• "Write as a professional email with subject line"</li>
                  <li>• "Structure as: Problem → Solution → Next Steps"</li>
                </ul>
              </div>
            </div>

            {/* Example */}
            <div>
              <label htmlFor="example" className="block text-sm font-medium text-gray-700 mb-1">
                Example (Optional)
              </label>
              <textarea
                id="example"
                name="example"
                value={formData.example}
                onChange={handleChange}
                placeholder="Provide an example of the desired output to guide the AI. This helps ensure consistency and quality..."
                rows={4}
                className="w-full px-4 py-3 bg-gray-50 border-0 rounded-lg focus:bg-white focus:ring-2 focus:ring-primary focus:outline-none transition-all resize-none"
              />
              <div className="mt-2 p-3 bg-indigo-50 rounded-lg border border-indigo-200">
                <p className="text-xs text-indigo-800 font-medium mb-1">💡 Example Tips:</p>
                <ul className="text-xs text-indigo-700 space-y-1">
                  <li>• Show the exact format, tone, and structure you want</li>
                  <li>• Use placeholder values that match your custom fields</li>
                  <li>• Include the level of detail expected</li>
                </ul>
              </div>
            </div>

            {/* Custom Fields */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="block text-sm font-medium text-gray-700">
                  Custom Fields (Optional)
                </label>
                <button
                  type="button"
                  onClick={addCustomField}
                  className="text-sm text-primary hover:text-primary/80 font-medium"
                >
                  + Add Field
                </button>
              </div>
              
              {/* Auto-detected fields preview */}
              {getAutoDetectedFields().length > 0 && (
                <div className="mb-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <p className="text-xs text-yellow-800 font-medium mb-2">🔍 Auto-detected fields from your prompt:</p>
                  <div className="flex flex-wrap gap-2">
                    {getAutoDetectedFields().map((field, index) => (
                      <span key={index} className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-yellow-100 text-yellow-800">
                        {field}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-yellow-700 mt-2">These will automatically become customizable fields. Only add manual fields if you need different names or descriptions.</p>
                </div>
              )}
              
              <div className="space-y-3">
                {customFields.map((field, index) => {
                  const autoDetectedFields = getAutoDetectedFields()
                  const isDuplicate = field.name && autoDetectedFields.includes(field.name)
                  
                  return (
                    <div key={index} className="flex gap-3 items-start">
                      <div className="flex-1">
                        <input
                          type="text"
                          placeholder="Field name (e.g., level, interviewer)"
                          value={field.name}
                          onChange={(e) => updateCustomField(index, 'name', e.target.value)}
                          className={`w-full px-3 py-2 border-0 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none transition-all text-sm ${
                            isDuplicate 
                              ? 'bg-red-50 focus:bg-red-50 ring-1 ring-red-200' 
                              : 'bg-gray-50 focus:bg-white'
                          }`}
                        />
                        {isDuplicate && (
                          <p className="text-xs text-red-600 mt-1">⚠️ This field is already auto-detected from your prompt</p>
                        )}
                      </div>
                      <div className="flex-1">
                        <input
                          type="text"
                          placeholder="Description (e.g., Experience level required)"
                          value={field.description}
                          onChange={(e) => updateCustomField(index, 'description', e.target.value)}
                          className="w-full px-3 py-2 bg-gray-50 border-0 rounded-lg focus:bg-white focus:ring-2 focus:ring-primary focus:outline-none transition-all text-sm"
                        />
                      </div>
                      {customFields.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeCustomField(index)}
                          className="text-gray-400 hover:text-red-500 transition-colors mt-2"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                    </div>
                  )
                })}
              </div>
              
              <div className="mt-2 p-3 bg-orange-50 rounded-lg border border-orange-200">
                <p className="text-xs text-orange-800 font-medium mb-1">📝 How Custom Fields Work:</p>
                <ul className="text-xs text-orange-700 space-y-1">
                  <li>• Custom fields will be automatically added to your prompt as "Input Details"</li>
                  <li>• They appear right after the AI Persona section</li>
                  <li>• Only use custom fields when you need structured input data</li>
                  <li>• For text replacement, use placeholders like {"{fieldName}"} instead</li>
                </ul>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="flex-1 bg-primary hover:bg-primary/90 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors"
              >
                {editingPrompt ? 'Update Prompt' : 'Create Prompt'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-md text-sm font-medium transition-colors border border-gray-200"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default PromptForm
