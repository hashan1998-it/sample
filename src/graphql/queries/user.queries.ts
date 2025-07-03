import { gql } from '@apollo/client'

export const GET_USERS_BY_ID = gql`
    query GetUser($getUserId: String!) {
        getUser(id: $getUserId) {
            id
            firstName
            lastName
            email
            address {
                addressLine1
                addressLine2
                city
                state
                postal
                country
            }
            img
        }
    }
`
export const GET_USERS_BY_ID_STRING = GET_USERS_BY_ID.loc?.source.body || ''
