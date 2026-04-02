import Link from 'next/link';
import { Product } from '@/types';

export default function ProductCard({ product }: { product: Product }) {
  const imageUrl = product.images?.[0]
    ? product.images[0].startsWith('http')
      ? product.images[0]
      : `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}${product.images[0]}`
    : '';

  const compareAtPrice = Math.round(product.wholesalePrice * 1.2);
  const discountPercent = Math.max(
    0,
    Math.min(99, Math.round(((compareAtPrice - product.wholesalePrice) / compareAtPrice) * 100))
  );

  return (
    <div className="bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-md transition-shadow duration-200">
      <div className="relative p-4">
        <div className="relative h-40 sm:h-44 bg-white">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={product.title}
              className="w-full h-full object-contain"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">No Image</div>
          )}
        </div>

        <div className="absolute left-4 top-4 flex flex-col gap-1">
          {discountPercent > 0 && (
            <span className="inline-flex items-center justify-center h-5 px-2 rounded-md bg-[#2bbef9] text-white text-[10px] font-bold">
              {discountPercent}%
            </span>
          )}
          {product.featured && (
            <span className="inline-flex items-center justify-center h-5 px-2 rounded-md bg-gray-800 text-white text-[10px] font-bold">
              RECOMMENDED
            </span>
          )}
        </div>
      </div>

      <div className="px-4 pb-4">
        <Link href={`/shop/${product._id}`} className="block">
          <h3 className="text-[13px] font-semibold text-gray-800 leading-snug line-clamp-2 min-h-[2.25rem]">
            {product.title}
          </h3>
        </Link>

        <div className="mt-2 text-[10px] font-semibold tracking-wide text-green-600">
          {product.stock > 0 ? 'IN STOCK' : 'OUT OF STOCK'}
        </div>

        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-xs text-gray-400 line-through">
            ₹{compareAtPrice.toLocaleString('en-IN')}
          </span>
          <span className="text-sm font-extrabold text-[#d51243]">
            ₹{product.wholesalePrice.toLocaleString('en-IN')}
          </span>
        </div>

        <div className="mt-3">
          <Link
            href={`/shop/${product._id}`}
            className="inline-flex items-center justify-center w-full h-10 rounded-lg border border-gray-200 text-sm font-semibold text-[#233a95] hover:bg-gray-50 transition"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}
