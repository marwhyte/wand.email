'use server'

import * as Sentry from '@sentry/nextjs'

/**
 * Wraps a server function to automatically report any errors to Sentry
 * This is useful for 'use server' functions that might not have error reporting built in
 *
 * @param fn The server function to wrap
 * @param options Additional options for Sentry
 * @returns The wrapped function that reports errors to Sentry
 */
export async function withSentry<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  options?: {
    tags?: Record<string, string>
    context?: string
  }
): Promise<ReturnType<T>> {
  try {
    return await fn()
  } catch (error) {
    console.error(`Error in ${options?.context || fn.name || 'server function'}:`, error)

    // Report to Sentry with additional context
    Sentry.captureException(error, {
      tags: {
        function: fn.name || 'anonymous',
        ...(options?.tags || {}),
      },
      extra: {
        context: options?.context || 'server function',
      },
    })

    // Re-throw the error so the caller can handle it
    throw error
  }
}

/**
 * Creates a higher-order function that automatically wraps all server functions
 * with Sentry error reporting
 *
 * @param context The context to use for Sentry reporting
 * @param tags Additional tags to add to Sentry events
 * @returns A function that wraps server functions with Sentry reporting
 */
export function createSentryWrapper(context: string, tags?: Record<string, string>) {
  return function wrapWithSentry<T extends (...args: any[]) => Promise<any>>(fn: T): T {
    return (async (...args: Parameters<T>) => {
      try {
        return await fn(...args)
      } catch (error) {
        console.error(`Error in ${context} (${fn.name || 'anonymous'}):`, error)

        // Report to Sentry with additional context
        Sentry.captureException(error, {
          tags: {
            function: fn.name || 'anonymous',
            ...tags,
          },
          extra: {
            context,
            arguments: args,
          },
        })

        // Re-throw the error so the caller can handle it
        throw error
      }
    }) as T
  }
}

// Example usage:
// export const imageServiceWrapper = createSentryWrapper('image-service', { component: 'image-service' })
// const wrappedFunction = imageServiceWrapper(yourFunctionHere)
