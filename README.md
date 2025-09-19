# AI Prompt Library

A modern, feature-rich React application for organizing and managing your AI prompts with full CRUD functionality, custom fields, Excel export, and beautiful dark mode support.

## ✨ Features

### 🔗 Direct Prompt Linking
- **Share specific prompts** with human-readable URLs like `#/prompt/blog-creation-1757817465923`
- **Focused recipient experience** - shared links show only the specific prompt with clean navigation

### 📁 Category Management
- Create, edit, and delete prompt categories
- Clean left-hand navigation sidebar with category descriptions
- Confirmation dialogs for safe deletion with prompt handling options
- Accessible dark mode with improved contrast and visibility

### 📝 Advanced Prompt Management
- **Full CRUD Operations**: Create, read, update, and delete prompts
- **Rich Prompt Structure**: Title, purpose (job-to-be-done framework), AI persona, output format, examples, and reference context
- **Template System**: Support for placeholders and custom fields
- **Auto-Detection**: Automatically identifies placeholders in prompt text
- **Custom Fields**: Add structured input fields to prompts
- **Validation**: Form validation with helpful error messages
- **Duplicate Field Prevention**: Intelligent handling of auto-detected vs manual custom fields
- **Clean Field Consolidation**: Auto-detected placeholders are properly separated from custom fields

### 🎯 Core Functionality
- **Category Management**: Organize prompts into custom categories
- **Prompt Creation & Editing**: Rich form interface for creating detailed prompts
- **Alphabetical Sorting**: Categories and prompts automatically sorted alphabetically for easy navigation
- **Excel Export**: Export all prompts to Excel with dynamic custom fields support
- **Persistent Storage**: Data stored in Cloudflare KV with global synchronization
- **Responsive Design**: Works seamlessly on desktop and mobile devices

### 🎨 User Experience
- **Dark Mode Support**: Toggle between light and dark themes with system preference detection
- **Intuitive Interface**: Clean, modern design with smooth animations and transitions
- **Keyboard Shortcuts**: Quick actions for power users
- **Loading States**: Smooth loading indicators for better user feedback
- **Share Modal**: Beautiful modal with copy-to-clipboard functionality and visual feedback
- **Smooth Interactions**: Hover effects and transitions throughout
- **Intuitive Actions**: Top-right action buttons (duplicate, move, edit, delete) on each prompt card
- **Smart Organization**: Automatic alphabetical sorting for categories and prompts
- **Streamlined Interface**: Consolidated navigation with "All Prompts" as first option
- **Smart Modal Behavior**: Click outside or press Escape to close modals
- **Unsaved Changes Protection**: Confirmation dialog prevents accidental data loss
- **Dirty State Detection**: Only shows warnings when you have actual unsaved changes

### 💾 Serverless Architecture
- **Cloudflare Workers**: Both frontend and backend deployed as edge functions
- **Cloudflare KV Storage**: Distributed NoSQL storage with global replication
- **RESTful API**: Full CRUD operations for categories and prompts
- **Edge Performance**: Sub-100ms response times globally

### 🔒 Data Management
- **CRUD Operations**: Create, read, update, delete for all entities
- **Data Validation**: Proper error handling and validation
- **Cross-Session Persistence**: Data available across all browser sessions
- **Backup & Export**: Excel export for data portability

## 🛠 Tech Stack

### Frontend
- **React 18** with Hooks and modern patterns
- **Vite** for fast development and optimized builds
- **Tailwind CSS v3.4.17** with custom color scheme
- **Heroicons** for consistent iconography

### Backend
- **Cloudflare Workers** for serverless compute
- **Cloudflare KV** for distributed data storage
- **RESTful API** with proper HTTP status codes
- **CORS support** for cross-origin requests

### Deployment
- **Wrangler CLI** for Cloudflare Workers deployment
- **Custom build script** for asset embedding
- **Environment-based configuration**

## 📦 Installation & Development

### Prerequisites
- Node.js 18+
- npm or yarn
- Wrangler CLI (`npm install -g wrangler`)
- Cloudflare account with Workers and KV enabled

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd PromptLibrary
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```
   Opens at `http://localhost:5173`

4. **Build for production**
   ```bash
   npm run build
   ```

### Cloudflare Workers Deployment

#### 1. Backend API Worker

```bash
cd worker
npm install

# Configure your wrangler.toml with account details
wrangler deploy
```

#### 2. Frontend Worker

```bash
# Build the React application
npm run build

# Generate worker with embedded assets
node build-worker.js

# Deploy the frontend worker
cd frontend-worker
wrangler deploy
```

## 🎨 Design System

### Color Palette
- **Primary**: `#8E1F5A` - Key actions and highlights
- **Secondary**: `#DD388B` - Enhanced dark mode visibility
- **Dark Background**: `#0D1533` - Custom deep blue theme
- **Neutral Grays**: Various shades for UI elements

### UI Principles
- **Minimalist Design**: Clean, uncluttered interface
- **Consistent Spacing**: 4px grid system with Tailwind
- **Accessible Colors**: WCAG AA compliant contrast ratios
- **Mobile-First**: Responsive design from small to large screens

## 📊 Excel Export Features

- **Multi-Sheet Workbooks**: Each category becomes a separate worksheet
- **Dynamic Schema**: Automatically handles varying custom fields
- **Summary Sheet**: Combined "All Prompts" sheet for multi-category exports
- **Rich Metadata**: Includes creation dates, categories, and all custom fields
- **Timestamped Files**: Format: `prompts-export-YYYY-MM-DD-HH-mm-ss.xlsx`

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

## 🆕 Recent Updates

### v2.2.0 - Direct Prompt Linking
- **🔗 Share Specific Prompts**: Generate human-readable URLs for individual prompts
- **📱 Focused Recipient View**: Shared links display only the specific prompt with clean navigation
- **🎨 Visual Action States**: Disabled actions (duplicate, move, delete) are grayed out for recipients
- **📋 One-Click Sharing**: Copy shareable URLs directly from prompt cards with visual feedback
- **🗂️ Folder Icon**: Move prompt action uses intuitive folder icon for better UX

### v2.1.0 - Smart Modal Experience
- **Smart Modal Behavior**: Click outside or press Escape to close edit/create modals
- **Unsaved Changes Protection**: Intelligent detection of form modifications with confirmation dialog
- **Enhanced UX**: No more scrolling to find Cancel/Update buttons for quick exits
- **Data Loss Prevention**: Clear warnings only when you have actual unsaved changes
- **Improved Field Handling**: Better separation of auto-detected placeholders vs manual custom fields

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

---

*Built with ❤️ using React, Vite, and Tailwind CSS*
