# AI Prompt Library

A modern, feature-rich React application for organizing and managing your AI prompts with full CRUD functionality, custom fields, and dark mode support.

## ✨ Features

### 📁 Category Management
- Create, edit, and delete prompt categories
- Organized sidebar navigation with clean category cards
- Confirmation dialogs for safe deletion with prompt handling options

### 📝 Advanced Prompt Management
- **Full CRUD Operations**: Create, read, update, and delete prompts
- **Rich Prompt Structure**: Title, purpose (job-to-be-done framework), AI persona, output format, examples, and reference context
- **Custom Fields**: Auto-detection of placeholders + manual custom field creation
- **Compact View**: Title-only cards for better space utilization
- **Detailed View**: Click titles to see full prompt details in modal

### 🎨 Modern UI/UX
- **Dark Mode**: Beautiful dark theme with persistent preference storage
- **Responsive Design**: Works seamlessly across desktop and mobile
- **Tailwind CSS**: Clean, modern styling with consistent design system
- **Primary Color**: Elegant #8E1F5A accent color used sparingly for key actions

### 🔧 Prompt Customization
- **Dynamic Placeholders**: Automatic detection of `{placeholder}` syntax
- **Custom Field Integration**: Structured input details automatically included
- **Copy & Customize**: Interactive modal for field customization before copying
- **Smart Replacement**: Placeholders replaced across all prompt sections

### 🛡️ User Experience
- **Confirmation Modals**: Safe deletion with preview of content being removed
- **Form Validation**: Required fields and proper error handling
- **Persistent Storage**: Categories and prompts saved in browser localStorage
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
- **State Management**: React useState (local state)
- **Storage**: Browser localStorage
- **Icons**: Heroicons (inline SVG)

## 📱 Usage

### Creating Your First Category
1. Click "+ Add Category" in the header
2. Fill in the category name and purpose
3. Click "Create Category"

### Adding Prompts
1. Select a category from the sidebar
2. Click "+ Add Prompt"
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

### Dark Mode
Click the sun/moon toggle in the header to switch between light and dark themes. Your preference is automatically saved.

## 🎯 Key Design Decisions

- **Job-to-be-Done Framework**: Structured approach to defining prompt purposes
- **Automatic Field Detection**: Reduces manual work by detecting `{placeholders}`
- **Compact Cards**: Maximizes prompt visibility while maintaining access to details
- **Gray Button Theme**: Primary color reserved for creation actions only
- **Modal-Based Interactions**: Clean, focused user experience for complex operations

## 🔮 Future Enhancements

- Export/Import functionality
- Prompt templates and sharing
- Search and filtering
- Tagging system
- Prompt versioning
- Team collaboration features

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

---

*Built with ❤️ using React, Vite, and Tailwind CSS*
