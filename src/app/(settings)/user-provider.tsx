'use client'

import { createContext, useContext, useState } from 'react'

import { create } from 'zustand'

import type { Quote, User } from '~/types/auth'

interface UserSlice {
  user: User | undefined
  quotes: Quote[]
  setUser: (project: User) => void
  setQuotes: (quotes: Quote[]) => void
}

const createStore = (user: User | undefined) => {
  return create<UserSlice>((set) => {
    return {
      user,
      quotes: [],
      setUser(user) {
        set({
          user,
        })
      },
      setQuotes(quotes) {
        set({
          quotes,
        })
      },
    }
  })
}

const UserContext = createContext<ReturnType<typeof createStore> | null>(null)

export const useUser = () => {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!UserContext) throw new Error('useUser must be used within a UserProvider')
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return useContext(UserContext)!
}

const UserProvider = ({ children, user }: { children: React.ReactNode; user: User | undefined }) => {
  const [store] = useState(() => createStore(user))
  return <UserContext.Provider value={store}>{children}</UserContext.Provider>
}

export default UserProvider
