export const graphqlRequest = async <TData, TVariables = object>(
    query: string,
    variables?: TVariables,
    options?: {
        timeout?: number
        retries?: number
        retryDelay?: number
    },
): Promise<TData> => {
    const { timeout = 30000, retries = 3, retryDelay = 1000 } = options || {}

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)

    let lastError: Error | undefined = undefined

    for (let attempt = 0; attempt <= retries; attempt++) {
        try {
            const response = await fetch('http://localhost:4000/graphql', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // Add authorization header if needed
                    // 'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    query,
                    variables,
                }),
                signal: controller.signal,
            })

            clearTimeout(timeoutId)

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const json = await response.json()

            if (json.errors) {
                throw new Error(json.errors[0].message)
            }

            return json.data
        } catch (error) {
            lastError = error as Error

            // Don't retry on abort (timeout) or GraphQL errors
            if (
                error instanceof Error &&
                (error.name === 'AbortError' ||
                    error.message.includes('GraphQL'))
            ) {
                break
            }

            // Wait before retrying (except on last attempt)
            if (attempt < retries) {
                await new Promise((resolve) =>
                    setTimeout(resolve, retryDelay * (attempt + 1)),
                )
            }
        }
    }

    clearTimeout(timeoutId)
    throw lastError || new Error('Request failed after all retries')
}
