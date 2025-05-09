"use client"
import {HeroUIProvider} from "@/lib/hero-ui"

export function Providers({children}: { children: React.ReactNode }) {

  return (
    
      <HeroUIProvider>
        {children}
      </HeroUIProvider>
  )
}