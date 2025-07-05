import { useAuth0 } from '@auth0/auth0-react'
import { useState, useEffect } from 'react'

const useAuth = () => {
    const { getAccessTokenSilently, isAuthenticated, isLoading, user } = useAuth0()
    const [token, setToken] = useState<string | null>(null)
    const [tokenLoading, setTokenLoading] = useState(false)
    const [tokenError, setTokenError] = useState<Error | null>(null)

  useEffect(() => {
    const getToken = async () => {
      if (isAuthenticated && !isLoading) {
        setTokenLoading(true);
        setTokenError(null);
        
                try {
                    const accessToken = await getAccessTokenSilently()
                    setToken(accessToken)
                } catch (error) {
                    setTokenError(
                        error instanceof Error
                            ? error
                            : new Error(String(error)),
                    )
                    setToken(null)
                } finally {
          setTokenLoading(false);
        }
      } else {
        setToken(null);
      }
    };

    getToken();
    }, [isAuthenticated, isLoading, getAccessTokenSilently])

    const refreshToken = async () => {
        if (!isAuthenticated) return null

        setTokenLoading(true)
        setTokenError(null)

        try {
            const accessToken = await getAccessTokenSilently()
            setToken(accessToken)
            return accessToken
        } catch (error) {
            setTokenError(
                error instanceof Error ? error : new Error(String(error)),
            )
            setToken(null)
            throw error
        } finally {
            setTokenLoading(false)
        }
    }

    return {
        token,
        isLoading: tokenLoading,
        error: tokenError,
        refreshToken,
        isAuthenticated,
        user,
    }
}

export default useAuth