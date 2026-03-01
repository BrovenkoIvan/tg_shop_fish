"use client";

import { useEffect, useState } from "react";

type Product = {
  id: number;
  name: string;
  price: number;
};

const products: Product[] = [
  { id: 1, name: "Спиннинг Pro 2.4м", price: 2500 },
  { id: 2, name: "Катушка Shimano", price: 3200 },
  { id: 3, name: "Набор приманок", price: 900 },
];

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [cart, setCart] = useState<Product[]>([]);
  const [tab, setTab] = useState<"catalog" | "cart" | "profile">("catalog");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [initData, setInitData] = useState<string>(""); // <--- сюда положим строку для сервера

  useEffect(() => {
    if (typeof window !== "undefined" && (window as any).Telegram) {
      const tg = (window as any).Telegram.WebApp;
      tg.ready();
      tg.expand();
      setUser(tg.initDataUnsafe?.user);
      setInitData(tg.initData); // <--- теперь у нас точно строка initData
      console.log("InitData:", tg.initData);
    }
  }, []);

  const addToCart = (product: Product) => {
    setCart((prev) => [...prev, product]);
  };

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  const placeOrder = async () => {
  if (cart.length === 0) return alert("Корзина пуста");

  setLoading(true);
  setSuccess(false);

  try {
    if (!initData) {
      alert("InitData не доступен. Откройте Mini App через Telegram.");
      setLoading(false);
      return;
    }

    const res = await fetch("https://tgshop-api.onrender.com/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cart, initData }), // ✅ user убрали
    });

    const data = await res.json();

    if (data.success) {
      setSuccess(true);
      setCart([]);
    } else {
      alert(data.error || "Ошибка при отправке заказа");
    }
  } catch (e) {
    alert("Сервер недоступен");
    console.error(e);
  }

  setLoading(false);
};

  return (
    <div className="min-h-screen pb-24 bg-gray-50">
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">🎣 Fishing Store</h1>

        {tab === "catalog" &&
          products.map((product) => (
            <div
              key={product.id}
              className="bg-white p-4 rounded-xl mb-3 shadow"
            >
              <h3 className="text-lg font-semibold">{product.name}</h3>
              <p className="text-red">{product.price} грн</p>
              <button
                onClick={() => addToCart(product)}
                className="mt-2 w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Добавить в корзину
              </button>
            </div>
          ))}

        {tab === "cart" && (
          <>
            <h2 className="text-xl font-semibold mb-2">🛒 Корзина ({cart.length})</h2>
            {cart.length === 0 && <p>Корзина пуста</p>}
            {cart.map((item, idx) => (
              <div key={idx} className="py-1">
                {item.name} — {item.price} грн
              </div>
            ))}
            <h3 className="font-bold mt-2">Итого: {total} грн</h3>

            <button
              onClick={placeOrder}
              disabled={loading || cart.length === 0}
              className={`mt-4 w-full py-3 rounded-lg text-white transition ${
                loading || cart.length === 0
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {loading ? "Отправка..." : "Оформить заказ"}
            </button>

            {success && (
              <p className="text-green-600 mt-2">✅ Заказ успешно отправлен!</p>
            )}
          </>
        )}

        {tab === "profile" && (
          <>
            <h2 className="text-xl font-semibold mb-2">👤 Профиль</h2>
            {user ? (
              <>
                <p>Имя: {user.first_name}</p>
                <p>ID: {user.id}</p>
              </>
            ) : (
              <p>Нет данных</p>
            )}
          </>
        )}
      </div>

      {/* Нижнее меню */}
      <div className="fixed bottom-0 w-full flex justify-around bg-white border-t border-gray-200 py-2">
        <button
          onClick={() => setTab("catalog")}
          className="flex-1 text-center py-2"
        >
          📦 Каталог
        </button>
        <button
          onClick={() => setTab("cart")}
          className="flex-1 text-center py-2"
        >
          🛒 Корзина ({cart.length})
        </button>
        <button
          onClick={() => setTab("profile")}
          className="flex-1 text-center py-2"
        >
          👤 Профиль
        </button>
      </div>
    </div>
  );
}