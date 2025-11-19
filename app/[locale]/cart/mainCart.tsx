"use client";

import { clearCart, deleteCartItem, getCart } from "@/actions/cart.action";
import AddOrderForm from "@/components/order/AddOrderForm";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
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
  const t = useTranslations();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [shippingOption, setShippingOption] = useState<number>(0);

  useEffect(() => {
    const fetchCart = async () => {
      if (userId) {
        const cart = await getCart(userId);
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
  const shipping = cartItems.length > 0 ? shippingOption : 0;
  const total = subtotal + shipping;

  const deleteCart = async (): Promise<void> => {
    await clearCart(userId);
  };

  const handleOrderSuccess = async () => {
    setCartItems([]);
    await clearCart(userId);
  };

  return (
    <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-5 lg:grid-cols-8 gap-6 p-4 font-sans">
      {/* Order Summary */}
      <div className="sm:col-span-2 lg:col-span-3 p-6 rounded-2xl shadow-lg border border-gray-100">
        <h2 className="text-xl font-bold mb-6 border-b pb-3">
          {t("Cart.orderSummary")}
        </h2>

        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="">{t("Cart.subtotal")}</span>
            <span className="font-medium">{formatPrice(subtotal)}</span>
          </div>

          {/* Shipping Select */}
          <div className="flex justify-between items-center">
            <span className="">{t("Cart.shipping")}</span>
            <select
              className="border rounded-lg px-3 py-1"
              value={shippingOption}
              onChange={(e) => setShippingOption(Number(e.target.value))}
            >
              <option value={20}>{t("Cart.westBank")} - $20</option>
              <option value={30}>{t("Cart.jerusalem")} - $30</option>
              <option value={50}>{t("Cart.insideIsrael")} - $50</option>
            </select>
          </div>

          <div className="flex justify-between pt-4 border-t border-gray-200">
            <span className="text-lg font-bold ">{t("Cart.total")}</span>
            <span className="text-lg font-bold text-amber-600">
              {formatPrice(total)}
            </span>
          </div>

          <AddOrderForm
            userId={userId}
            total={total}
            items={cartItems}
            onOrderSuccess={handleOrderSuccess}
          />
        </div>
      </div>

      {/* Cart Items */}
      <div className="sm:col-span-3 lg:col-span-5 space-y-4">
        {cartItems.length === 0 ? (
          <p className="text-center py-10">{t("Cart.yourCartEmpty")}</p>
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
                <h3 className="font-bold ">{item.name}</h3>
                <p className="text-sm ">{item.brand}</p>
                <p className="text-amber-600 font-bold mt-1">
                  {formatPrice(item.price)}
                </p>
                <p className="text-sm ">
                  {t("Cart.quantity")} {item.quantity}
                </p>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center border border-gray-200 rounded-lg">
                <button
                  onClick={() => decreaseQuantity(item.id)}
                  className="px-3 py-1  hover:bg-gray-100"
                >
                  {t("Cart.decreaseQuantity")}
                </button>

                <span className="px-3 py-1 border-x border-gray-200">
                  {item.quantity}
                </span>

                <button
                  onClick={() => increaseQuantity(item.id)}
                  disabled={item.quantity >= item.maxQuantity}
                  className={`px-3 py-1  hover:bg-gray-100 ${
                    item.quantity >= item.maxQuantity
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                >
                  {t("Cart.increaseQuantity")}
                </button>
              </div>

              {/* Delete Button */}
              <div className="flex flex-wrap gap-4 items-center">
                <Button
                  className="bg-red-500 text-white"
                  onClick={async () => {
                    setCartItems((prev) =>
                      prev.filter((cartItem) => cartItem.id !== item.id)
                    );
                    await deleteCartItem(userId, item.id);
                  }}
                >
                  {t("Cart.delete")}
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
            {t("Cart.clearCart")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MainCart;