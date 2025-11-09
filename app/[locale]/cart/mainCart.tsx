"use client";

import { clearCart, deleteCartItem, getCart } from "@/actions/cart.action";
import AddOrderForm from "@/components/order/AddOrderForm";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";

// Cart item type
interface CartItem {
  id: string;
  productId: string;
  name: string;
  brand: string;
  price: number;
  quantity: number;
  image: string;
  maxQuantity: number;
}

const MainCart = ({ userId }: { userId: string }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    console.log("userId in cart page", userId);
    const fetchCart = async () => {
      if (userId) {
        const cart = await getCart(userId);
        console.log(cart);
        if (cart?.items) {
          const mapped = cart.items.map((item: any) => ({
            id: item.id,
            productId: item.product.id,
            name: item.product.name,
            brand: item.product.brand?.name || "Unknown",
            price: item.product.price,
            quantity: item.quantity,
            image: item.product.imageUrl,
            maxQuantity: item.product.quantity,
          }));
          setCartItems(mapped);
        }
      }
    };
    fetchCart();
  }, [userId]);

  // Format currency
  const formatPrice = (value: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);

  // Increase item quantity (client side)
  const increaseQuantity = (id: string) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: Math.min(item.quantity + 1, item.maxQuantity),
            }
          : item
      )
    );
  };

  const decreaseQuantity = (id: string) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(item.quantity - 1, 1) }
          : item
      )
    );
  };

  // Totals
  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const shipping = cartItems.length > 0 ? 15 : 0;
  const total = subtotal + shipping;

  const deleteCart = async () => {
    await clearCart(userId);
  };
  return (
    <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-5 lg:grid-cols-8 gap-6 p-4 font-sans">
      {/* Order Summary */}
      <div className="sm:col-span-2 lg:col-span-3 p-6 rounded-2xl shadow-lg border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-3">
          Order Summary
        </h2>

        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="text-gray-600">Subtotal:</span>
            <span className="font-medium">{formatPrice(subtotal)}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-600">Shipping:</span>
            <span className="font-medium">{formatPrice(shipping)}</span>
          </div>

          <div className="flex justify-between pt-4 border-t border-gray-200">
            <span className="text-lg font-bold text-gray-800">Total:</span>
            <span className="text-lg font-bold text-amber-600">
              {formatPrice(total)}
            </span>
          </div>

          <AddOrderForm userId={userId} total={total} items={cartItems} />
        </div>
      </div>

      {/* Cart Items */}
      <div className="sm:col-span-3 lg:col-span-5 space-y-4">
        {cartItems.length === 0 ? (
          <p className="text-gray-500 text-center py-10">
            Your cart is empty 🛒
          </p>
        ) : (
          cartItems.map((item) => (
            <div
              key={item.id}
              className="border border-gray-200 p-4 rounded-2xl shadow flex flex-col sm:flex-row items-center gap-4"
            >
              {/* Image */}
              <img
                src={item.image}
                alt={item.name}
                className="w-20 h-20 object-cover rounded-xl"
              />

              {/* Details */}
              <div className="flex-1 w-full">
                <h3 className="font-bold text-gray-800">{item.name}</h3>
                <p className="text-sm text-gray-500">{item.brand}</p>
                <p className="text-amber-600 font-bold mt-1">
                  {formatPrice(item.price)}
                </p>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center border border-gray-200 rounded-lg">
                <button
                  onClick={() => decreaseQuantity(item.id)}
                  className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                >
                  -
                </button>

                <span className="px-3 py-1 border-x border-gray-200">
                  {item.quantity}
                </span>

                <button
                  onClick={() => increaseQuantity(item.id)}
                  disabled={item.quantity >= item.maxQuantity}
                  className={`px-3 py-1 text-gray-600 hover:bg-gray-100 ${
                    item.quantity >= item.maxQuantity
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                >
                  +
                </button>
              </div>
              <div className="flex flex-wrap gap-4 items-center">
                <Button
                  className="bg-red-500 text-white"
                  onClick={async () => {
                    setCartItems((prev) =>
                      prev.filter((cartItem) => cartItem.id !== item.id)
                    );
                    console.log("Deleting item with id:", item.id);
                    await deleteCartItem(userId, item.id);
                  }}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))
        )}
        <div className="flex flex-wrap gap-4 items-center">
          <Button
            className="bg-red-500 text-white"
            onClick={async () => {
              setCartItems([]);
              await deleteCart();
            }}
          >
            حذف السلة
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MainCart;
