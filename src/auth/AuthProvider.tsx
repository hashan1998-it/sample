import {
    useRef,
    useImperativeHandle,
    useCallback,
    useMemo,
    forwardRef,
} from 'react'
import AuthContext from './AuthContext'
import appConfig from '@/configs/app.config'
import { useSessionUser, useToken } from '@/store/authStore'
import { apiSignIn, apiSignOut, apiSignUp } from '@/services/AuthService'
import { apiCheckOnboardingStatus } from '@/services/OnboardService'
import { REDIRECT_URL_KEY } from '@/constants/app.constant'
import { useNavigate } from 'react-router-dom'
import type {
    SignInCredential,
    SignUpCredential,
    OauthSignInCallbackPayload,
    User,
    Token,
    AuthRequestStatus,
} from '@/@types/auth'
import type { ReactNode } from 'react'
import type { NavigateFunction } from 'react-router-dom'

type AuthProviderProps = { children: ReactNode }

export type IsolatedNavigatorRef = {
    navigate: NavigateFunction
}

type AuthResult = { status: AuthRequestStatus; message: string }

// Utility to extract error message from API errors
function extractErrorMessage(error: unknown): string {
    if (
        typeof error === 'object' &&
        error !== null &&
        'response' in error &&
        typeof (error as { response?: unknown }).response === 'object' &&
        (error as { response: unknown }).response !== null
    ) {
        const response = (error as { response: unknown }).response
        if (
            typeof response === 'object' &&
            response !== null &&
            'data' in response &&
            typeof (response as { data?: unknown }).data === 'object' &&
            (response as { data: unknown }).data !== null
        ) {
            const data = (response as { data: unknown }).data
            if (
                typeof data === 'object' &&
                data !== null &&
                'message' in data &&
                typeof (data as { message?: unknown }).message === 'string'
            ) {
                return (data as { message: string }).message
            }
        }
    }
    if (
        typeof error === 'object' &&
        error &&
        'toString' in error &&
        typeof error.toString === 'function'
    ) {
        return error.toString()
    }
    return 'Unknown error'
}

// ForwardRef for IsolatedNavigator
const IsolatedNavigator = forwardRef<IsolatedNavigatorRef>((_, ref) => {
    const navigate = useNavigate()
    useImperativeHandle(ref, () => ({ navigate }), [navigate])
    return null
})
IsolatedNavigator.displayName = 'IsolatedNavigator'

function AuthProvider({ children }: AuthProviderProps) {
    const signedIn = useSessionUser((state) => state.session.signedIn)
    const user = useSessionUser((state) => state.user)
    const setUser = useSessionUser((state) => state.setUser)
    const setSessionSignedIn = useSessionUser(
        (state) => state.setSessionSignedIn,
    )
    const { token, setToken } = useToken()

    const authenticated = Boolean(token && signedIn)

    const navigatorRef = useRef<IsolatedNavigatorRef>(null)

    const redirectAfterAuth = useCallback(async (isSignUp: boolean = false) => {
        const search = window.location.search
        const params = new URLSearchParams(search)
        const redirectUrl = params.get(REDIRECT_URL_KEY)

        if (redirectUrl) {
            navigatorRef.current?.navigate(redirectUrl)
            return
        }

        try {
            const status = await apiCheckOnboardingStatus()
            if (isSignUp || status.shouldRedirectToOnboard) {
                navigatorRef.current?.navigate('/onboard')
            } else {
                navigatorRef.current?.navigate(appConfig.authenticatedEntryPath)
            }
        } catch {
            const fallbackPath = isSignUp
                ? '/onboard'
                : appConfig.authenticatedEntryPath
            navigatorRef.current?.navigate(fallbackPath)
        }
    }, [])

    const handleSignIn = useCallback(
        (tokens: Token, user?: User) => {
            setToken(tokens.accessToken)
            setSessionSignedIn(true)
            if (user) setUser(user)
        },
        [setToken, setSessionSignedIn, setUser],
    )

    const handleSignOut = useCallback(() => {
        setToken('')
        setUser({})
        setSessionSignedIn(false)
    }, [setToken, setUser, setSessionSignedIn])

    const signIn = useCallback(
        async (values: SignInCredential): Promise<AuthResult> => {
            try {
                const resp = await apiSignIn(values)
                if (resp) {
                    handleSignIn({ accessToken: resp.token }, resp.user)
                    await redirectAfterAuth(false)
                    return { status: 'success', message: '' }
                }
                return { status: 'failed', message: 'Unable to sign in' }
            } catch (error: unknown) {
                return { status: 'failed', message: extractErrorMessage(error) }
            }
        },
        [handleSignIn, redirectAfterAuth],
    )

    const signUp = useCallback(
        async (values: SignUpCredential): Promise<AuthResult> => {
            try {
                const resp = await apiSignUp(values)
                if (resp) {
                    handleSignIn({ accessToken: resp.token }, resp.user)
                    await redirectAfterAuth(true)
                    return { status: 'success', message: '' }
                }
                return { status: 'failed', message: 'Unable to sign up' }
            } catch (error: unknown) {
                return { status: 'failed', message: extractErrorMessage(error) }
            }
        },
        [handleSignIn, redirectAfterAuth],
    )

    const signOut = useCallback(async () => {
        try {
            await apiSignOut()
        } finally {
            handleSignOut()
            navigatorRef.current?.navigate(appConfig.unAuthenticatedEntryPath)
        }
    }, [handleSignOut])

    const oAuthSignIn = useCallback(
        (callback: (payload: OauthSignInCallbackPayload) => void) => {
            callback({
                onSignIn: handleSignIn,
                redirect: () => redirectAfterAuth(false),
            })
        },
        [handleSignIn, redirectAfterAuth],
    )

    const contextValue = useMemo(
        () => ({
            authenticated,
            user,
            signIn,
            signUp,
            signOut,
            oAuthSignIn,
        }),
        [authenticated, user, signIn, signUp, signOut, oAuthSignIn],
    )

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
            <IsolatedNavigator ref={navigatorRef} />
        </AuthContext.Provider>
    )
}

export default AuthProvider
