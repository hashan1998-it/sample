import { BrowserRouter } from 'react-router-dom'
import Theme from '@/components/template/Theme'
import Layout from '@/components/layouts'
import Views from '@/views'
import appConfig from './configs/app.config'
import { Auth0Provider } from '@auth0/auth0-react'
//import AuthRedirectGuard from './pages/AuthRedirectGuard'

if (appConfig.enableMock) {
    import('./mock')
}

function App() {
    return (
        <Theme>
            <BrowserRouter>
                <Auth0Provider
                    domain={appConfig.auth0.domain}
                    clientId={appConfig.auth0.clientId}
                    authorizationParams={{
                        redirect_uri: window.location.origin + '/sign-in',
                        audience: appConfig.auth0.audience,
                    }}
                    cacheLocation="localstorage"
                >
                    <Layout>
                        <Views />
                    </Layout>
                </Auth0Provider>
            </BrowserRouter>
        </Theme>
    )
}

export default App
