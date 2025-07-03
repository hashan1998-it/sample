import Button from '@/components/ui/Button'
import { Form } from '@/components/ui/Form'
import { useForm } from 'react-hook-form'
import type { CommonProps } from '@/@types/common'
import type { ReactNode } from 'react'
import { useAuth0 } from '@auth0/auth0-react'

interface SignInFormProps extends CommonProps {
    disableSubmit?: boolean
    passwordHint?: string | ReactNode
    setMessage?: (message: string) => void
}

const SignInForm = (props: SignInFormProps) => {
    const { className } = props

    const {
        handleSubmit,
        // formState: { errors },
        // control,
    } = useForm()

    const { loginWithRedirect, isLoading } = useAuth0()

    return (
        <div className={className}>
            <Form onSubmit={handleSubmit(loginWithRedirect)}>
                <Button block loading={isLoading} variant="solid" type="submit">
                    {isLoading ? 'Signing in...' : 'Sign In'}
                </Button>
            </Form>
        </div>
    )
}

export default SignInForm
