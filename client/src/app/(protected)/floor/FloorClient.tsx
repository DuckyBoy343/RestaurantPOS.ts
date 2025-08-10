'use client';

import toast from 'react-hot-toast';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { changeTableStatus, fetchTables } from '../../../services/tables.ts';
import { createOrder } from '../../../services/orders';
import { type Table, type TableWithOrders } from '../../../types/table';
import styles from '../../../styles/TableView.module.css';
import Modal from '../../../components/Modal';

export default function FloorClient() {
    const router = useRouter();
    const [tables, setTables] = useState<TableWithOrders[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTable, setSelectedTable] = useState<Table | null>(null);
    const [loading, setLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleTableClick = (table: TableWithOrders) => {
        if (table.mesa_estatus) {
            setSelectedTable(table);
            setIsModalOpen(true);
        } else {
            router.push(`/orders/${table.id_orden}`);
        }
    };

    useEffect(() => {
        const getTables = async () => {
            try {
                const data = await fetchTables();
                setTables(data);
            } catch (error) {
                console.error("Failed to fetch tables", error);
            } finally {
                setLoading(false);
            }
        };
        getTables();
    }, []);

    const handleConfirmOrder = async () => {
        if (!selectedTable) return;

        try {
            const data = {
                id_usuario: 1, // This will come from a session later
                id_mesa: selectedTable.id_mesa,
                tipo_orden: "Comer aqui",
            };
            const response = await createOrder(data);
            const newOrderData = response.newOrder;

            console.log("New Order Created:", newOrderData);

            if (newOrderData && newOrderData.id_orden) {
                await changeTableStatus(selectedTable.id_mesa, false);
                router.push(`/orders/${newOrderData.id_orden}`);
            } else {
                throw new Error('Could not create the order correctly');
            }
        } catch (error) {
            console.error("Error creating order:", error);
            toast.error("Error al crear la order.");
        } finally {
            setIsModalOpen(false);
            setSelectedTable(null);
        }
    };

    const handleTakeoutOrder = async () => {
        setIsProcessing(true);
        try {
            const data = {
                id_usuario: 1,
                id_mesa: null,
                tipo_orden: 'Para llevar',
            };
            const response = await createOrder(data);
            const newOrderData = response.newOrder;

            if (newOrderData && newOrderData.id_orden) {
                router.push(`/orders/${newOrderData.id_orden}`);
            } else {
                throw new Error('No se pudo crear la orden para llevar.');
            }
        } catch (error) {
            console.error("Error creating takeout order:", error);
            toast.error("Error al crear la orden para llevar.");
        } finally {
            setIsProcessing(false);
        }
    };


    if (loading) {
        return <div className={styles.container}><h1>Cargando...</h1></div>;
    }

    return (
    <div className="container py-4">
        <h1 className="mb-4 border-bottom pb-3">Punto de Venta</h1>

        {/* --- Grid for Tables --- */}
        <h2 className="mb-3">Mesas</h2>
        <div className="row g-4">
            {tables.map((table) => {
                const isAvailable = table.mesa_estatus;
                const cardBg = isAvailable ? 'bg-light' : 'bg-danger';
                const textColor = isAvailable ? 'text-dark' : 'text-white';
                const statusText = isAvailable ? 'Disponible' : 'Ocupada';

                return (
                    <div key={table.id_mesa} className="col-12 col-md-6 col-lg-3">
                        <div
                            className={`card h-100 shadow-sm ${cardBg} ${textColor}`}
                            onClick={() => handleTableClick(table)}
                            style={{ cursor: 'pointer' }}
                        >
                            <div className="card-header fw-bold fs-5">
                                Mesa {table.mesa_nombre}
                            </div>
                            <div className="card-body text-center d-flex flex-column justify-content-center">
                                {isAvailable ? (
                                    <i className="bi bi-check-circle-fill text-success" style={{ fontSize: '2.5rem' }}></i>
                                ) : (
                                    <i className="bi bi-stop-circle-fill text-white" style={{ fontSize: '2.5rem' }}></i>
                                )}
                                <p className="card-text mt-2">{statusText}</p>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
        
        <hr className="my-4"/>

        {/* --- Grid for Takeout --- */}
        <h2 className="mb-3">Para llevar</h2>
        <div className="row g-4">
            <div className="col-12 col-md-6 col-lg-3">
                <div 
                    className="card text-white bg-success h-100 shadow-sm" 
                    onClick={handleTakeoutOrder} 
                    style={{ cursor: 'pointer' }}
                    disabled={isProcessing}
                >
                    <div className="card-body text-center d-flex flex-column justify-content-center">
                        <i className="bi bi-bag-check-fill" style={{ fontSize: '2.5rem' }}></i>
                        <h4 className="card-title mt-2">
                            {isProcessing ? 'Creando...' : 'Pedido para llevar'}
                        </h4>
                    </div>
                </div>
            </div>
        </div>
        
        {/* Your Modal remains unchanged */}
        <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onConfirm={handleConfirmOrder}
            isProcessing={isProcessing}
        >
            <p>Â¿Desea abrir una nueva orden para la Mesa {selectedTable?.mesa_nombre}?</p>
        </Modal>
    </div>
);
}