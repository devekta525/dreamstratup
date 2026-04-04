'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FiCheck,
  FiArrowRight,
  FiPhone,
  FiTool,
  FiDroplet,
  FiHome,
  FiZap,
  FiFileText,
  FiTrendingUp,
  FiPackage,
  FiTruck,
  FiRefreshCw,
  FiPercent,
  FiDollarSign,
  FiChevronLeft,
  FiChevronRight,
} from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import ProductCard from '@/components/common/ProductCard';
import Loader from '@/components/common/Loader';
import { productService } from '@/services/product.service';
import { Product } from '@/types';

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [heroIndex, setHeroIndex] = useState(0);
  const [testimonialIndex, setTestimonialIndex] = useState(0);

  const heroSlides = [
    {
      id: 'hero-1',
      image: '/banner-1.jpeg',
    },
    {
      id: 'hero-2',
      image: '/banner-2.jpeg',
    },
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await productService.getProducts({ featured: 'true', limit: 4 });
        const raw = res.data;
        if (Array.isArray(raw)) setProducts(raw);
        else if (raw?.data && Array.isArray(raw.data)) setProducts(raw.data);
        else if (raw?.data?.products) setProducts(raw.data.products);
        else setProducts([]);
      } catch {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const id = window.setInterval(() => {
      setHeroIndex((i) => (i + 1) % heroSlides.length);
    }, 4500);
    return () => window.clearInterval(id);
  }, [heroSlides.length]);

  const testimonials = [
    {
      quote: '"Great quality products and amazing support! My business started smoothly. The startup kit had everything I needed to open my hardware shop within weeks."',
      name: 'Arun Sharma',
      role: 'Hardware Shop Owner, Jaipur',
      rating: 5,
    },
    {
      quote: '"The wholesale prices allowed me to keep margins high. Their sanitary kit was loaded with premium brands that my customers instantly recognized. Highly recommended!"',
      name: 'Priya Patel',
      role: 'Sanitary Store Owner, Ahmedabad',
      rating: 5,
    },
    {
      quote: '"Getting bulk orders delivered with tracking was a game changer for my electrical business. DreamStartup gives you everything on a platter—just start selling!"',
      name: 'Rahul Verma',
      role: 'Electrician & Vendor, Delhi',
      rating: 4,
    },
    {
      quote: '"I had zero experience in retail, but their dedicated support team patiently guided me. The startup kit was painless, and I was profitable by month two."',
      name: 'Sneha Reddy',
      role: 'Home Decor Boutique, Hyderabad',
      rating: 5,
    },
    {
      quote: '"Joining as a service provider completely changed my life. I now get a steady stream of carpentry jobs directly on my phone. Cannot thank them enough."',
      name: 'Vikram Singh',
      role: 'Master Carpenter, Pune',
      rating: 5,
    },
    {
      quote: '"Fast shipping, reliable inventory, and a brilliant platform. If you want to start a B2B business in India, there is honestly no better place than this."',
      name: 'Anjali Desai',
      role: 'Wholesale Distributor, Surat',
      rating: 4,
    },
  ];

  useEffect(() => {
    if (testimonials.length <= 1) return;
    const id = window.setInterval(() => {
      setTestimonialIndex((i) => (i + 1) % testimonials.length);
    }, 5500);
    return () => window.clearInterval(id);
  }, [testimonials.length]);

  return (
    <div className="min-h-screen bg-[#f5f5f5] dark:bg-gray-900">

      {/* ═══════════════ 1. HERO BANNER ═══════════════ */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          {heroSlides.map((s, idx) => (
            <div
              key={s.id}
              className={[
                'absolute inset-0 transition-opacity duration-700 ease-in-out',
                idx === heroIndex ? 'opacity-100' : 'opacity-0',
              ].join(' ')}
              style={{
                backgroundImage: `url(${s.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/25 to-black/10" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-16 sm:py-24 lg:py-32">
          <div className="flex flex-col lg:flex-row items-center gap-8 min-h-[60vh]">
            <div className="flex-1 w-full text-center lg:text-left mt-20 lg:mt-0">
              <h1 className="text-3xl sm:text-4xl lg:text-6xl font-extrabold text-white leading-tight mb-4 drop-shadow-md">
                <span className="text-orange-400">आपका सपना, हमारा सहयोग</span>
              </h1>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white tracking-wider mb-8 drop-shadow-md">
                APKA SAPNA, HUMARA SAHAYOG!
              </h2>
              <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-4 rounded-xl shadow-lg transition active:scale-95 text-lg"
                >
                  Shop Wholesale
                </Link>
                <Link
                  href="/startup"
                  className="inline-flex items-center gap-2 bg-white hover:bg-gray-100 text-[#1e3a5f] font-bold px-8 py-4 rounded-xl shadow-lg transition active:scale-95 text-lg"
                >
                  Start Your Business
                </Link>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setHeroIndex((i) => (i - 1 + heroSlides.length) % heroSlides.length)}
            className="absolute left-3 top-1/2 -translate-y-1/2 hidden sm:inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/80 hover:bg-white text-gray-800 shadow transition"
            aria-label="Previous banner"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={() => setHeroIndex((i) => (i + 1) % heroSlides.length)}
            className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/80 hover:bg-white text-gray-800 shadow transition"
            aria-label="Next banner"
          >
            ›
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
            {heroSlides.map((s, idx) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setHeroIndex(idx)}
                className={[
                  'h-2 rounded-full transition-all',
                  idx === heroIndex ? 'w-6 bg-white' : 'w-2 bg-white/60 hover:bg-white/80',
                ].join(' ')}
                aria-label={`Go to banner ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ 2. CATEGORY ICONS ROW ═══════════════ */}
      <section className="bg-[#0b0f1a] py-3">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between gap-4 overflow-x-auto">
            {[
              { name: 'Furniture Hardware', icon: FiTool },
              { name: 'Sanitary', icon: FiDroplet },
              { name: 'Home Decor', icon: FiHome },
              { name: 'Electrical', icon: FiZap },
            ].map(({ name, icon: Icon }) => (
              <Link
                key={name}
                href={`/shop?category=${encodeURIComponent(name)}`}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-white/90 hover:text-white transition whitespace-nowrap"
              >
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/10 border border-white/10">
                  <Icon size={16} className="text-orange-400" />
                </span>
                <span className="text-sm font-semibold">{name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: 'Everyday fresh products', icon: FiRefreshCw },
              { label: 'Free delivery for order over $70', icon: FiTruck },
              { label: 'Daily Mega Discounts', icon: FiPercent },
              { label: 'Best price on the market', icon: FiDollarSign },
            ].map(({ label, icon: Icon }, idx) => (
              <div
                key={label}
                className={[
                  'flex items-center gap-3 py-4',
                  idx > 0 ? 'lg:border-l lg:border-gray-200 dark:lg:border-gray-700' : '',
                  idx % 2 === 1 ? 'sm:border-l sm:border-gray-200 dark:sm:border-gray-700 lg:border-l lg:border-gray-200 dark:lg:border-gray-700' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300">
                  <Icon size={16} />
                </span>
                <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ 3. OUR STARTUP SOLUTIONS ═══════════════ */}
      <section className="py-12 sm:py-16">
        <div className="max-w-6xl mx-auto px-4">
          {/* Section heading */}
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-orange-400 text-sm">&laquo;&laquo;&laquo;</span>
              <h2 className="text-2xl sm:text-3xl font-bold">
                <span className="text-[#1e3a5f] dark:text-blue-300">Our Startup </span>
                <span className="text-orange-500">Solutions</span>
              </h2>
              <span className="text-orange-400 text-sm">&raquo;&raquo;&raquo;</span>
            </div>
          </div>

          {/* 3 Kit Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: 'Hardware Business Kit',
                tag: 'WEEKEND DISCOUNT 40%',
                icon: FiTool,
                accent: 'text-orange-500',
                bg: 'from-[#f5f7ff] via-white to-[#eef8ff]',
              },
              {
                title: 'Sanitary Business Kit',
                tag: 'WEEKEND DISCOUNT 40%',
                icon: FiDroplet,
                accent: 'text-[#2bbef9]',
                bg: 'from-[#f2fbff] via-white to-[#fff3f3]',
              },
              {
                title: 'Electrical Business Kit',
                tag: 'WEEKEND DISCOUNT 40%',
                icon: FiZap,
                accent: 'text-orange-500',
                bg: 'from-[#fff6ec] via-white to-[#f2fbff]',
              },
            ].map((kit) => (
              <div
                key={kit.title}
                className="group relative rounded-2xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${kit.bg}`} />
                <div className="absolute inset-0 opacity-[0.035]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'48\' height=\'48\' viewBox=\'0 0 48 48\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23233a95\' fill-opacity=\'1\'%3E%3Cpath d=\'M24 0l4 10 10 4-10 4-4 10-4-10-10-4 10-4z\'/%3E%3C/g%3E%3C/svg%3E")' }} />

                <div className="relative p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-[10px] font-extrabold tracking-[0.14em] text-green-600 uppercase">
                        {kit.tag}
                      </div>
                      <h3 className="mt-2 text-lg font-extrabold text-[#233a95] dark:text-blue-300 leading-snug">
                        {kit.title}
                      </h3>
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Apka sapna, humara sahayog</p>
                    </div>

                    <div className="relative shrink-0">
                      <div className="absolute -inset-6 rounded-full bg-[#2bbef9]/10 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="w-14 h-14 rounded-2xl bg-white/80 border border-white shadow-sm flex items-center justify-center">
                        <kit.icon size={22} className={kit.accent} />
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 space-y-3">
                    {['Products Stock', 'GST & License', 'Marketing Support'].map((service) => (
                      <div key={service} className="flex items-center gap-2.5">
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-500/10">
                          <FiCheck className="text-green-600" size={16} />
                        </span>
                        <span className="text-sm text-gray-700 dark:text-gray-300 font-semibold">{service}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6">
                    <Link
                      href="/startup"
                      className="inline-flex items-center justify-center w-full h-11 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-extrabold transition active:scale-[0.99]"
                    >
                      Get Started
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ 4. HOW IT WORKS ═══════════════ */}
      <section className="py-12 bg-white dark:bg-gray-800">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-2">
              <span className="text-orange-400 text-sm">&laquo;&laquo;&laquo;</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1e3a5f] dark:text-blue-300">How It Works</h2>
              <span className="text-orange-400 text-sm">&raquo;&raquo;&raquo;</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-10 sm:gap-16">
            {[
              { num: '1', title: 'Choose Your Option' },
              { num: '2', title: 'Place Order / Apply' },
              { num: '3', title: 'We Deliver & Setup' },
            ].map((step, i) => (
              <div key={step.num} className="flex items-center gap-5">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-orange-500 text-white flex items-center justify-center text-xl font-extrabold shadow-lg mb-3">
                    {step.num}
                  </div>
                  <p className="text-sm font-extrabold text-[#1e3a5f] dark:text-blue-300">{step.title}</p>
                </div>
                {i < 2 && (
                  <div className="hidden sm:flex items-center justify-center w-12">
                    <FiArrowRight size={22} className="text-orange-500" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ 5. FEATURED PRODUCTS ═══════════════ */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          {loading ? (
            <Loader />
          ) : products.length > 0 ? (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-3">
                  <div className="bg-white dark:bg-gray-800 rounded-2xl border-2 border-[#d51243] overflow-hidden">
                    <div className="p-5">
                      <div className="text-[#233a95] dark:text-blue-300 font-extrabold text-lg">Deals of the week!</div>

                      <div className="mt-3 flex items-center gap-2">
                        {['72', '22', '48', '14'].map((t) => (
                          <div
                            key={t}
                            className="w-10 h-10 rounded-lg bg-[#d51243] text-white flex items-center justify-center font-extrabold text-sm"
                          >
                            {t}
                          </div>
                        ))}
                      </div>

                      <div className="mt-3 text-xs text-gray-400 dark:text-gray-500">Remains until the end of the offer</div>
                    </div>

                    <div className="relative p-6 pt-0">
                      <div className="absolute left-6 top-0 w-14 h-14 rounded-full bg-[#d51243] text-white flex items-center justify-center font-extrabold">
                        19%
                      </div>

                      {products[0]?.images?.[0] ? (
                        <img
                          src={
                            products[0].images[0].startsWith('http')
                              ? products[0].images[0]
                              : `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}${products[0].images[0]}`
                          }
                          alt={products[0].title}
                          className="w-full h-52 object-contain"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-52 flex items-center justify-center text-gray-400 dark:text-gray-500 text-sm">No Image</div>
                      )}

                      <div className="mt-4">
                        <div className="text-xl font-extrabold text-[#d51243]">
                          {products[0].minPrice === products[0].maxPrice
                            ? `₹${products[0].minPrice.toLocaleString('en-IN')}`
                            : `₹${products[0].minPrice.toLocaleString('en-IN')}–${products[0].maxPrice.toLocaleString('en-IN')}`}
                        </div>
                        <div className="mt-2 text-[13px] font-semibold text-gray-800 dark:text-gray-200 line-clamp-2">{products[0].title}</div>
                        <div className="mt-1 text-[10px] font-semibold tracking-wide text-green-600">
                          {products[0].stock > 0 ? 'IN STOCK' : 'OUT OF STOCK'}
                        </div>
                      </div>

                      <div className="mt-4">
                        <Link
                          href={`/shop/${products[0]._id}`}
                          className="inline-flex items-center justify-center w-full h-10 rounded-lg bg-[#2bbef9] hover:bg-[#1fb2e8] text-white font-bold text-sm transition"
                        >
                          Shop Now <FiArrowRight size={16} />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-9">
                  <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
                      {products.slice(0, 8).map((product, idx) => (
                        <div
                          key={product._id}
                          className={[
                            'p-3 sm:p-4',
                            idx % 2 === 1 ? 'border-l border-gray-100 dark:border-gray-700' : '',
                            idx >= 2 ? 'border-t border-gray-100 dark:border-gray-700' : '',
                            idx >= 3 && 'sm:border-t-0',
                            idx >= 3 && 'sm:border-t sm:border-gray-100 dark:sm:border-gray-700',
                          ]
                            .filter(Boolean)
                            .join(' ')}
                        >
                          <ProductCard product={product} />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="text-center mt-8">
                    <Link
                      href="/shop"
                      className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-3 rounded-lg shadow-md transition"
                    >
                      View All Products <FiArrowRight size={18} />
                    </Link>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <p>Products coming soon. Check back later!</p>
            </div>
          )}
        </div>
      </section>

      {/* ═══════════════ 6. SERVICE PROVIDERS / JOIN SECTION ═══════════════ */}
      <section className="relative bg-[#1e3a5f] py-14 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.12]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'56\' height=\'56\' viewBox=\'0 0 56 56\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.22\'%3E%3Cpath d=\'M0 28L28 0l28 28-28 28z\'/%3E%3C/g%3E%3C/svg%3E")' }} />
        <div className="relative max-w-6xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-4 mb-8">
            <span className="hidden sm:inline-block h-px w-14 bg-white/25" />
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Featured <span className="text-orange-400">Wholesale Products</span>
            </h2>
            <span className="hidden sm:inline-block h-px w-14 bg-white/25" />
          </div>

          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {[
              { name: 'Carpenter', icon: FiTool },
              { name: 'Electrician', icon: FiZap },
              { name: 'Plumber', icon: FiDroplet },
            ].map(({ name, icon: Icon }) => (
              <button
                type="button"
                key={name}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/20 bg-white/10 hover:bg-white/15 text-white text-sm font-semibold transition backdrop-blur-sm"
              >
                <Icon size={16} className="text-orange-400" />
                {name}
              </button>
            ))}
          </div>

          <Link
            href="/providers"
            className="inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-extrabold px-10 py-3 rounded-xl shadow-lg transition active:scale-[0.99]"
          >
            Join & Earn Now <FiArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* ═══════════════ 7. CUSTOMER TESTIMONIALS ═══════════════ */}
      <section className="py-12 sm:py-16 bg-white dark:bg-gray-800 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <div className="text-[11px] font-extrabold tracking-[0.28em] text-[#2bbef9] uppercase">Customer Stories</div>
            <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-gray-100">Trusted by Thousands</h2>
            <div className="mt-3 flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-0.5 text-orange-400">
                {'★★★★★'.split('').map((s, i) => (
                  <span key={i}>{s}</span>
                ))}
              </div>
              <span className="font-semibold text-gray-700 dark:text-gray-300">3.8/5</span>
              <span>from 50 reviews</span>
            </div>
          </div>

          <div className="relative">
            <div className="flex items-stretch gap-5 transition-transform duration-500" style={{ transform: `translateX(-${testimonialIndex * 320}px)` }}>
              {testimonials.map((t, idx) => (
                <div key={idx} className="w-[300px] sm:w-[320px] shrink-0">
                  <div className="h-full bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-sm hover:shadow-md transition-shadow p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-0.5 text-orange-400 text-sm">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span key={i}>{i < t.rating ? '★' : '☆'}</span>
                        ))}
                      </div>
                      <div className="text-[#2bbef9] text-3xl leading-none">&ldquo;</div>
                    </div>

                    <p className="mt-4 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{t.quote}</p>

                    <div className="mt-6 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#233a95] text-white flex items-center justify-center font-extrabold">
                        {t.name
                          .split(' ')
                          .slice(0, 2)
                          .map((p) => p[0])
                          .join('')}
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-extrabold text-gray-900 dark:text-gray-100 truncate">{t.name}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{t.role}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {testimonials.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => setTestimonialIndex((i) => (i - 1 + testimonials.length) % testimonials.length)}
                  className="hidden sm:inline-flex absolute -left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 shadow-sm items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-600 transition"
                  aria-label="Previous testimonials"
                >
                  <FiChevronLeft size={18} className="text-gray-700 dark:text-gray-300" />
                </button>
                <button
                  type="button"
                  onClick={() => setTestimonialIndex((i) => (i + 1) % testimonials.length)}
                  className="hidden sm:inline-flex absolute -right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 shadow-sm items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-600 transition"
                  aria-label="Next testimonials"
                >
                  <FiChevronRight size={18} className="text-gray-700 dark:text-gray-300" />
                </button>

                <div className="mt-6 flex items-center justify-center gap-2">
                  {testimonials.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setTestimonialIndex(idx)}
                      className={[
                        'h-2 rounded-full transition-all',
                        idx === testimonialIndex ? 'w-6 bg-[#233a95]' : 'w-2 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500',
                      ].join(' ')}
                      aria-label={`Go to testimonial ${idx + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ═══════════════ 8. SERVICES ROW (GST, Marketing, Business Setup) ═══════════════ */}
      <section className="py-12 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-7">
            <div className="text-[11px] font-extrabold tracking-[0.28em] text-gray-400 dark:text-gray-500 uppercase">Certified & Verified</div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                icon: FiFileText,
                title: 'GST & Licenses',
                bg: 'bg-blue-50',
                iconBg: 'bg-blue-100',
                iconText: 'text-blue-600',
              },
              {
                icon: FiTrendingUp,
                title: 'Marketing Support',
                bg: 'bg-green-50',
                iconBg: 'bg-green-100',
                iconText: 'text-green-600',
              },
              {
                icon: FiPackage,
                title: 'Business Setup',
                bg: 'bg-orange-50',
                iconBg: 'bg-orange-100',
                iconText: 'text-orange-600',
              },
            ].map(({ icon: Icon, title, bg, iconBg, iconText }) => (
              <Link
                key={title}
                href="/startup"
                className={`group flex items-center gap-4 rounded-2xl border border-gray-100 dark:border-gray-700 ${bg} dark:bg-gray-900 p-5 hover:shadow-md transition`}
              >
                <span className={`inline-flex items-center justify-center w-12 h-12 rounded-2xl ${iconBg} ${iconText}`}
                >
                  <Icon size={20} />
                </span>
                <div className="min-w-0">
                  <div className="text-sm font-extrabold text-gray-900 dark:text-gray-100 truncate">{title}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 truncate">Good Manufacturing Practice</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
