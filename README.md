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
- **Duplicate Prompts**: One-click duplication with "Copy [name]" format for creating variations
- **Compact View**: Title-only cards for better space utilization
- **Detailed View**: Click titles to see full prompt details in modal

### 🎯 Core Functionality
- **Category Management**: Organize prompts into custom categories with descriptions
- **Prompt Organization**: Store prompts with title, purpose, AI persona, and custom fields
- **Alphabetical Sorting**: Categories and prompts automatically sorted alphabetically for easy navigation
- **Excel Export**: Export all prompts to Excel with dynamic custom fields support
- **Persistent Storage**: Data stored in Cloudflare KV with global synchronization
- **Responsive Design**: Works seamlessly on desktop and mobile devices

### 🎨 Modern UI/UX
- **Clean Navigation**: Left sidebar with category navigation and straight edges
- **Dark Mode**: Custom dark theme with `#0D1533` background and `#DD388B` accents
- **Accessible Design**: High contrast colors and proper ARIA support
- **Smooth Interactions**: Hover effects and transitions throughout
- **Intuitive Actions**: Top-right action buttons (duplicate, edit, delete) on each prompt card
- **Smart Organization**: Automatic alphabetical sorting for categories and prompts
- **Streamlined Interface**: Removed redundant copy button, consolidated actions

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

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

---

*Built with ❤️ using React, Vite, and Tailwind CSS*
