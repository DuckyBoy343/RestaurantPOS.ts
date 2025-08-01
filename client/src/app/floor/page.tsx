import { fetchTables } from '@/services/tables';
import FloorClient from './FloorClient';

export default async function FloorPage() {
    // Fetch the data on the server
    const tables = await fetchTables();

    // Pass the initial data to the client component
    return <FloorClient initialTables={tables} />;
}