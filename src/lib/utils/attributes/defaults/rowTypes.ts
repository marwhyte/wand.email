import type { RowBlock } from '@/app/components/email-workspace/types'

export function getTypeDefaults(row: RowBlock): Partial<RowBlock['attributes']> {
  switch (row.attributes.type) {
    case 'gallery': {
      const defaults: Partial<RowBlock['attributes']> = {
        paddingTop: '12px',
        paddingBottom: '12px',
      }

      if (row.columns.length === 2) {
        defaults.stackOnMobile = true

        // Check if exactly one column has a photo
        const photoColumns = row.columns.filter((col) => col.blocks.some((block) => block.type === 'image'))
        if (photoColumns.length === 1 && row.columns.length === 2) {
          defaults.columnSpacing = 24
        }
      }

      if (row.columns.length > 2) {
        defaults.twoColumnsOnMobile = true
      }

      defaults.columnSpacing = defaults.columnSpacing ?? 16
      return defaults
    }
    default:
      return {}
  }
}
