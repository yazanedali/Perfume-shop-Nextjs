import { getOrdersByUserId } from "@/actions/order.action";
import React from "react";

type Order = Awaited<ReturnType<typeof getOrdersByUserId>>[number];

const MainOrder = async ({ userId }: { userId: string }) => {
  if (!userId) {
    return (
      <p className="p-4 text-red-600">Please login to view your orders.</p>
    );
  }

  const orders: Order[] = await getOrdersByUserId(userId);

  if (!orders.length) {
    return (
      <div className="p-6 text-center text-gray-600">
        <p>No orders found 🚀</p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      {orders.map((it) => (
        <div
          key={it.id}
          className="w-full bg-white shadow-md rounded-2xl p-4 hover:shadow-lg transition"
        >
          {/* ✅ Order Info */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b pb-3 mb-3">
            <div>
              <p className="text-sm text-gray-500">Buyer: {it.user.name}</p>{" "}
              <p className="text-sm text-gray-500">
                {new Date(it.createdAt).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-500">📍 {it.address}</p>
              <p className="text-sm text-gray-500">📞 {it.phone}</p>
            </div>
            <div className="mt-2 md:mt-0 text-right">
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  it.status === "COMPLETED"
                    ? "bg-green-100 text-green-700"
                    : it.status === "PENDING"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {it.status}
              </span>
              <p className="text-xl font-bold text-gray-800 mt-1">
                ${it.total}
              </p>
            </div>
          </div>

          {/* ✅ Order Items */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {it.items
              .filter((item) => item !== null)
              .map((item) => (
                <div
                  key={item!.id}
                  className="flex items-center space-x-3 border rounded-lg p-2"
                >
                  <img
                    src={item!.product.imageUrl}
                    alt={item!.product.name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div>
                    <p className="text-sm font-medium">{item!.product.name}</p>
                    <p className="text-xs text-gray-500">
                      Qty: {item!.quantity} × ${item!.product.price}
                    </p>
                    <p className="text-sm font-semibold">${item!.price}</p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MainOrder;
