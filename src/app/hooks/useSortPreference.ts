import { useEffect, useState } from 'react'

export type SortDirection = 'asc' | 'desc'

export type SortPreference<T extends string> = {
  key: T
  direction: SortDirection
}

export type SortFunction<T> = (a: T, b: T, direction: SortDirection) => number

export function useSortPreference<T extends string>(storageKey: string, defaultSort: SortPreference<T>) {
  const [sortPreference, setSortPreference] = useState<SortPreference<T>>(defaultSort)

  useEffect(() => {
    const savedSort = localStorage.getItem(storageKey)
    if (savedSort) {
      setSortPreference(JSON.parse(savedSort))
    }
  }, [storageKey])

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(sortPreference))
  }, [storageKey, sortPreference])

  const setSortKey = (key: T, direction?: SortDirection) => {
    setSortPreference((prev) => ({
      key,
      direction: direction ?? prev.direction,
    }))
  }

  return [sortPreference, setSortKey] as const
}

// Updated helper function for sorting
export function sortItems<T>(
  items: T[],
  sortPreference: SortPreference<Extract<keyof T, string> | string>,
  customSorts?: Record<string, SortFunction<T>>
) {
  return [...items].sort((a, b) => {
    if (customSorts && sortPreference.key in customSorts) {
      return customSorts[sortPreference.key](a, b, sortPreference.direction)
    }

    const aValue = a[sortPreference.key as keyof T]
    const bValue = b[sortPreference.key as keyof T]

    // Handle date comparison
    if (aValue instanceof Date && bValue instanceof Date) {
      return sortPreference.direction === 'asc'
        ? aValue.getTime() - bValue.getTime()
        : bValue.getTime() - aValue.getTime()
    }

    // Handle string date comparison
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      const aDate = new Date(aValue)
      const bDate = new Date(bValue)
      if (!isNaN(aDate.getTime()) && !isNaN(bDate.getTime())) {
        return sortPreference.direction === 'asc'
          ? aDate.getTime() - bDate.getTime()
          : bDate.getTime() - aDate.getTime()
      }
    }

    // Default comparison for other types
    if (aValue < bValue) return sortPreference.direction === 'asc' ? -1 : 1
    if (aValue > bValue) return sortPreference.direction === 'asc' ? 1 : -1
    return 0
  })
}
