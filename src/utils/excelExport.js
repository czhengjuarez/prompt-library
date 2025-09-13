import * as XLSX from 'xlsx'

// Export prompts to Excel with categories as separate tabs
export const exportPromptsToExcel = (categories, prompts) => {
  // Create a new workbook
  const workbook = XLSX.utils.book_new()

  // Get all unique custom field names across all prompts
  const allCustomFields = new Set()
  prompts.forEach(prompt => {
    if (prompt.customFields && Array.isArray(prompt.customFields)) {
      prompt.customFields.forEach(field => {
        if (field.name) {
          allCustomFields.add(field.name)
        }
      })
    }
  })

  // Convert to sorted array for consistent column order
  const customFieldNames = Array.from(allCustomFields).sort()

  // Define standard columns
  const standardColumns = [
    'Title',
    'Purpose',
    'AI Persona',
    'Prompt',
    'Output Format',
    'Example',
    'Reference'
  ]

  // Create header row with standard columns + custom fields
  const headers = [...standardColumns, ...customFieldNames]

  // Helper function to convert prompt to row data
  const promptToRow = (prompt) => {
    const row = {}
    
    // Standard fields
    row['Title'] = prompt.title || ''
    row['Purpose'] = prompt.purpose || ''
    row['AI Persona'] = prompt.aiPersona || ''
    row['Prompt'] = prompt.prompt || ''
    row['Output Format'] = prompt.outputFormat || ''
    row['Example'] = prompt.example || ''
    row['Reference'] = prompt.reference || ''

    // Initialize all custom fields as empty
    customFieldNames.forEach(fieldName => {
      row[fieldName] = ''
    })

    // Fill in actual custom field values
    if (prompt.customFields && Array.isArray(prompt.customFields)) {
      prompt.customFields.forEach(field => {
        if (field.name && field.value) {
          row[field.name] = field.value
        }
      })
    }

    return row
  }

  // Create worksheets for each category
  categories.forEach(category => {
    const categoryPrompts = prompts.filter(prompt => prompt.categoryId === category.id)
    
    if (categoryPrompts.length > 0) {
      // Convert prompts to row data
      const rowData = categoryPrompts.map(promptToRow)
      
      // Create worksheet
      const worksheet = XLSX.utils.json_to_sheet(rowData, { header: headers })
      
      // Set column widths for better readability
      const columnWidths = headers.map(header => {
        switch (header) {
          case 'Title': return { wch: 25 }
          case 'Purpose': return { wch: 30 }
          case 'AI Persona': return { wch: 40 }
          case 'Prompt': return { wch: 60 }
          case 'Output Format': return { wch: 30 }
          case 'Example': return { wch: 40 }
          case 'Reference': return { wch: 30 }
          default: return { wch: 20 } // Custom fields
        }
      })
      worksheet['!cols'] = columnWidths

      // Sanitize sheet name (Excel has restrictions)
      const sanitizedName = category.name
        .replace(/[\\\/\?\*\[\]]/g, '') // Remove invalid characters
        .substring(0, 31) // Max 31 characters

      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, sanitizedName)
    }
  })

  // Create an "All Prompts" sheet if there are multiple categories
  if (categories.length > 1 && prompts.length > 0) {
    const allRowData = prompts.map(prompt => {
      const row = promptToRow(prompt)
      // Add category name as first column
      const categoryName = categories.find(cat => cat.id === prompt.categoryId)?.name || 'Uncategorized'
      return { Category: categoryName, ...row }
    })

    const allHeaders = ['Category', ...headers]
    const allWorksheet = XLSX.utils.json_to_sheet(allRowData, { header: allHeaders })
    
    // Set column widths
    const allColumnWidths = [
      { wch: 20 }, // Category column
      ...headers.map(header => {
        switch (header) {
          case 'Title': return { wch: 25 }
          case 'Purpose': return { wch: 30 }
          case 'AI Persona': return { wch: 40 }
          case 'Prompt': return { wch: 60 }
          case 'Output Format': return { wch: 30 }
          case 'Example': return { wch: 40 }
          case 'Reference': return { wch: 30 }
          default: return { wch: 20 }
        }
      })
    ]
    allWorksheet['!cols'] = allColumnWidths

    XLSX.utils.book_append_sheet(workbook, allWorksheet, 'All Prompts')
  }

  // Generate filename with timestamp
  const timestamp = new Date().toISOString().split('T')[0] // YYYY-MM-DD format
  const filename = `AI_Prompt_Library_${timestamp}.xlsx`

  // Write and download the file
  XLSX.writeFile(workbook, filename)

  return {
    success: true,
    filename,
    categoriesExported: categories.length,
    promptsExported: prompts.length,
    customFieldsFound: customFieldNames.length
  }
}

// Export specific category to Excel
export const exportCategoryToExcel = (category, prompts) => {
  const categoryPrompts = prompts.filter(prompt => prompt.categoryId === category.id)
  return exportPromptsToExcel([category], categoryPrompts)
}

// Export summary statistics
export const getExportSummary = (categories, prompts) => {
  const allCustomFields = new Set()
  prompts.forEach(prompt => {
    if (prompt.customFields && Array.isArray(prompt.customFields)) {
      prompt.customFields.forEach(field => {
        if (field.name) {
          allCustomFields.add(field.name)
        }
      })
    }
  })

  return {
    totalCategories: categories.length,
    totalPrompts: prompts.length,
    uniqueCustomFields: Array.from(allCustomFields).sort(),
    categoriesWithPrompts: categories.filter(cat => 
      prompts.some(prompt => prompt.categoryId === cat.id)
    ).length
  }
}
