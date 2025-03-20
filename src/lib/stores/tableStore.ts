import { create } from 'zustand'

interface TableStore {
  selectedCell: {
    row: number
    column: number
    value: string
  } | null
  setSelectedCell: (cell: { row: number; column: number; value: string } | null) => void
  selectedCellValue: string | null
  setSelectedCellValue: (value: string | null) => void
}

export const useTableStore = create<TableStore>((set) => ({
  selectedCell: null,
  setSelectedCell: (cell) => set({ selectedCell: cell }),
  selectedCellValue: null,
  setSelectedCellValue: (value) => set({ selectedCellValue: value }),
}))
