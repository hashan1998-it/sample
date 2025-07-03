import ItemList from '@/views/menus/ItemList'
// import { MenuFormSchema } from '../types'
// import { Control, FieldErrors } from 'react-hook-form'

// type ItemMenuSectionProps = {
//     control: Control<MenuFormSchema>
//     errors: FieldErrors<MenuFormSchema>
// }
interface ItemListTableProps {
    menuId: string
}
export default function ItemMenuSection({ menuId }: ItemListTableProps) {
    return (
        <div className="space-y-4">
            <ItemList menuId={menuId} />
        </div>
    )
}
