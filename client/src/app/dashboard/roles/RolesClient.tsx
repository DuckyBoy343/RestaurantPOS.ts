'use client';

import MainGrid from '@/components/MainGrid';
import { Item } from '@/types/item';

interface RolesClientProps {
    initialItems: Item[];
}

const roleColumns = [
    { key: 'id_rol', label: 'ID' },
    { key: 'rol_nombre', label: 'Nombre' },
    { key: 'rol_estatus', label: 'Estatus' }
];

export default function RolesClient({ initialItems }: RolesClientProps) {
    const handleAddItem = (item: Omit<Item, 'id'>) => {
        console.log('Add:', item);
        // TODO: Add logic to call your API to create a new role
    };

    const handleEditItem = (item: Item) => {
        console.log('Edit:', item);
        // TODO: Add logic to navigate to an edit page or open a modal
    };

    const handleDeleteItems = (ids: (string | number)[]) => {
        console.log('Delete:', ids);
        // TODO: Add logic to call your API to delete the selected roles
    };

    return (
        <MainGrid
            title="Roles"
            columns={roleColumns}
            items={initialItems}
            itemNoun="Rol" // Correct noun for this context
            onAddItem={handleAddItem}
            onEditItem={handleEditItem}
            onDeleteItems={handleDeleteItems}
        />
    );
}