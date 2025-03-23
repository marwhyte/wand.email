import { createScopedLogger } from '@/lib/utils/logger'
import { useState } from 'react'

const logger = createScopedLogger('usePromptEnhancement')

export function usePromptEnhancer() {
  const [enhancingPrompt, setEnhancingPrompt] = useState(false)
  const [promptEnhanced, setPromptEnhanced] = useState(false)

  const resetEnhancer = () => {
    setEnhancingPrompt(false)
    setPromptEnhanced(false)
  }

  const enhancePrompt = async (input: string, setInput: (value: string) => void) => {
    setEnhancingPrompt(true)
    setPromptEnhanced(false)

    console.log('Enhancing prompt', input)

    const response = await fetch('/api/enhancer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: input,
      }),
    })

    console.log('Response', response)

    if (!response.ok) {
      logger.error(`Error enhancing prompt: ${response.status} ${response.statusText}`)
      setEnhancingPrompt(false)
      return
    }

    const reader = response.body?.getReader()

    const originalInput = input

    if (reader) {
      const decoder = new TextDecoder()

      let _input = ''
      let _error

      try {
        setInput('')

        while (true) {
          const { value, done } = await reader.read()

          if (done) {
            break
          }

          _input += decoder.decode(value)

          logger.trace('Set input', _input)

          setInput(_input)
        }
      } catch (error) {
        _error = error
        setInput(originalInput)
      } finally {
        if (_error) {
          logger.error(_error)
        }

        setEnhancingPrompt(false)
        setPromptEnhanced(true)

        setTimeout(() => {
          setInput(_input)
        })
      }
    }
  }

  return { enhancingPrompt, promptEnhanced, enhancePrompt, resetEnhancer }
}
