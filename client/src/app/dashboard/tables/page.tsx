import TablesClient from './TablesClient';
import { fetchTables } from '@/services/tables';
import { Table } from '@/types/table';

export default async function ManageTablesPage() {
  const tables: Table[] = await fetchTables();

  const formattedTables = tables.map(table => ({
    id: table.id_mesa,
    ...table,
  }));

  return <TablesClient initialItems={formattedTables} />;
}