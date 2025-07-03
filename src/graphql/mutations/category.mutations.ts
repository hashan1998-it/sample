import { gql } from '@apollo/client'

const CREATE_CATEGORY = gql`
    mutation CreateCategory($data: CategoryInput!) {
        createCategory(data: $data) {
            name
        }
    }
`
const UPDATE_CATEGORY = gql`
    mutation UpdateCategory($data: CategoryInput!, $updateCategoryId: String!) {
        updateCategory(data: $data, id: $updateCategoryId) {
            name
        }
    }
`
const DELETE_CATEGORY = gql`
    mutation DeleteCategory($deleteCategoryId: String!) {
        deleteCategory(id: $deleteCategoryId) {
            name
        }
    }
`
const DELETE_CATEGORIES = gql`
    mutation DeleteOutletS($ids: [String!]!) {
        deleteCategories(ids: $ids) {
            name
        }
    }
`
export const CREATE_CATEGORY_STRING = CREATE_CATEGORY.loc?.source.body || ''
export const UPDATE_CATEGORY_STRING = UPDATE_CATEGORY.loc?.source.body || ''
export const DELETE_CATEGORY_STRING = DELETE_CATEGORY.loc?.source.body || ''
export const DELETE_CATEGORIES_STRING = DELETE_CATEGORIES.loc?.source.body || ''
