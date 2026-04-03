'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import {
  FiArrowLeft,
  FiShoppingCart,
  FiMail,
  FiPackage,
  FiTag,
  FiLayers,
  FiAlertCircle,
  FiCheckCircle,
  FiMinus,
  FiPlus,
} from 'react-icons/fi';
import { productService } from '@/services/product.service';
import { cartService } from '@/services/cart.service';
import { useCart } from '@/context/CartContext';
import Loader from '@/components/common/Loader';
import { Product, BulkPricingTier } from '@/types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') ?? '';

function resolveImage(src: string): string {
  if (!src) return '';
  return src.startsWith('http') ? src : `${API_BASE}${src}`;
}

export default function ProductDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { refreshCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await productService.getProduct(id);
        const data: Product = res.data?.data ?? res.data;
        if (!data?._id) {
          setNotFound(true);
        } else {
          setProduct(data);
          setQuantity(data.moq ?? 1);
        }
      } catch (err: unknown) {
        const status = (err as { response?: { status?: number } })?.response?.status;
        if (status === 404) {
          setNotFound(true);
        } else {
          toast.error('Failed to load product. Please try again.');
          setNotFound(true);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const decrementQty = () => {
    setQuantity((prev) => Math.max(product?.moq ?? 1, prev - 1));
  };

  const incrementQty = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleAddToCart = async () => {
    if (!product) return;
    setAddingToCart(true);
    try {
      await cartService.addToCart(product._id, quantity);
      await refreshCart();
      toast.success(`${product.title} added to cart!`);
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      if (message?.toLowerCase().includes('login') || message?.toLowerCase().includes('auth')) {
        toast.error('Please login to add items to your cart.');
        router.push('/login');
      } else {
        toast.error(message ?? 'Failed to add to cart. Please try again.');
      }
    } finally {
      setAddingToCart(false);
    }
  };

  // Determine price for current quantity from bulk tiers
  const effectivePrice = (): number => {
    if (!product) return 0;
    if (!product.bulkPricingTiers || product.bulkPricingTiers.length === 0) {
      return product.wholesalePrice;
    }
    const sorted = [...product.bulkPricingTiers].sort((a, b) => b.minQty - a.minQty);
    const tier = sorted.find((t) => quantity >= t.minQty);
    return tier ? tier.price : product.wholesalePrice;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Loader />
      </div>
    );
  }

  if (notFound || !product) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center px-4 text-center">
        <div className="w-20 h-20 bg-red-50 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-5">
          <FiAlertCircle size={36} className="text-red-400" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">Product Not Found</h1>
        <p className="text-gray-500 dark:text-gray-300 mb-6 max-w-sm">
          The product you are looking for does not exist or may have been removed.
        </p>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 bg-[#1e3a5f] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#162d4a] transition"
        >
          <FiArrowLeft size={18} />
          Back to Shop
        </Link>
      </div>
    );
  }

  const images = product.images?.length ? product.images : [];
  const hasImages = images.length > 0;
  const hasBulkTiers =
    product.bulkPricingTiers && product.bulkPricingTiers.length > 0;
  const hasSpecs =
    product.specifications && Object.keys(product.specifications).length > 0;
  const inStock = product.stock > 0;
  const price = effectivePrice();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Breadcrumb */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-300">
            <Link href="/" className="hover:text-[#1e3a5f] transition">
              Home
            </Link>
            <span>/</span>
            <Link href="/shop" className="hover:text-[#1e3a5f] transition">
              Shop
            </Link>
            <span>/</span>
            <Link
              href={`/shop?category=${encodeURIComponent(product.category)}`}
              className="hover:text-[#1e3a5f] transition"
            >
              {product.category}
            </Link>
            <span>/</span>
            <span className="text-[#1e3a5f] font-medium line-clamp-1 max-w-[200px]">
              {product.title}
            </span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-300 hover:text-[#1e3a5f] mb-6 transition"
        >
          <FiArrowLeft size={16} />
          Back
        </button>

        {/* Main Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          {/* ─── Image Gallery ─── */}
          <div className="space-y-3">
            {/* Main Image */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden aspect-square flex items-center justify-center">
              {hasImages ? (
                <img
                  src={resolveImage(images[activeImage])}
                  alt={product.title}
                  className="w-full h-full object-contain p-4"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-gray-300 gap-3 p-8">
                  <FiPackage size={64} />
                  <span className="text-sm">No image available</span>
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`flex-shrink-0 w-16 h-16 rounded-xl border-2 overflow-hidden transition ${
                      activeImage === idx
                        ? 'border-orange-500 shadow-md'
                        : 'border-gray-200 dark:border-gray-600 hover:border-orange-300'
                    }`}
                  >
                    <img
                      src={resolveImage(img)}
                      alt={`${product.title} view ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ─── Product Info ─── */}
          <div className="space-y-5">
            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              {product.featured && (
                <span className="bg-orange-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                  Featured
                </span>
              )}
              <span
                className={`flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full ${
                  inStock
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-600'
                }`}
              >
                {inStock ? (
                  <>
                    <FiCheckCircle size={12} /> In Stock ({product.stock} units)
                  </>
                ) : (
                  <>
                    <FiAlertCircle size={12} /> Out of Stock
                  </>
                )}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white leading-tight">
              {product.title}
            </h1>

            {/* Category & Brand */}
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-300">
                <FiTag size={14} className="text-orange-500" />
                <span className="font-medium">Category:</span>
                <Link
                  href={`/shop?category=${encodeURIComponent(product.category)}`}
                  className="text-orange-500 hover:text-orange-700 transition"
                >
                  {product.category}
                </Link>
              </div>
              {product.brand && (
                <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-300">
                  <FiLayers size={14} className="text-orange-500" />
                  <span className="font-medium">Brand:</span>
                  <span className="text-gray-800 dark:text-gray-100">{product.brand}</span>
                </div>
              )}
            </div>

            {/* Wholesale Price */}
            <div className="bg-[#1e3a5f]/5 dark:bg-[#1e3a5f]/20 rounded-xl p-4 border border-[#1e3a5f]/10 dark:border-[#1e3a5f]/30">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                Wholesale Price
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-extrabold text-[#1e3a5f]">
                  ₹{price.toLocaleString('en-IN')}
                </span>
                <span className="text-gray-500 dark:text-gray-400 text-sm">/ unit</span>
                {hasBulkTiers && price < product.wholesalePrice && (
                  <span className="text-xs text-green-600 font-semibold bg-green-50 px-2 py-0.5 rounded-full">
                    Bulk discount applied
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Base price: ₹{product.wholesalePrice.toLocaleString('en-IN')} / unit
              </p>
            </div>

            {/* MOQ */}
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 bg-orange-50 dark:bg-orange-900/20 px-4 py-2.5 rounded-lg border border-orange-100 dark:border-orange-800/30">
              <FiPackage size={16} className="text-orange-500 flex-shrink-0" />
              <span>
                <span className="font-semibold text-gray-800 dark:text-gray-100">Minimum Order Quantity:</span>{' '}
                <span className="text-orange-600 dark:text-orange-400 font-bold">{product.moq} units</span>
              </span>
            </div>

            {/* Description */}
            {product.description && (
              <div>
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1.5">Description</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                  {product.description}
                </p>
              </div>
            )}

            {/* Quantity Selector */}
            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-200 block mb-2">
                Quantity
              </label>
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-gray-200 dark:border-gray-600 rounded-xl overflow-hidden bg-white dark:bg-gray-800 shadow-sm">
                  <button
                    onClick={decrementQty}
                    disabled={quantity <= (product.moq ?? 1)}
                    className="px-4 py-3 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
                  >
                    <FiMinus size={16} />
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    min={product.moq ?? 1}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10);
                      if (!isNaN(val) && val >= (product.moq ?? 1)) {
                        setQuantity(val);
                      }
                    }}
                    className="w-16 text-center text-base font-semibold text-gray-800 dark:text-gray-100 dark:bg-gray-800 border-0 focus:outline-none py-3"
                  />
                  <button
                    onClick={incrementQty}
                    className="px-4 py-3 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                  >
                    <FiPlus size={16} />
                  </button>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-300">
                  Total:{' '}
                  <span className="font-bold text-[#1e3a5f]">
                    ₹{(price * quantity).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
              {quantity < (product.moq ?? 1) && (
                <p className="text-xs text-red-500 mt-1.5">
                  Minimum order quantity is {product.moq} units.
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-1">
              <button
                onClick={handleAddToCart}
                disabled={addingToCart || !inStock}
                className="flex-1 flex items-center justify-center gap-2 bg-[#1e3a5f] hover:bg-[#162d4a] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3.5 px-6 rounded-xl transition text-sm"
              >
                {addingToCart ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <FiShoppingCart size={18} />
                )}
                {addingToCart ? 'Adding...' : 'Add to Cart'}
              </button>

              <Link
                href={`/contact?product=${encodeURIComponent(product.title)}&productId=${product._id}`}
                className="flex-1 flex items-center justify-center gap-2 border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white font-semibold py-3.5 px-6 rounded-xl transition text-sm"
              >
                <FiMail size={18} />
                Send Enquiry
              </Link>
            </div>

            {!inStock && (
              <p className="text-sm text-red-500 flex items-center gap-1.5">
                <FiAlertCircle size={14} />
                This product is currently out of stock. You may still send an enquiry.
              </p>
            )}
          </div>
        </div>

        {/* ─── Bulk Pricing Tiers ─── */}
        {hasBulkTiers && (
          <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 mb-6">
            <h2 className="text-lg font-bold text-[#1e3a5f] dark:text-blue-300 mb-4 flex items-center gap-2">
              <FiLayers className="text-orange-500" size={20} />
              Bulk Pricing
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-300 rounded-l-lg">
                      Quantity Range
                    </th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-300">
                      Price per Unit
                    </th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-300 rounded-r-lg">
                      Savings
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                  {[...product.bulkPricingTiers]
                    .sort((a: BulkPricingTier, b: BulkPricingTier) => a.minQty - b.minQty)
                    .map((tier: BulkPricingTier, idx: number) => {
                      const savings = product.wholesalePrice - tier.price;
                      const isActive = quantity >= tier.minQty &&
                        (tier.maxQty === undefined || quantity <= tier.maxQty);
                      return (
                        <tr
                          key={idx}
                          className={`transition ${
                            isActive ? 'bg-orange-50 dark:bg-orange-900/20' : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                          }`}
                        >
                          <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-100">
                            {tier.minQty}
                            {tier.maxQty ? `–${tier.maxQty}` : '+'} units
                            {isActive && (
                              <span className="ml-2 text-xs bg-orange-500 text-white px-2 py-0.5 rounded-full">
                                Current
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3 font-bold text-[#1e3a5f] dark:text-blue-300">
                            ₹{tier.price.toLocaleString('en-IN')}
                          </td>
                          <td className="px-4 py-3">
                            {savings > 0 ? (
                              <span className="text-green-600 font-semibold">
                                Save ₹{savings.toLocaleString('en-IN')} / unit
                              </span>
                            ) : (
                              <span className="text-gray-400">—</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* ─── Specifications ─── */}
        {hasSpecs && (
          <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 mb-6">
            <h2 className="text-lg font-bold text-[#1e3a5f] dark:text-blue-300 mb-4 flex items-center gap-2">
              <FiTag className="text-orange-500" size={20} />
              Specifications
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                  {Object.entries(product.specifications!).map(([key, value]) => (
                    <tr key={key} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                      <td className="py-3 px-4 font-semibold text-gray-700 dark:text-gray-200 w-1/3 capitalize bg-gray-50/60 dark:bg-gray-700/60">
                        {key.replace(/_/g, ' ')}
                      </td>
                      <td className="py-3 px-4 text-gray-600 dark:text-gray-300">{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* ─── CTA Banner ─── */}
        <div className="bg-gradient-to-r from-[#1e3a5f] to-[#264d7a] rounded-2xl p-6 sm:p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold mb-1">Need a custom quote or bulk deal?</h3>
            <p className="text-blue-200 text-sm">
              Contact our team for special pricing on large orders.
            </p>
          </div>
          <Link
            href={`/contact?product=${encodeURIComponent(product.title)}&productId=${product._id}`}
            className="flex-shrink-0 flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-xl transition text-sm whitespace-nowrap"
          >
            <FiMail size={16} />
            Send Enquiry
          </Link>
        </div>
      </div>
    </div>
  );
}
