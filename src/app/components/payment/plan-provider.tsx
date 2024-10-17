'use client'

import { Plan } from '@/lib/database/types'
import { createContext, ReactNode, useContext, useEffect, useState } from 'react'

// Create the context
const PlanContext = createContext<{
  plan: Plan | null | undefined
  refetchUser: () => Promise<User | null | undefined>
} | null>(null)

// Create a custom hook to use the context
export const usePlan = () => {
  const context = useContext(PlanContext)
  if (!context) {
    throw new Error('usePlan must be used within a PlanProvider')
  }
  return context
}

interface User {
  id: string
  plan: Plan | null
}

interface PlanProviderProps {
  children: ReactNode
  fetchUser: () => Promise<User | null | undefined>
  plan: Plan | null | undefined
}

const PlanProvider = ({ children, fetchUser, plan }: PlanProviderProps) => {
  const [userPlan, setUserPlan] = useState<Plan | null | undefined>(plan)

  const refetchUser = async () => {
    const updatedUser = await fetchUser()
    if (updatedUser) {
      setUserPlan(updatedUser.plan)
    }
    return updatedUser
  }

  useEffect(() => {
    setUserPlan(plan)
  }, [plan])

  return <PlanContext.Provider value={{ plan: userPlan, refetchUser }}>{children}</PlanContext.Provider>
}

export default PlanProvider
