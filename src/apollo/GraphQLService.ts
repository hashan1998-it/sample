// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export const graphqlRequest = async <TData, TVariables = {}>(
    query: string,
    variables?: TVariables,
): Promise<TData> => {
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
    })

    const json = await response.json()

    if (json.errors) {
        throw new Error(json.errors[0].message)
    }

    return json.data
}
