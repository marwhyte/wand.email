import { v4 as uuidv4 } from 'uuid'

const defaultStyles = {
  attributes: {
    backgroundImage: 'none',
    backgroundPosition: 'top left',
    backgroundRepeat: 'no-repeat',
  },
}

// Creates a block with a given type, content, and attributes. Accepts column.
export const createBlock = (type: EmailBlockType, content: string, attrs = {}, column: ColumnBlock): EmailBlock => {
  const block = {
    id: uuidv4(),
    type,
    content,
    attributes: attrs,
  } as EmailBlock

  column.blocks.push(block)
  return block
}

// Creates a column with a given number of grid columns and attributes. Accepts block array.
export const createColumn = (blocks: any[], gridCols = 12, attrs = {}) => ({
  id: uuidv4(),
  type: 'column' as const,
  gridColumns: gridCols,
  attributes: attrs,
  blocks,
})

type RowWithColumnConfig = {
  containerAttrs?: Record<string, any>
  rowAttrs?: Record<string, any>
  columnAttrs?: Record<string, any>
  gridColumns?: number
}

export const createRowWithColumn = ({
  containerAttrs = {},
  rowAttrs = {},
  columnAttrs = {},
  gridColumns = 12,
}: RowWithColumnConfig = {}) => {
  const column = createColumn([], gridColumns, columnAttrs)
  const row = {
    id: uuidv4(),
    type: 'row' as const,
    container: {
      ...defaultStyles,
      attributes: { ...defaultStyles.attributes, ...containerAttrs },
    },
    attributes: rowAttrs,
    columns: [column],
  }
  return { row, column }
}

export const createRow = (containerAttrs = {}, attrs = {}) => ({
  id: uuidv4(),
  type: 'row' as const,
  container: {
    ...defaultStyles,
    attributes: { ...defaultStyles.attributes, ...containerAttrs },
  },
  attributes: attrs,
  columns: [],
})

export const createEmail = (
  name: string,
  rows: RowBlock[],
  color: string,
  linkColor: string,
  fontFamily = 'Arial',
  bgColor = '#ffffff',
  width = '600',
  bgImage: string | undefined = undefined,
  bgPosition: string | undefined = undefined,
  bgRepeat: string | undefined = undefined,
  bgSize: string | undefined = undefined
): Email => ({
  id: uuidv4(),
  name,
  rows,
  width,
  color,
  linkColor,
  preview: name,
  fontFamily,
  bgColor,
  bgImage,
  bgPosition,
  bgRepeat,
  bgSize,
})

// New helper functions
export const createLogoRow = (logoUrl: string, bgColor?: string) => {
  const { row, column } = createRowWithColumn({
    containerAttrs: {
      backgroundColor: bgColor,
    },
    columnAttrs: {
      align: 'center',
      borderSpacing: '0',
    },
    rowAttrs: {
      paddingTop: '30px',
      paddingBottom: '0',
    },
  })

  createBlock(
    'image',
    '',
    {
      textAlign: 'center',
      src: logoUrl,
      height: '45px',
      alt: 'Going',
    },
    column
  )

  return row
}

export const createHeroSection = (bgColor: string) => {
  const { row, column } = createRowWithColumn({
    containerAttrs: {
      backgroundColor: bgColor,
    },
    columnAttrs: {
      align: 'center',
      borderSpacing: '0',
    },
    rowAttrs: {
      paddingTop: '30px',
      paddingRight: '30px',
      paddingBottom: '30px',
      paddingLeft: '30px',
    },
  })

  return { row, column }
}

export const createFullWidthImageRow = (imageUrl: string, bgColor?: string) => {
  const { row, column } = createRowWithColumn({
    containerAttrs: {
      backgroundColor: bgColor,
      paddingTop: '60px',
      paddingRight: '15px',
      paddingBottom: '30px',
      paddingLeft: '15px',
    },
    columnAttrs: {
      align: 'center',
    },
  })

  createBlock(
    'image',
    '',
    {
      src: imageUrl,
      width: '100%',
      display: 'block',
      alt: 'background',
    },
    column
  )

  return row
}

type TwoColumnConfig = {
  containerAttrs?: Record<string, any>
  rowAttrs?: Record<string, any>
  leftColumnAttrs?: Record<string, any>
  rightColumnAttrs?: Record<string, any>
  leftColumnWidth?: number
  rightColumnWidth?: number
}

export const createRowWithTwoColumns = ({
  containerAttrs = {},
  rowAttrs = {},
  leftColumnAttrs = {},
  rightColumnAttrs = {},
  leftColumnWidth = 6,
  rightColumnWidth = 6,
}: TwoColumnConfig = {}) => {
  const leftColumn = createColumn([], leftColumnWidth, leftColumnAttrs)
  const rightColumn = createColumn([], rightColumnWidth, rightColumnAttrs)

  const row = {
    id: uuidv4(),
    type: 'row' as const,
    container: {
      ...defaultStyles,
      attributes: { ...defaultStyles.attributes, ...containerAttrs },
    },
    attributes: rowAttrs,
    columns: [leftColumn, rightColumn],
  }

  return { row, leftColumn, rightColumn }
}
