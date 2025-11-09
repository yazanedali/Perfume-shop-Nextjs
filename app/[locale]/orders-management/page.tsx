"use client";

import React, { useEffect, useState } from "react";
import {
  getOrdersForAdmin,
  updateOrderStatus,
  deleteOrderById,
} from "@/actions/order.action";
import { OrderStatus } from "@prisma/client";

type OrderType = {
  id: string;
  user: { id: string; name: string; email: string };
  items: {
    id: string;
    quantity: number;
    price: number;
    product: { id: string; name: string; price: number; imageUrl: string };
  }[];
  total: number;
  status: OrderStatus;
  createdAt: string;
  address: string;
  phone: number;
};

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      const data = await getOrdersForAdmin("");
      setOrders(data);
      setLoading(false);
    };
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId: string, status: OrderStatus) => {
    await updateOrderStatus(orderId, status);
    setOrders((prev) =>
      prev.map((order) => (order.id === orderId ? { ...order, status } : order))
    );
  };

  const handleDelete = async (orderId: string) => {
    await deleteOrderById(orderId);
    setOrders((prev) => prev.filter((order) => order.id !== orderId));
  };

  if (loading) return <div>Loading orders...</div>;

  return (
    <div className="p-4 flex flex-col gap-4">
      {orders.map((order) => (
        <div
          key={order.id}
          className="border rounded-lg p-4 shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
        >
          <div className="flex flex-col gap-1 w-full md:w-2/3">
            <div className="font-semibold">
              {order.user.name} ({order.user.email})
            </div>
            <div className="text-sm text-gray-600">
              Total: ${order.total.toFixed(2)}
            </div>
            <div className="flex flex-col gap-2 mt-2">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-2 border p-2 rounded"
                >
                  <img
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div className="flex flex-col">
                    <span className="font-medium">{item.product.name}</span>
                    <span className="text-sm text-gray-500">
                      ${item.product.price} x {item.quantity}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2 md:items-end">
            <select
              value={order.status}
              onChange={(e) =>
                handleStatusChange(order.id, e.target.value as OrderStatus)
              }
              className="border p-2 rounded"
            >
              <option value="PENDING">Pending</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
            <button
              onClick={() => handleDelete(order.id)}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Delete Order
            </button>
            <div className="text-sm text-gray-500">
              {new Date(order.createdAt).toLocaleString()}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminOrdersPage;
