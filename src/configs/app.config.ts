export type AppConfig = {
    apiPrefix: string
    authenticatedEntryPath: string
    unAuthenticatedEntryPath: string
    locale: string
    accessTokenPersistStrategy: 'localStorage' | 'sessionStorage' | 'cookies'
    enableMock: boolean
    activeNavTranslation: boolean
    auth0: {
        domain: string
        clientId: string
        audience: string
    }
}

const appConfig: AppConfig = {
    apiPrefix: '/api',
    authenticatedEntryPath: '/outlets',
    unAuthenticatedEntryPath: '/sign-in',
    locale: 'en',
    accessTokenPersistStrategy: 'cookies',
    enableMock: true,
    activeNavTranslation: false,
    auth0: {
        domain: 'dev-n3fumsgjpbk1rgwb.us.auth0.com',
        clientId: 'qYuOQGUpBlCwGMdfEYeSLNklMNFBwt6j',
        audience: 'https://dev-n3fumsgjpbk1rgwb.us.auth0.com/api/v2/',
    },
}

export default appConfig
