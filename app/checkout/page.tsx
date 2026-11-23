// 'use client';
// import { useState } from 'react';import { useCart } from '@/components/cart-provider';import { useAuth } from '@/components/auth-provider';import { useRouter } from 'next/navigation';import Link from 'next/link';
// export default function Checkout(){const{items,subtotal}=useCart();const{user}=useAuth();const router=useRouter();const[name,setName]=useState(user?.displayName||'');const[email,setEmail]=useState(user?.email||'');const[address,setAddress]=useState('');const[city,setCity]=useState('');const[phone,setPhone]=useState('');const[busy,setBusy]=useState(false);const[error,setError]=useState('');const shipping=subtotal>=100?0:12;const total=subtotal+shipping;async function pay(e:React.FormEvent){e.preventDefault();setError('');if(!user){router.push('/login?next=/checkout');return}setBusy(true);try{const res=await fetch('/api/paystack/initialize',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email,name,phone,address,city,items,total,userId:user.uid})});const data=await res.json();if(!res.ok)throw new Error(data.error||'Unable to start payment.');window.location.href=data.authorization_url;}catch(err){setError(err instanceof Error?err.message:'Payment could not be started.');setBusy(false)}}if(items.length===0)return <main className="container min-h-[65vh] py-20 text-center"><span className="eyebrow">Checkout</span><h1 className="display-serif mt-4 text-5xl">Your bag is empty.</h1><Link href="/collections" className="lux-button mt-8">Shop Collections</Link></main>;return <main className="container py-12 md:py-16"><div className="mb-10"><span className="eyebrow">Secure checkout</span><h1 className="display-serif mt-3 text-5xl">Complete your order.</h1></div><div className="grid gap-10 lg:grid-cols-[1fr_400px]"><form onSubmit={pay} className="space-y-5"><div className="border border-line p-6"><h2 className="display-serif text-2xl">Contact & delivery</h2><div className="mt-5 grid gap-4 sm:grid-cols-2"><label className="block sm:col-span-2"><span className="field-label">Full name</span><input required value={name} onChange={e=>setName(e.target.value)} className="field"/></label><label className="block"><span className="field-label">Email</span><input required type="email" value={email} onChange={e=>setEmail(e.target.value)} className="field"/></label><label className="block"><span className="field-label">Phone</span><input required value={phone} onChange={e=>setPhone(e.target.value)} className="field"/></label><label className="block sm:col-span-2"><span className="field-label">Address</span><input required value={address} onChange={e=>setAddress(e.target.value)} className="field"/></label><label className="block"><span className="field-label">City</span><input required value={city} onChange={e=>setCity(e.target.value)} className="field"/></label></div></div>{error&&<p className="border border-red-200 bg-red-50 p-3 text-xs text-red-700">{error}</p>}<button disabled={busy||!user} className="lux-button w-full disabled:opacity-50">{busy?'Redirecting to payment…':'Pay securely with Paystack'}</button>{!user&&<p className="text-center text-xs text-muted">Please <Link href="/login?next=/checkout" className="underline">sign in</Link> before checkout.</p>}</form><aside className="h-fit border border-line bg-cream p-6"><h2 className="display-serif text-2xl">Order summary</h2><div className="mt-5 space-y-4">{items.map(i=><div key={`${i.productId}-${i.color}`} className="flex justify-between gap-4 text-xs"><span>{i.name} × {i.quantity}<small className="block text-muted">{i.color}</small></span><span>${(i.price*i.quantity).toFixed(2)}</span></div>)}</div><div className="mt-6 space-y-3 border-t border-line pt-5 text-xs"><div className="flex justify-between"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div><div className="flex justify-between"><span>Shipping</span><span>{shipping===0?'Free':`$${shipping.toFixed(2)}`}</span></div><div className="flex justify-between border-t border-line pt-4 text-sm font-semibold"><span>Total</span><span>${total.toFixed(2)}</span></div></div></aside></div></main>}



