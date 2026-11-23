// import Image from "next/image";import Link from "next/link";import {Truck,Sparkles,ShieldCheck} from "lucide-react";import {bestSellers,collections} from "@/lib/data";import {CollectionCard} from "@/components/collection-card";import {ProductCard} from "@/components/product-card";import {Newsletter} from "@/components/newsletter";
// export default function Home(){return <main><section id="new" className="container"><div className="grid min-h-[650px] overflow-hidden bg-[#eee4d8] md:grid-cols-[43%_57%]"><div className="flex flex-col justify-center px-7 py-14 sm:px-12 md:px-[72px]"><span className="eyebrow mb-5">New Season</span><h1 className="display-serif text-[58px] leading-[.94] tracking-[-.035em] sm:text-7xl md:text-[82px]">Timeless<br/>Elegance</h1><p className="mt-6 max-w-[380px] text-sm leading-7 text-[#554f49]">Discover handbags that blend luxury, craftsmanship and modern sophistication. Designed to become part of your everyday story.</p><Link href="/collections" className="lux-button mt-8 w-fit">Shop Now</Link></div><div className="relative min-h-[420px] md:min-h-0"><Image src="/images/hero/luxora-hero.jpg" alt="Luxury brown handbag" fill priority sizes="57vw" className="object-cover"/></div></div></section><div className="container border-b border-line"><div className="grid divide-y divide-line py-2 md:grid-cols-3 md:divide-x md:divide-y-0">{[[<Truck size={20}/>, "Free Shipping","On all orders over $100"],[<Sparkles size={20}/>, "Premium Quality","Finest materials & craftsmanship"],[<ShieldCheck size={20}/>, "Secure Payments","100% secure checkout"]].map(([i,t,d],n)=><div key={n} className="flex items-center gap-3 px-2 py-4 md:justify-center"><span className="grid h-8 w-8 place-items-center rounded-full border border-[#aaa196]">{i}</span><span><strong className="block text-[10px] uppercase tracking-[.09em]">{t}</strong><small className="text-[10px] text-muted">{d}</small></span></div>)}</div></div><section className="container py-20 md:py-24"><div className="mb-9 text-center"><h2 className="display-serif text-4xl">Shop By Collection</h2><p className="mt-2 text-xs text-muted">Find the silhouette that fits your story.</p></div><div className="grid grid-cols-2 gap-2.5 lg:grid-cols-4">{collections.slice(0,4).map(c=><CollectionCard key={c.slug} collection={c}/>)}</div></section><section id="bestsellers" className="container pb-20 md:pb-24"><div className="mb-7 flex items-end justify-between"><div><span className="eyebrow">Curated for you</span><h2 className="display-serif mt-2 text-4xl">Best Sellers</h2></div><Link href="/collections" className="hidden text-[10px] uppercase tracking-[.14em] sm:block">View All</Link></div><div className="grid grid-cols-2 gap-x-3 gap-y-6 lg:grid-cols-4">{bestSellers.map(p=><ProductCard key={p.id} product={p}/>)}</div></section><section id="story" className="bg-cream"><div className="grid min-h-[540px] md:grid-cols-2"><div className="relative min-h-[420px]"><Image src="/images/hero/luxora-story.jpg" alt="Woman carrying a handbag" fill sizes="50vw" className="object-cover"/></div><div className="flex flex-col justify-center px-7 py-14 sm:px-12 md:px-20"><span className="eyebrow">The LUXORA Story</span><h2 className="display-serif mt-5 text-4xl leading-tight sm:text-5xl">Designed to live beautifully.</h2><p className="mt-5 max-w-[470px] text-[13px] leading-7 text-[#5f5953]">We believe a handbag should be more than an accessory. It should carry your essentials, complement your style and stay with you for years.</p><Link href="/about" className="lux-button mt-6 w-fit">Our Story</Link></div></div></section><section className="container py-20 text-center md:py-24"><span className="eyebrow">The LUXORA Woman</span><p className="display-serif mx-auto mt-5 max-w-3xl text-2xl leading-relaxed sm:text-3xl">“The kind of bag you reach for every morning — polished enough for the city, effortless enough for every day.”</p><span className="mt-5 block text-[10px] uppercase tracking-[.14em] text-muted">LUXORA Editorial</span></section><Newsletter/></main>}




import Image from "next/image";
import Link from "next/link";
import { Truck, Sparkles, ShieldCheck } from "lucide-react";
import { bestSellers, collections } from "@/lib/data";
import { CollectionCard } from "@/components/collection-card";
import { ProductCard } from "@/components/product-card";
import { Newsletter } from "@/components/newsletter";

