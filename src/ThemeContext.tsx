import React, { useState } from 'react'
import { ThemeProvider as SCThemeProvider } from 'styled-components'
import { light, dark } from '@pancakeswap-libs/uikit'

const CACHE_KEY = 'IS_DARK'

export interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
}

const ThemeContext = React.createContext<ThemeContextType>({ isDark: false, toggleTheme: () => null })

const ThemeContextProvider: React.FC = ({ children }) => {
  const [isDark, setIsDark] = useState(() => {
    const isDarkUserSetting = localStorage.getItem(CACHE_KEY)
    return isDarkUserSetting ? JSON.parse(isDarkUserSetting) : false
  })

  const toggleTheme = () => {
    setIsDark((prevState: any) => {
      localStorage.setItem(CACHE_KEY, JSON.stringify(!prevState))
      const iframe=document.getElementById("iframe-x-finance")
      if (iframe instanceof HTMLIFrameElement){
        const win = iframe.contentWindow;
        if (win){
          win.postMessage({key: CACHE_KEY, value: JSON.stringify(!prevState)},"*")
        }
      }

      const iframeI=document.getElementById("iframe-x-info")
      if (iframeI instanceof HTMLIFrameElement){
        const win = iframeI.contentWindow;
        if (win){
          win.postMessage({action: "update", item: 'UNISWAP',key: "DARK_MODE", value: JSON.stringify(!prevState)},"*")
        }
      }

      return !prevState
    })
  }

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      <SCThemeProvider theme={isDark ? dark : light}>{children}</SCThemeProvider>
    </ThemeContext.Provider>
  )
}

export { ThemeContext, ThemeContextProvider }
