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

  useEffect(() => {
    if (typeof window !== "undefined" && (window as any).Telegram) {
      const tg = (window as any).Telegram.WebApp;
      tg.ready();
      tg.expand();
      setUser(tg.initDataUnsafe?.user);
    }
  }, []);

  const addToCart = (product: Product) => {
    setCart((prev) => [...prev, product]);
  };

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <div style={{ minHeight: "100vh", paddingBottom: 70 }}>
      <div style={{ padding: 16 }}>
        <h1>🎣 Fishing Store</h1>

        {tab === "catalog" && (
          <>
            {products.map((product) => (
              <div
                key={product.id}
                style={{
                  background: "#f5f5f5",
                  padding: 16,
                  borderRadius: 12,
                  marginBottom: 12,
                }}
              >
                <h3>{product.name}</h3>
                <p>{product.price} грн</p>
                <button
                  onClick={() => addToCart(product)}
                  style={{
                    padding: 10,
                    width: "100%",
                    background: "#0088cc",
                    color: "white",
                    borderRadius: 8,
                    border: "none",
                  }}
                >
                  Добавить в корзину
                </button>
              </div>
            ))}
          </>
        )}

        {tab === "cart" && (
          <>
            <h2>🛒 Корзина</h2>
            {cart.length === 0 && <p>Корзина пуста</p>}

            {cart.map((item, index) => (
              <div key={index} style={{ marginBottom: 8 }}>
                {item.name} — {item.price} грн
              </div>
            ))}

            <h3>Итого: {total} грн</h3>
          </>
        )}

        {tab === "profile" && (
          <>
            <h2>👤 Профиль</h2>
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

      {/* Нижняя навигация */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          width: "100%",
          display: "flex",
          justifyContent: "space-around",
          background: "white",
          borderTop: "1px solid #ddd",
          padding: 10,
        }}
      >
        <button onClick={() => setTab("catalog")}>📦 Каталог</button>
        <button onClick={() => setTab("cart")}>
          🛒 Корзина ({cart.length})
        </button>
        <button onClick={() => setTab("profile")}>👤 Профиль</button>
      </div>
    </div>
  );
}