export default function Home() {
  return (
    <main>
      <section id="new" className="container">
        <div className="grid min-h-[650px] overflow-hidden bg-[#eee4d8] md:grid-cols-[43%_57%]">
          <div className="flex flex-col justify-center px-7 py-14 sm:px-12 md:px-[72px]">
            <span className="eyebrow mb-5">New Season</span>
            <h1 className="display-serif text-[58px] leading-[.94] tracking-[-.035em] sm:text-7xl md:text-[82px]">
              Timeless
              <br />
              Elegance
            </h1>
            <p className="mt-6 max-w-[380px] text-sm leading-7 text-[#554f49]">
              Discover handbags that blend luxury, craftsmanship and modern
              sophistication. Designed to become part of your everyday story.
            </p>
            <Link href="/collections" className="lux-button mt-8 w-fit">
              Shop Now
            </Link>
          </div>

          <div className="relative min-h-[420px] md:min-h-0">
            <Image
              src="/images/hero/luxora-hero.jpg"
              alt="Luxury brown handbag"
              fill
              priority
              sizes="57vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <div className="container border-b border-line">
        <div className="grid divide-y divide-line py-2 md:grid-cols-3 md:divide-x md:divide-y-0">
          {[
            [<Truck key="truck" size={20} />, "Free Shipping", "On all orders over $100"],
            [
              <Sparkles key="sparkles" size={20} />,
              "Premium Quality",
              "Finest materials & craftsmanship",
            ],
            [
              <ShieldCheck key="shield" size={20} />,
              "Secure Payments",
              "100% secure checkout",
            ],
          ].map(([icon, title, description], index) => (
            <div
              key={index}
              className="flex items-center gap-3 px-2 py-4 md:justify-center"
            >
              <span className="grid h-8 w-8 place-items-center rounded-full border border-[#aaa196]">
                {icon}
              </span>
              <span>
                <strong className="block text-[10px] uppercase tracking-[.09em]">
                  {title}
                </strong>
                <small className="text-[10px] text-muted">
                  {description}
                </small>
              </span>
            </div>
          ))}
        </div>
      </div>

      <section className="container py-20 md:py-24">
        <div className="mb-9 text-center">
          <h2 className="display-serif text-4xl">Shop By Collection</h2>
          <p className="mt-2 text-xs text-muted">
            Find the silhouette that fits your story.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-4">
          {collections.slice(0, 4).map((collection) => (
            <CollectionCard key={collection.slug} collection={collection} />
          ))}
        </div>
      </section>

      <section id="bestsellers" className="container pb-20 md:pb-24">
        <div className="mb-7 flex items-end justify-between">
          <div>
            <span className="eyebrow">Curated for you</span>
            <h2 className="display-serif mt-2 text-4xl">Best Sellers</h2>
          </div>
          <Link
            href="/collections"
            className="hidden text-[10px] uppercase tracking-[.14em] sm:block"
          >
            View All
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-x-3 gap-y-6 lg:grid-cols-4">
          {bestSellers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section id="story" className="bg-cream">
        <div className="grid min-h-[540px] md:grid-cols-2">
          <div className="relative min-h-[420px]">
            <Image
              src="/images/hero/luxora-story.jpg"
              alt="Woman carrying a handbag"
              fill
              sizes="50vw"
              className="object-cover"
            />
          </div>

          <div className="flex flex-col justify-center px-7 py-14 sm:px-12 md:px-20">
            <span className="eyebrow">The LUXORA Story</span>
            <h2 className="display-serif mt-5 text-4xl leading-tight sm:text-5xl">
              Designed to live beautifully.
            </h2>
            <p className="mt-5 max-w-[470px] text-[13px] leading-7 text-[#5f5953]">
              We believe a handbag should be more than an accessory. It should
              carry your essentials, complement your style and stay with you
              for years.
            </p>
            <Link href="/about" className="lux-button mt-6 w-fit">
              Our Story
            </Link>
          </div>
        </div>
      </section>

      <section className="container py-20 text-center md:py-24">
        <span className="eyebrow">The LUXORA Woman</span>
        <p className="display-serif mx-auto mt-5 max-w-3xl text-2xl leading-relaxed sm:text-3xl">
          “The kind of bag you reach for every morning — polished enough for
          the city, effortless enough for every day.”
        </p>
        <span className="mt-5 block text-[10px] uppercase tracking-[.14em] text-muted">
          LUXORA Editorial
        </span>
      </section>

      <Newsletter />
    </main>
  );
}
