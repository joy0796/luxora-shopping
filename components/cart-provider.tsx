// 'use client';

// import { createContext, useContext, useEffect, useMemo, useState } from 'react';
// import type { Product } from '@/lib/data';
// import { useAuth } from './auth-provider';
// import { collection, doc, getDoc, setDoc } from 'firebase/firestore';
// import { db } from '@/lib/firebase';

// export type CartItem = { productId: string; name: string; price: number; image: string; quantity: number; color: string };
// type CartContextValue = { items: CartItem[]; count: number; subtotal: number; addToCart: (product: Product, color?: string, quantity?: number) => void; updateQuantity: (productId: string, color: string, quantity: number) => void; removeItem: (productId: string, color: string) => void; clearCart: () => void; loading: boolean };
// const C = createContext<CartContextValue | null>(null);
// const key = 'luxora-cart';

// export function CartProvider({ children }: { children: React.ReactNode }) {
//   const { user } = useAuth();
//   const [items, setItems] = useState<CartItem[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     let cancelled = false;
//     async function load() {
//       setLoading(true);
//       try {
//         if (user) {
//           const snap = await getDoc(doc(collection(db, 'carts'), user.uid));
//           if (!cancelled) setItems((snap.data()?.items as CartItem[]) || []);
//         } else {
//           const raw = typeof window !== 'undefined' ? localStorage.getItem(key) : null;
//           if (!cancelled) setItems(raw ? JSON.parse(raw) : []);
//         }
//       } catch { if (!cancelled) setItems([]); }
//       finally { if (!cancelled) setLoading(false); }
//     }
//     load();
//     return () => { cancelled = true; };
//   }, [user]);

//   useEffect(() => {
//     if (loading) return;
//     localStorage.setItem(key, JSON.stringify(items));
//     if (user) void setDoc(doc(collection(db, 'carts'), user.uid), { items, updatedAt: new Date() }, { merge: true });
//   }, [items, user, loading]);

//   const value = useMemo<CartContextValue>(() => ({
//     items,
//     count: items.reduce((sum, item) => sum + item.quantity, 0),
//     subtotal: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
//     addToCart: (product, color = product.colors[0]?.name || 'Default', quantity = 1) => setItems((current) => {
//       const index = current.findIndex((item) => item.productId === product.id && item.color === color);
//       if (index >= 0) return current.map((item, i) => i === index ? { ...item, quantity: item.quantity + quantity } : item);
//       return [...current, { productId: product.id, name: product.name, price: product.price, image: product.image, quantity, color }];
//     }),
//     updateQuantity: (productId, color, quantity) => setItems((current) => quantity <= 0 ? current.filter((item) => !(item.productId === productId && item.color === color)) : current.map((item) => item.productId === productId && item.color === color ? { ...item, quantity } : item)),
//     removeItem: (productId, color) => setItems((current) => current.filter((item) => !(item.productId === productId && item.color === color))),
//     clearCart: () => setItems([]),
//     loading,
//   }), [items, loading]);

//   return <C.Provider value={value}>{children}</C.Provider>;
// }
// export function useCart() { const value = useContext(C); if (!value) throw new Error('useCart must be used inside CartProvider'); return value; }





'use client';

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import type { Product } from '@/lib/data';
import { products } from '@/lib/data';

import { useAuth } from './auth-provider';

import {
  doc,
  getDoc,
  setDoc,
} from 'firebase/firestore';

import { db } from '@/lib/firebase';

export type CartItem = {
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  color: string;
};

type CartContextValue = {
  items: CartItem[];
  count: number;
  subtotal: number;
  addToCart: (
    product: Product,
    color?: string,
    quantity?: number
  ) => void;
  updateQuantity: (
    productId: string,
    color: string,
    quantity: number
  ) => void;
  removeItem: (productId: string, color: string) => void;
  clearCart: () => void;
  loading: boolean;
};

const C = createContext<CartContextValue | null>(null);

const GUEST_CART_KEY = 'luxora-cart-guest';

