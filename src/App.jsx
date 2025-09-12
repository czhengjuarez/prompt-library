import PromptLibrary from './components/PromptLibrary'
import { ThemeProvider } from './contexts/ThemeContext'

function App() {
  return (
    <ThemeProvider>
      <PromptLibrary />
    </ThemeProvider>
  )
}

export default App
