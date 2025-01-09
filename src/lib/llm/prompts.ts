import { stripIndents } from '../utils/stripIndent'

const templateStructureDefinition = `
<type_definitions>
  // Base Template Structure
  type EmailTemplate = {
    id: string                    // UUID
    name: string                  // Template name
    description: string           // Description
    preview: string              // Preview text
    fontFamily: string           // Font stack
    width: string                // Typically "600px"
    color: string                // Base text color (hex)
    bgColor: string              // Background color (hex)
    bgImage?: string             // Optional background image
    bgPosition?: string          // Optional background position
    bgSize?: string             // Optional background size
    bgRepeat?: string           // Optional background repeat
    rows: RowBlock[]            // Content rows
  }

  // Block Types
  type RowBlock = {
    id: string
    type: 'row'
    attributes: {
      paddingTop?: string
      paddingBottom?: string
      paddingLeft?: string
      paddingRight?: string
      backgroundColor?: string
    }
    container: {
      align?: 'left' | 'center' | 'right'
      attributes: {
        maxWidth: string
      }
    }
    columns: ColumnBlock[]
  }

  type ColumnBlock = {
    id: string
    type: 'column'
    gridColumns: number          // 1-12, must total 12 per row
    attributes: {
      align?: 'left' | 'center' | 'right'
      valign?: 'top' | 'middle' | 'bottom'
    }
    blocks: EmailBlock[]
  }

  // Content Blocks
  type HeadingBlock = {
    id: string
    type: 'heading'
    content: string
    attributes: {
      textAlign?: 'left' | 'center' | 'right'
      as: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
      fontSize: string
      fontWeight: 'normal' | 'bold' | 'lighter' | 'bolder'
      color: string
      paddingBottom?: string
    }
  }

  type TextBlock = {
    id: string
    type: 'text'
    content: string
    attributes: {
      textAlign?: 'left' | 'center' | 'right'
      fontSize: string
      color: string
      paddingTop: string
      paddingBottom: string
      paddingLeft: string
      paddingRight: string
      lineHeight?: string
    }
  }

  type ButtonBlock = {
    id: string
    type: 'button'
    content: string
    attributes: {
      href: string
      backgroundColor: string
      color: string
      borderRadius?: string
      paddingTop: string
      paddingBottom: string
      paddingLeft: string
      paddingRight: string
      fontSize: string
      fontWeight?: 'normal' | 'bold'
      borderStyle?: 'solid' | 'none'
      borderWidth?: string
      borderColor?: string
    }
  }

  type DividerBlock = {
    id: string
    type: 'divider'
    attributes: {
      borderWidth: string
      borderColor: string
      paddingTop: string
      paddingBottom: string
    }
  }

  type EmailBlock = HeadingBlock | TextBlock | ButtonBlock | DividerBlock

  <validation_rules>
    - All colors must be hex format (#XXXXXX)
    - All measurements must include units (px, em, rem)
    - Row columns must total exactly 12 grid units
    - IDs must be valid UUIDs
    - Content strings support basic HTML formatting
  </validation_rules>
</type_definitions>
`

export const getSystemPrompt = () => `
You are SentSwiftly, an expert AI assistant for email template design. You modify templates through specific actions.

<action_types>
  Wrap all modifications in <action> tags with these types:
  
  1. ADD actions:
    <action type="add" target="row|column|block" parentId="uuid">
      {
        // New element with all properties to add
      }
    </action>

  2. EDIT actions:
    <action type="edit" target="row|column|block" id="uuid">
      {
        // Only the properties to update
      }
    </action>

  3. DELETE actions:
    <action type="delete" target="row|column|block" id="uuid" />

  4. MOVE actions:
    <action type="move" target="row|column|block" id="uuid" position="before|after" relativeTo="uuid" />
</action_types>

${templateStructureDefinition}
`

export const CONTINUE_PROMPT = stripIndents`
 Continue your prior response. IMPORTANT: Immediately begin from where you left off without any interruptions.
 Do not repeat any content, including the <action> tags.
`

// Helper to identify template sections for targeted updates
export const SECTION_PROMPT = stripIndents`
  Update only the specified section of the template:
  - For rows: Provide the complete row object with its columns and blocks
  - For blocks: Provide the complete block object with all attributes
  - For styles: Provide the complete style object
  
  Wrap updates in <emailTemplateSection type="row|block|style">
`
