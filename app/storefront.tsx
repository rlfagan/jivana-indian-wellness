"use client";

import Image from "next/image";
import { FormEvent, useMemo, useState } from "react";

const products = [
  { name: "Sooth", native: "Dry ginger · Sonth", note: "Warming & digestive", price: 12, size: "100 g", tone: "ginger", monogram: "S" },
  { name: "Pepramul", native: "Ganthoda root powder", note: "Sharp & invigorating", price: 14, size: "100 g", tone: "root", monogram: "P" },
  { name: "Ajma", native: "Carom seeds · Ajwain", note: "Aromatic & soothing", price: 10, size: "125 g", tone: "seed", monogram: "A" },
  { name: "Variyali", native: "Fennel seeds · Saunf", note: "Cooling & fragrant", price: 9, size: "150 g", tone: "fennel", monogram: "V" },
];

export function Storefront() {
  const [query, setQuery] = useState("");
  const [cart, setCart] = useState<string[]>([]);
  const [menu, setMenu] = useState(false);
  const [message, setMessage] = useState("");
  const filtered = useMemo(() => products.filter((p) => `${p.name} ${p.native} ${p.note}`.toLowerCase().includes(query.toLowerCase())), [query]);

  async function subscribe(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setMessage("Saving…");
    const response = await fetch("/api/subscribe", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ email: form.get("email") }) });
    const data = await response.json();
    setMessage(response.ok ? "You’re on the list — welcome in." : data.error || "Please try again.");
    if (response.ok) event.currentTarget.reset();
  }

  return (
    <main>
      <div className="topbar"><span>Free U.S. shipping on orders $45+</span><span className="topbar-note">Raw botanicals · Small-batch packed</span></div>
      <header className="nav-shell">
        <a className="brand" href="#top" aria-label="Jivana home"><span className="brand-mark">ज</span><span>JIVANA<small>THE INDIAN PANTRY</small></span></a>
        <button className="menu-button" onClick={() => setMenu(!menu)} aria-label="Toggle navigation">{menu ? "Close" : "Menu"}</button>
        <nav className={menu ? "nav-links open" : "nav-links"} aria-label="Main navigation">
          <a href="#shop">Shop</a><a href="#ritual">Kitchen rituals</a><a href="#standards">Our standards</a><a href="#story">Our story</a>
        </nav>
        <div className="nav-actions"><button aria-label="Search products" onClick={() => document.querySelector<HTMLInputElement>("#product-search")?.focus()}>⌕</button><button className="cart-button" aria-label={`${cart.length} items in cart`}>Bag <b>{cart.length}</b></button></div>
      </header>

      <section className="hero" id="top">
        <Image src="/hero-botanicals.jpg" alt="Dry ginger, ganthoda powder and ajwain seeds arranged in bowls and amber jars" fill priority sizes="100vw" />
        <div className="hero-shade" />
        <div className="hero-copy"><p className="eyebrow">HOLISTIC HERITAGE · DAILY RITUAL</p><h1>Wisdom,<br/><em>within reach.</em></h1><p>Time-tested Indian botanicals, meticulously sourced and ready for your modern kitchen.</p><a className="primary-button" href="#shop">Explore the pantry <span>→</span></a></div>
        <div className="hero-proof"><span>01</span><p><b>Nothing hidden.</b><br/>100% natural · unadulterated</p></div>
      </section>

      <section className="intro" id="story"><p className="kicker">OLD WISDOM. CLEAR SOURCING.</p><h2>Your kitchen is already<br/>a place of <em>wellness.</em></h2><p>We bring the deeply practical ingredients of India’s holistic food traditions into everyday reach—raw, honest and selected with care.</p></section>

      <section className="shop" id="shop">
        <div className="section-heading"><div><p className="kicker">THE ESSENTIALS</p><h2>Begin with the staples.</h2></div><label className="search"><span>⌕</span><input id="product-search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search the pantry" aria-label="Search products" /></label></div>
        <div className="product-grid">
          {filtered.map((product) => <article className="product-card" key={product.name}>
            <div className={`product-visual ${product.tone}`}><span className="benefit">{product.note}</span><div className="jar"><span className="jar-label"><i>JIVANA</i><b>{product.monogram}</b><small>{product.name}</small></span></div></div>
            <div className="product-info"><div><h3>{product.name}</h3><p>{product.native}</p></div><span>${product.price}</span></div>
            <div className="product-meta"><span>{product.size}</span><button onClick={() => setCart([...cart, product.name])}>Add to bag <span>＋</span></button></div>
          </article>)}
        </div>
        {filtered.length === 0 && <p className="empty">No pantry staples match “{query}”. Try ginger, ajwain or fennel.</p>}
      </section>

      <section className="ritual" id="ritual"><div className="ritual-number">03</div><div className="ritual-copy"><p className="kicker">THE DAILY PRACTICE</p><h2>Make room for<br/><em>a small ritual.</em></h2><p>Start with a pinch. Add Sooth to warm water after a meal, bloom Ajma in ghee, or finish dinner with fragrant Variyali. Generational wisdom fits into ordinary moments.</p><a href="#shop">Find your ingredient →</a></div><div className="ritual-cards"><div className="ritual-card"><span>MORNING</span><b>Warm water<br/>+ Sooth</b><small>Gently stirring · 2 minutes</small></div><div className="ritual-card second"><span>AFTER MEALS</span><b>Ajma<br/>+ a pinch of salt</b><small>Chew slowly · as desired</small></div></div></section>

      <section className="standards" id="standards"><p className="kicker">THE JIVANA STANDARD</p><h2>Less intervention.<br/><em>More integrity.</em></h2><div className="standards-grid"><div><b>01</b><h3>Single-origin focus</h3><p>Chosen from growing regions known for each botanical.</p></div><div><b>02</b><h3>Nothing unnecessary</h3><p>No fillers, dyes, artificial flavor or mystery blends.</p></div><div><b>03</b><h3>Freshness protected</h3><p>Small batches, light-resistant jars and careful packing.</p></div></div><p className="disclaimer">Our foods are part of culinary tradition and are not intended to diagnose, treat, cure, or prevent disease.</p></section>

      <section className="newsletter"><div><p className="kicker">LETTERS FROM THE PANTRY</p><h2>Seasonal rituals,<br/>ingredient by ingredient.</h2></div><form onSubmit={subscribe}><label htmlFor="email">Email address</label><div><input id="email" name="email" type="email" required placeholder="you@example.com"/><button type="submit">Join the list →</button></div><p aria-live="polite">{message || "One thoughtful note each month. No clutter."}</p></form></section>
      <footer><a className="brand footer-brand" href="#top"><span className="brand-mark">ज</span><span>JIVANA<small>THE INDIAN PANTRY</small></span></a><p>Authentic Indian wellness,<br/>at home in your kitchen.</p><div><a href="#shop">Shop</a><a href="#standards">Standards</a><a href="#story">Story</a></div><small>© 2026 Jivana Pantry · Educational site concept</small></footer>
    </main>
  );
}
