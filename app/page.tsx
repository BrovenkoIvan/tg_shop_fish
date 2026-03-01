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
    <main style={{ padding: 20 }}>
      <h1>🎣 Fishing Store</h1>

      {user && <p>Привет, {user.first_name}!</p>}

      <h2>Каталог</h2>

      {products.map((product) => (
        <div
          key={product.id}
          style={{
            border: "1px solid #ddd",
            padding: 12,
            marginBottom: 10,
            borderRadius: 8,
          }}
        >
          <h3>{product.name}</h3>
          <p>{product.price} грн</p>
          <button
            onClick={() => addToCart(product)}
            style={{
              padding: 8,
              background: "black",
              color: "white",
              borderRadius: 6,
            }}
          >
            В корзину
          </button>
        </div>
      ))}

      <hr />

      <h2>🛒 Корзина ({cart.length})</h2>

      {cart.map((item, index) => (
        <div key={index}>
          {item.name} — {item.price} грн
        </div>
      ))}

      <h3>Итого: {total} грн</h3>
    </main>
  );
}