'use client';

import { useState } from 'react';
import { useCart } from '@/components/cart-provider';
import { useAuth } from '@/components/auth-provider';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Checkout() {
  const { items, subtotal } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  const [name, setName] = useState(user?.displayName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [phone, setPhone] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  // Shipping calculation in Nigerian naira
  const shipping = subtotal >= 100000 ? 0 : 12000;
  const total = subtotal + shipping;

  // Format prices in Nigerian naira
  const formatPrice = (price: number) =>
    `₦${price.toLocaleString('en-NG')}`;

  async function pay(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!user) {
      router.push('/login?next=/checkout');
      return;
    }

    setBusy(true);

    try {
      const res = await fetch('/api/paystack/initialize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          name,
          phone,
          address,
          city,
          items,
          total,
          userId: user.uid,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error || 'Unable to start payment.'
        );
      }

      window.location.href = data.authorization_url;
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Payment could not be started.'
      );

      setBusy(false);
    }
  }

  if (items.length === 0) {
    return (
      <main className="container min-h-[65vh] py-20 text-center">
        <span className="eyebrow">Checkout</span>

        <h1 className="display-serif mt-4 text-5xl">
          Your bag is empty.
        </h1>

        <Link href="/collections" className="lux-button mt-8">
          Shop Collections
        </Link>
      </main>
    );
  }

  return (
    <main className="container py-12 md:py-16">
      <div className="mb-10">
        <span className="eyebrow">Secure checkout</span>

        <h1 className="display-serif mt-3 text-5xl">
          Complete your order.
        </h1>
      </div>

      <div className="grid gap-10 lg:grid-cols-[1fr_400px]">
        <form onSubmit={pay} className="space-y-5">
          <div className="border border-line p-6">
            <h2 className="display-serif text-2xl">
              Contact & delivery
            </h2>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <label className="block sm:col-span-2">
                <span className="field-label">Full name</span>

                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="field"
                />
              </label>

              <label className="block">
                <span className="field-label">Email</span>

                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="field"
                />
              </label>

              <label className="block">
                <span className="field-label">Phone</span>

                <input
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="field"
                />
              </label>

              <label className="block sm:col-span-2">
                <span className="field-label">Address</span>

                <input
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="field"
                />
              </label>

              <label className="block">
                <span className="field-label">City</span>

                <input
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="field"
                />
              </label>
            </div>
          </div>

          {error && (
            <p className="border border-red-200 bg-red-50 p-3 text-xs text-red-700">
              {error}
            </p>
          )}

          <button
            disabled={busy || !user}
            className="lux-button w-full disabled:opacity-50"
          >
            {busy
              ? 'Redirecting to payment…'
              : 'Pay securely with Paystack'}
          </button>

          {!user && (
            <p className="text-center text-xs text-muted">
              Please{' '}
              <Link
                href="/login?next=/checkout"
                className="underline"
              >
                sign in
              </Link>{' '}
              before checkout.
            </p>
          )}
        </form>

        <aside className="h-fit border border-line bg-cream p-6">
          <h2 className="display-serif text-2xl">
            Order summary
          </h2>

          <div className="mt-5 space-y-4">
            {items.map((i) => (
              <div
                key={`${i.productId}-${i.color}`}
                className="flex justify-between gap-4 text-xs"
              >
                <span>
                  {i.name} × {i.quantity}

                  <small className="block text-muted">
                    {i.color}
                  </small>
                </span>

                <span>
                  {formatPrice(i.price * i.quantity)}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-6 space-y-3 border-t border-line pt-5 text-xs">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>

            <div className="flex justify-between">
              <span>Shipping</span>

              <span>
                {shipping === 0
                  ? 'Free'
                  : formatPrice(shipping)}
              </span>
            </div>

            <div className="flex justify-between border-t border-line pt-4 text-sm font-semibold">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
