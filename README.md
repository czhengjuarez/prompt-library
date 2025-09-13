# AI Prompt Library

A modern, feature-rich React application for organizing and managing your AI prompts with full CRUD functionality, custom fields, Excel export, and beautiful dark mode support.

## ✨ Features

### 📁 Category Management
- Create, edit, and delete prompt categories
- Clean left-hand navigation sidebar with category descriptions
- Confirmation dialogs for safe deletion with prompt handling options
- Accessible dark mode with improved contrast and visibility

### 📝 Advanced Prompt Management
- **Full CRUD Operations**: Create, read, update, and delete prompts
- **Rich Prompt Structure**: Title, purpose (job-to-be-done framework), AI persona, output format, examples, and reference context
- **Custom Fields**: Auto-detection of placeholders + manual custom field creation
- **Compact View**: Title-only cards for better space utilization
- **Detailed View**: Click titles to see full prompt details in modal

### 🎨 Modern UI/UX
- **Dark Mode**: Beautiful dark theme (#0D1533 background) with persistent preference storage
- **Responsive Design**: Works seamlessly across desktop and mobile
- **Tailwind CSS**: Clean, modern styling with consistent design system
- **Color Palette**: Primary #8E1F5A and secondary #DD388B for enhanced dark mode visibility
- **Clean Navigation**: Text-based action links with minimal styling for better UX

### 🔧 Prompt Customization
- **Dynamic Placeholders**: Automatic detection of `{placeholder}` syntax
- **Custom Field Integration**: Structured input details automatically included
- **Copy & Customize**: Interactive modal for field customization before copying
- **Smart Replacement**: Placeholders replaced across all prompt sections

### 📊 Data Export
- **Excel Export**: Export all prompts organized by category into Excel (.xlsx) format
- **Dynamic Custom Fields**: Automatically handles varying custom field schemas
- **Multi-Sheet Structure**: Each category gets its own worksheet
- **Comprehensive Data**: Includes all prompt fields and metadata

### 🛡️ User Experience
- **Confirmation Modals**: Safe deletion with preview of content being removed
- **Form Validation**: Required fields and proper error handling
- **Cloud Storage**: Cloudflare KV integration with localStorage fallback
- **Intuitive Navigation**: Clear visual hierarchy and user-friendly interactions

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd PromptLibrary
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

## 🏗️ Tech Stack

- **Frontend**: React 18 with Hooks
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v3.4.17
- **State Management**: React useState with custom hooks
- **Storage**: Cloudflare KV with localStorage fallback
- **Export**: xlsx library for Excel file generation
- **Icons**: Heroicons (inline SVG)

## 📱 Usage

### Creating Your First Category
1. Click "+ Category" in the sidebar
2. Fill in the category name and purpose
3. Click "Create Category"

### Adding Prompts
1. Select a category from the sidebar
2. Click "+ Prompt" in the action links
3. Fill in the prompt details:
   - **Title**: Short descriptive name (e.g., "Interview Plan")
   - **Purpose**: Job-to-be-done framework (When I need to... I want... So I can...)
   - **AI Persona**: Define the AI's role and expertise
   - **Prompt**: Your main prompt template with `{placeholders}`
   - **Output Format**: Specify desired response structure
   - **Example**: Provide sample output (optional)
   - **Reference**: Additional context (optional)
   - **Custom Fields**: Manual fields for structured input

### Using Prompts
- **View Details**: Click any prompt title to see full content
- **Customize & Copy**: Fill in custom fields and copy the final prompt
- **Quick Copy**: Copy the raw prompt directly
- **Edit/Delete**: Use the action buttons on each prompt card
- **Export Data**: Click "Export" to download all prompts as Excel file

### Dark Mode
Click the sun/moon toggle in the header to switch between light and dark themes. Your preference is automatically saved.

## 🎯 Key Design Decisions

- **Job-to-be-Done Framework**: Structured approach to defining prompt purposes
- **Automatic Field Detection**: Reduces manual work by detecting `{placeholders}`
- **Compact Cards**: Maximizes prompt visibility while maintaining access to details
- **Gray Button Theme**: Primary color reserved for creation actions only
- **Modal-Based Interactions**: Clean, focused user experience for complex operations

## 🔮 Future Enhancements

- Import functionality for Excel files
- Prompt templates and sharing
- Search and filtering across categories
- Tagging system for better organization
- Prompt versioning and history
- Team collaboration features
- Advanced export formatting options

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

---

*Built with ❤️ using React, Vite, and Tailwind CSS*
