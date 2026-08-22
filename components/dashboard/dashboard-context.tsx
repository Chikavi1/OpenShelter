'use client'

import { createContext, useContext } from 'react'

export type DashboardViewModel = Record<string, any>

const DashboardContext = createContext<DashboardViewModel | null>(null)

export function DashboardProvider({ value, children }: { value: DashboardViewModel; children: React.ReactNode }) {
  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>
}

export function useDashboardContext() {
  const value = useContext(DashboardContext)
  if (!value) throw new Error('Dashboard components must be rendered inside DashboardProvider')
  return value
}
