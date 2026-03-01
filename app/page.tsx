"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && (window as any).Telegram) {
      const tg = (window as any).Telegram.WebApp;

      tg.ready();
      tg.expand();

      const telegramUser = tg.initDataUnsafe?.user;
      setUser(telegramUser);
    }
  }, []);

  return (
    <main style={{ padding: 20 }}>
      <h1>🎣 Fishing Store</h1>

      {user ? (
        <>
          <p>Привет, {user.first_name}!</p>
          <p>ID: {user.id}</p>
        </>
      ) : (
        <p>Открой это через Telegram</p>
      )}

      <hr />

      <button
        style={{
          padding: 12,
          background: "black",
          color: "white",
          borderRadius: 8,
        }}
        onClick={() => alert("Товар добавлен в корзину")}
      >
        Купить спиннинг 🎣
      </button>
    </main>
  );
}