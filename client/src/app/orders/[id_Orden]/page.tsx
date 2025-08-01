import { notFound } from 'next/navigation';
import { fetchProducts } from '@/services/products';
import { fetchCategories } from '@/services/categories';
import { fetchOrderById, fetchOrderDetails } from '@/services/orders';
import OrderClient from './OrderClient';

interface OrderPageProps {
    params: {
        id_orden: string;
    };
}

export default async function OrderPage({ params }: OrderPageProps) {
    const id_orden = Number(params.id_orden);

    if (isNaN(id_orden)) {
        notFound();
    }

    try {
        const [orderData, productsData, categoriesData, orderDetailsData] = await Promise.all([
            fetchOrderById(id_orden),
            fetchProducts(),
            fetchCategories(),
            fetchOrderDetails(id_orden),
        ]);

        if (!orderData) {
            notFound();
        }

        return (
            <OrderClient
                initialOrder={orderData}
                initialProducts={productsData}
                initialCategories={categoriesData}
                initialOrderDetails={orderDetailsData}
            />
        );
    } catch (error) {
        console.error("Failed to fetch order data:", error);
        notFound();
    }
}