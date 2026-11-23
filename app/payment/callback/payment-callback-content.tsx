
"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/components/cart-provider";

export default function PaymentCallbackContent() {
  const params = useSearchParams();

  const reference = params.get("reference");
  const alreadySuccessful = params.get("success") === "1";

  const { clearCart } = useCart();

  const [status, setStatus] = useState(
    alreadySuccessful
      ? "Payment successful. Your LUXORA order has been placed."
      : "Verifying your payment..."
  );

  const [ok, setOk] = useState(alreadySuccessful);

  useEffect(() => {
    if (alreadySuccessful) return;

    if (!reference) {
      setStatus("No payment reference was found.");
      return;
    }

    fetch(
      `/api/paystack/verify?reference=${encodeURIComponent(reference)}`
    )
      .then(async (r) => {
        const d = await r.json();

        if (!r.ok) {
          throw new Error(d.error || "Payment verification failed.");
        }

        setOk(true);

        setStatus(
          "Payment successful. Your LUXORA order has been placed."
        );

        clearCart();

        window.history.replaceState(
          {},
          "",
          `/payment/callback?reference=${encodeURIComponent(reference)}&success=1`
        );
      })
      .catch((e) => {
        setStatus(e.message);
      });
  }, [alreadySuccessful, reference, clearCart]);

  return (
    <main className="container flex min-h-[65vh] items-center justify-center py-20 text-center">
      <div>
        <span className="eyebrow">LUXORA Checkout</span>

        <h1 className="display-serif mt-4 text-5xl">
          {ok ? "Thank you." : "One moment."}
        </h1>

        <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-muted">
          {status}
        </p>

        {ok && (
          <div className="mt-8 flex justify-center gap-3">
            <Link href="/account" className="lux-button">
              View Orders
            </Link>

            <Link
              href="/collections"
              className="border border-line px-6 py-3 text-[10px] uppercase tracking-[.12em]"
            >
              Continue Shopping
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
