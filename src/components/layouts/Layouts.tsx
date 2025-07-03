import { Suspense } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import Loading from '@/components/shared/Loading'
import PostLoginLayout from './PostLoginLayout'
import PreLoginLayout from './PreLoginLayout'
import { useThemeStore } from '@/store/themeStore'
import type { CommonProps } from '@/@types/common'

const LoadingFallback = () => (
  <div className="flex flex-auto flex-col h-[100vh]">
    <Loading loading={true} />
  </div>
)

const Layout = ({ children }: CommonProps) => {
  const { isAuthenticated } = useAuth0()
  const layoutType = useThemeStore((state) => state.layout.type)

  const renderLayout = () => {
    if (isAuthenticated) {
      return (
        <PostLoginLayout layoutType={layoutType}>
          {children}
        </PostLoginLayout>
      )
    }

    return <PreLoginLayout>{children}</PreLoginLayout>
  }

  return (
    <Suspense fallback={<LoadingFallback />}>
      {renderLayout()}
    </Suspense>
  )
}

export default Layout