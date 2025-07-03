import { gql } from '@apollo/client'

const CREATE_OUTLET = gql`
    mutation CreateOutlet($outlet: OutletInput!) {
        createOutlet(outlet: $outlet) {
            name
        }
    }
`

const UPDATE_OUTLET = gql`
    mutation UpdateOutlet($data: OutletInput!, $updateOutletId: String!) {
        updateOutlet(data: $data, id: $updateOutletId) {
            name
        }
    }
`
const DELETE_OUTLET = gql`
    mutation DeleteOutlet($deleteOutletId: String!) {
        deleteOutlet(id: $deleteOutletId) {
            name
        }
    }
`

const DELETE_OUTLETS = gql`
    mutation DeleteOutletS($ids: [String!]!) {
        deleteOutlets(ids: $ids) {
            name
        }
    }
`
export const CREATE_OUTLET_STRING = CREATE_OUTLET.loc?.source.body || ''
export const UPDATE_OUTLET_STRING = UPDATE_OUTLET.loc?.source.body || ''
export const DELETE_OUTLET_STRING = DELETE_OUTLET.loc?.source.body || ''
export const DELETE_OUTLETS_STRING = DELETE_OUTLETS.loc?.source.body || ''
