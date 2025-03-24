export const isLocalDev = process.env.NEXT_PUBLIC_ENV === 'development' || process.env.NODE_ENV === 'development'

export const MODIFICATIONS_TAG_NAME = 'wand_file_modifications'

export const modificationsRegex = new RegExp(
  `^<${MODIFICATIONS_TAG_NAME}>[\\s\\S]*?<\\/${MODIFICATIONS_TAG_NAME}>\\s+`,
  'g'
)

// see https://docs.anthropic.com/en/docs/about-claude/models
export const MAX_TOKENS = 8192

// limits the number of model responses that can be returned in a single request
export const MAX_RESPONSE_SEGMENTS = 2
