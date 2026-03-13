'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface LocationContextType {
  activeLocation: string
  setActiveLocation: (name: string) => void
}

const LocationContext = createContext<LocationContextType>({
  activeLocation: 'Main Street #1',
  setActiveLocation: () => {},
})

export function LocationProvider({ children }: { children: ReactNode }) {
  const [activeLocation, setActiveLocationState] = useState('Main Street #1')

  useEffect(() => {
    const stored = localStorage.getItem('activeLocation')
    if (stored) setActiveLocationState(stored)
  }, [])

  function setActiveLocation(name: string) {
    setActiveLocationState(name)
    localStorage.setItem('activeLocation', name)
  }

  return (
    <LocationContext.Provider value={{ activeLocation, setActiveLocation }}>
      {children}
    </LocationContext.Provider>
  )
}

export const useLocation = () => useContext(LocationContext)
