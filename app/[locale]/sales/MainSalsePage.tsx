"use client";

import { getOrdersForSeller } from "@/actions/order.action";
import React, { useEffect, useState } from "react";

type OrderItemType = {
  id: string;
  quantity: number;
  price: number;
  product: {
    id: string;
    name: string;
    price: number;
    imageUrl: string;
  };
};

type OrderType = {
  id: string;
  total: number;
  status: string;
  createdAt: string;
  address: string;
  phone: number;
  user: {
    id: string;
    name: string;
    email: string;
  };
  items: OrderItemType[];
};

const MainSalsePage = ({ userId }: { userId: string }) => {
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function fetchOrders() {
      setLoading(true);
      const data = await getOrdersForSeller(userId);

      const formattedData = data.map((order) => ({
        ...order,
        createdAt: order.createdAt.toString(),
        items: order.items.map((item) => ({
          ...item,
          product: {
            ...item.product,
            createdAt: item.product.createdAt.toString(),
            updatedAt: item.product.updatedAt.toString(),
          },
        })),
      }));

      setOrders(formattedData);
      setLoading(false);
    }
    fetchOrders();
  }, [userId]);

  if (loading) {
    return <div className="text-center p-10">Loading...</div>;
  }

  return (
    <div className="p-4 md:p-8">
      {orders.length === 0 && (
        <p className="text-center text-gray-500">لا توجد مبيعات بعد</p>
      )}

      <div className="flex flex-col gap-6">
        {orders.map((order) => (
          <div
            key={order.id}
            className="border rounded-lg shadow-sm p-4 bg-white
                       md:flex md:flex-row md:justify-between md:items-start"
          >
            {/* معلومات المشتري */}
            <div className="mb-4 md:mb-0">
              <h3 className="font-bold text-lg">{order.user.name}</h3>
              <p className="text-sm text-gray-500">{order.user.email}</p>
              <p className="text-sm">الهاتف: {order.phone}</p>
              <p className="text-sm">العنوان: {order.address}</p>
              <p className="text-sm">الحالة: {order.status}</p>
              <p className="text-sm">
                التاريخ: {new Date(order.createdAt).toLocaleString()}
              </p>
              <p className="text-sm font-semibold">المجموع: ${order.total}</p>
            </div>

            {/* المنتجات */}
            <div className="flex flex-col gap-2 md:gap-4">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 border p-2 rounded-lg"
                >
                  <img
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div>
                    <h4 className="font-semibold">{item.product.name}</h4>
                    <p className="text-sm text-gray-500">
                      السعر: ${item.product.price} × {item.quantity} = $
                      {(item.product.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MainSalsePage;
