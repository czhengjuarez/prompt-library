import { useState, useEffect } from 'react'
import { urlRouter } from '../utils/urlRouter'

// Hook for managing URL routing state
export const useURLRouter = () => {
  const [currentRoute, setCurrentRoute] = useState(() => urlRouter.initialize())

  useEffect(() => {
    const handleRouteChange = (routeInfo) => {
      setCurrentRoute(routeInfo)
    }

    urlRouter.addListener(handleRouteChange)

    return () => {
      urlRouter.removeListener(handleRouteChange)
    }
  }, [])

  return {
    currentRoute,
    navigateToPrompt: urlRouter.navigateToPrompt.bind(urlRouter),
    navigateToHome: urlRouter.navigateToHome.bind(urlRouter),
    generatePromptURL: urlRouter.generatePromptURL.bind(urlRouter),
    getShareableURL: urlRouter.getShareableURL.bind(urlRouter)
  }
}

export default useURLRouter