function normalizeCartItems(savedItems: unknown): CartItem[] {
  if (!Array.isArray(savedItems)) return [];

  return savedItems.flatMap((item): CartItem[] => {
    if (!item || typeof item !== 'object') return [];

    const saved = item as Partial<CartItem>;

    const product = products.find(
      (p) => p.id === saved.productId
    );

    if (!product) return [];

    const quantity = Math.max(
      1,
      Math.min(
        20,
        Math.floor(Number(saved.quantity) || 1)
      )
    );

    const color = product.colors.some(
      (c) => c.name === saved.color
    )
      ? saved.color!
      : product.colors[0]?.name || 'Default';

    return [
      {
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity,
        color,
      },
    ];
  });
}

export function CartProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();

  const ownerKey = user ? `user:${user.uid}` : 'guest';

  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadedOwner, setLoadedOwner] = useState<string | null>(null);

  // Load the cart belonging to the current user
  useEffect(() => {
    let cancelled = false;

    async function loadCart() {
      setLoading(true);
      setLoadedOwner(null);
      setItems([]);

      try {
        let savedItems: unknown = [];

        if (user) {
          const cartRef = doc(db, 'carts', user.uid);
          const snapshot = await getDoc(cartRef);

          savedItems = snapshot.data()?.items || [];
        } else {
          const raw = localStorage.getItem(GUEST_CART_KEY);

          savedItems = raw ? JSON.parse(raw) : [];
        }

        if (!cancelled) {
          setItems(normalizeCartItems(savedItems));
          setLoadedOwner(ownerKey);
        }
      } catch (error) {
        console.error('Unable to load cart:', error);

        if (!cancelled) {
          setItems([]);
          setLoadedOwner(ownerKey);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadCart();

    return () => {
      cancelled = true;
    };
  }, [user, ownerKey]);

  // Save only after the correct user's cart has loaded
  useEffect(() => {
    if (loading || loadedOwner !== ownerKey) return;

    if (user) {
      void setDoc(
        doc(db, 'carts', user.uid),
        {
          items,
          updatedAt: new Date(),
        },
        { merge: true }
      ).catch((error) => {
        console.error('Unable to save user cart:', error);
      });
    } else {
      localStorage.setItem(
        GUEST_CART_KEY,
        JSON.stringify(items)
      );
    }
  }, [items, user, loading, loadedOwner, ownerKey]);

  const value = useMemo<CartContextValue>(
    () => ({
      items,

      count: items.reduce(
        (sum, item) => sum + item.quantity,
        0
      ),

      subtotal: items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      ),

      addToCart: (
        product,
        color = product.colors[0]?.name || 'Default',
        quantity = 1
      ) => {
        const safeQuantity = Math.max(
          1,
          Math.min(20, Math.floor(Number(quantity) || 1))
        );

        setItems((current) => {
          const index = current.findIndex(
            (item) =>
              item.productId === product.id &&
              item.color === color
          );

          if (index >= 0) {
            return current.map((item, i) =>
              i === index
                ? {
                    ...item,
                    name: product.name,
                    price: product.price,
                    image: product.image,
                    quantity: Math.min(
                      20,
                      item.quantity + safeQuantity
                    ),
                  }
                : item
            );
          }

          return [
            ...current,
            {
              productId: product.id,
              name: product.name,
              price: product.price,
              image: product.image,
              quantity: safeQuantity,
              color,
            },
          ];
        });
      },

      updateQuantity: (productId, color, quantity) => {
        setItems((current) =>
          quantity <= 0
            ? current.filter(
                (item) =>
                  !(
                    item.productId === productId &&
                    item.color === color
                  )
              )
            : current.map((item) =>
                item.productId === productId &&
                item.color === color
                  ? {
                      ...item,
                      quantity: Math.min(
                        20,
                        Math.floor(quantity)
                      ),
                    }
                  : item
              )
        );
      },

      removeItem: (productId, color) => {
        setItems((current) =>
          current.filter(
            (item) =>
              !(
                item.productId === productId &&
                item.color === color
              )
          )
        );
      },

      clearCart: () => setItems([]),

      loading,
    }),
    [items, loading]
  );

  return (
    <C.Provider value={value}>
      {children}
    </C.Provider>
  );
}

export function useCart() {
  const value = useContext(C);

  if (!value) {
    throw new Error(
      'useCart must be used inside CartProvider'
    );
  }

  return value;
}
