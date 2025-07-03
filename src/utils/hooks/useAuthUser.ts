import { useEffect, useState } from 'react'
import { jwtDecode } from 'jwt-decode'

type DecodedToken = {
    email: string
    name: string
    sub: string
}

export const useAuthUser = () => {
    const [user, setUser] = useState<DecodedToken | null>(null)

    useEffect(() => {
        const token = localStorage.getItem('access_token')
        if (token) {
            const decoded = jwtDecode<DecodedToken>(token)
            setUser(decoded)
        }
    }, [])

    return user
}
