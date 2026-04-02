"use client"

import * as React from "react"

type Theme = "dark" | "light"

interface ThemeProviderProps {
  children: React.ReactNode
  defaultTheme?: Theme
  attribute?: string
  forcedTheme?: Theme
}

export function ThemeProvider({
  children,
  defaultTheme = "dark",
  attribute = "class",
  forcedTheme,
}: ThemeProviderProps) {
  const theme = forcedTheme || defaultTheme

  React.useEffect(() => {
    const root = document.documentElement
    if (attribute === "class") {
      root.classList.remove("light", "dark")
      root.classList.add(theme)
    }
  }, [theme, attribute])

  return <>{children}</>
}
