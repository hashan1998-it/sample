// Enhanced GraphQL request function with comprehensive error handling
export const graphqlRequest = async <TData, TVariables = object>(
    query: string,
    variables?: TVariables,
    options?: {
        timeout?: number
        retries?: number
        retryDelay?: number
        token?: string | null
    },
): Promise<TData> => {
    const {
        timeout = 30000,
        retries = 3,
        retryDelay = 1000,
        token,
    } = options || {}

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)

    let lastError: Error | undefined = undefined

    for (let attempt = 0; attempt <= retries; attempt++) {
        try {
            const headers: Record<string, string> = {
                'Content-Type': 'application/json',
            }

            // Add authorization header if token exists
            if (token) {
                headers['Authorization'] = `Bearer ${token}`
            }

            const response = await fetch('http://localhost:4000/graphql', {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    query,
                    variables,
                }),
                signal: controller.signal,
            })

            clearTimeout(timeoutId)

            // Handle HTTP error codes
            if (!response.ok) {
                let errorMessage = response.statusText || 'Unknown error'
                let errorCode = response.status.toString()

                // Try to get more detailed error info from response body
                try {
                    const errorBody = await response.text()
                    if (errorBody) {
                        try {
                            const parsedError = JSON.parse(errorBody)
                            if (parsedError.message) {
                                errorMessage = parsedError.message
                            } else if (parsedError.error) {
                                errorMessage = parsedError.error
                            }

                            // Extract error code if available
                            if (parsedError.code) {
                                errorCode = parsedError.code
                            } else if (parsedError.errorCode) {
                                errorCode = parsedError.errorCode
                            }
                        } catch {
                            // If JSON parsing fails, use the raw text as message
                            errorMessage = errorBody
                        }
                    }
                } catch {
                    // If reading response body fails, use default message
                }

                // Create simple error with just message and code
                const httpError = new Error(errorMessage) as Error & {
                    code: string
                }
                httpError.code = errorCode

                throw httpError
            }

            const json = await response.json()

            // Handle GraphQL errors in response
            if (json.errors && json.errors.length > 0) {
                // Extract the first error's message and code
                const firstError = json.errors[0]
                const errorMessage =
                    firstError.message || 'Unknown GraphQL error'
                const errorCode = firstError.extensions?.code || 'GRAPHQL_ERROR'

                // Create simple error with just message and code
                const graphqlError = new Error(errorMessage) as Error & {
                    code: string
                }
                graphqlError.code = errorCode

                throw graphqlError
            }

            // Check if data exists in response
            if (json.data === undefined || json.data === null) {
                throw new Error('GraphQL response contains no data')
            }

            return json.data
        } catch (error) {
            lastError = error as Error

            // Enhanced retry logic based on error type
            const shouldRetry = (() => {
                if (error instanceof Error) {
                    // Don't retry on abort (timeout)
                    if (error.name === 'AbortError') {
                        return false
                    }

                    // Don't retry on GraphQL errors (these are usually application logic errors)
                    const errorCode = (error as Error & { code?: string }).code
                    if (
                        errorCode &&
                        errorCode !== '500' &&
                        errorCode !== '502' &&
                        errorCode !== '503' &&
                        errorCode !== '504'
                    ) {
                        // Don't retry on client errors or specific GraphQL errors
                        if (
                            errorCode.startsWith('4') ||
                            errorCode === 'GRAPHQL_ERROR'
                        ) {
                            return false
                        }
                    }

                    // Don't retry on authentication/authorization errors
                    if (
                        error.message.toLowerCase().includes('unauthorized') ||
                        error.message.toLowerCase().includes('forbidden') ||
                        error.message.toLowerCase().includes('authentication')
                    ) {
                        return false
                    }
                }

                return true
            })()

            if (!shouldRetry) {
                break
            }

            // Wait before retrying (except on last attempt)
            if (attempt < retries) {
                const delay = retryDelay * Math.pow(2, attempt) // Exponential backoff
                await new Promise((resolve) => setTimeout(resolve, delay))
            }
        }
    }

    clearTimeout(timeoutId)
    throw lastError || new Error('Request failed after all retries')
}

// Type definition for error objects with optional code property
interface ErrorWithCode extends Error {
    code?: string
}

// Helper functions to extract error information
export const getErrorCode = (error: ErrorWithCode | unknown): string | null => {
    if (error && typeof error === 'object' && 'code' in error) {
        return (error as ErrorWithCode).code || null
    }
    return null
}

export const getErrorMessage = (error: ErrorWithCode | unknown): string => {
    if (error && typeof error === 'object' && 'message' in error) {
        return (error as ErrorWithCode).message || 'Unknown error'
    }
    return 'Unknown error'
}
