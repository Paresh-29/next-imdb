'use client'

import { ThemeProvider } from "next-themes"



export default function Providers({ children }) {
  return (
    <ThemeProvider attribute='class' defaultTheme="system">
      <div className="text-gray-600 dark:text-gray-200 dark:bg-gray-800 min-h-screen select-none transition-colors duration-300">
        {children}
      </div>
    </ThemeProvider>
  )
}
