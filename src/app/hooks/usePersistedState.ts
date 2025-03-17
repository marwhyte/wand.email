import { useEffect, useState } from 'react'

/**
 * A hook that persists state in localStorage with an optional namespace
 *
 * @param key The key to store the value under
 * @param initialValue The initial value (or function that returns the initial value)
 * @param namespace Optional namespace to prevent collisions across different parts of the app
 * @param storageType The type of storage to use ('local' or 'session')
 * @returns A stateful value and a function to update it, like useState
 */
type StorageType = 'local' | 'session'

export function usePersistedState<T>(
  key: string,
  initialValue: T | (() => T),
  namespace?: string,
  storageType: StorageType = 'local'
): [T, React.Dispatch<React.SetStateAction<T>>] {
  // Create a namespaced storage key if namespace is provided
  const storageKey = namespace ? `${namespace}_${key}` : key

  // Get the appropriate storage object
  const getStorage = () => (storageType === 'local' ? localStorage : sessionStorage)

  // Initialize state with value from localStorage or initial value
  const [state, setState] = useState<T>(() => {
    // Only access localStorage on the client side
    if (typeof window === 'undefined') {
      return typeof initialValue === 'function' ? (initialValue as () => T)() : initialValue
    }

    try {
      const storage = getStorage()
      const item = storage.getItem(storageKey)
      // Parse stored json or return initialValue if nothing stored
      return item ? JSON.parse(item) : typeof initialValue === 'function' ? (initialValue as () => T)() : initialValue
    } catch (error) {
      console.error(`Error reading from ${storageType}Storage:`, error)
      return typeof initialValue === 'function' ? (initialValue as () => T)() : initialValue
    }
  })

  // Update localStorage when state changes
  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    try {
      const storage = getStorage()
      storage.setItem(storageKey, JSON.stringify(state))
    } catch (error) {
      console.error(`Error writing to ${storageType}Storage:`, error)
    }
  }, [state, storageKey, storageType])

  return [state, setState]
}
