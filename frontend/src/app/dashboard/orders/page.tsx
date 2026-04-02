'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiPackage, FiChevronDown, FiChevronUp, FiArrowLeft } from 'react-icons/fi';
import Link from 'next/link';

import { useAuth } from '@/context/AuthContext';
import { orderService } from '@/services/order.service';
import StatusBadge from '@/components/common/StatusBadge';
import Loader from '@/components/common/Loader';
import { Order } from '@/types';

// ─── Order Row (expandable) ───────────────────────────────────────────────────

function OrderRow({ order }: { order: Order }) {
  const [expanded, setExpanded] = useState(false);
  const { shippingAddress: addr } = order;

  return (
    <>
      {/* Summary row */}
      <tr
        className="cursor-pointer transition hover:bg-gray-50"
        onClick={() => setExpanded((prev) => !prev)}
      >
        <td className="whitespace-nowrap px-5 py-4 text-sm font-semibold text-[#1e3a5f]">
          #{order.orderNumber}
        </td>
        <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-500">
          {new Date(order.createdAt).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          })}
        </td>
        <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-600">
          {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
        </td>
        <td className="whitespace-nowrap px-5 py-4 text-sm font-semibold text-gray-800">
          ₹{order.totalAmount.toLocaleString('en-IN')}
        </td>
        <td className="whitespace-nowrap px-5 py-4">
          <StatusBadge status={order.orderStatus} />
        </td>
        <td className="whitespace-nowrap px-5 py-4">
          <StatusBadge status={order.paymentStatus} />
        </td>
        <td className="whitespace-nowrap px-5 py-4 text-right">
          {expanded ? (
            <FiChevronUp size={16} className="ml-auto text-gray-400" />
          ) : (
            <FiChevronDown size={16} className="ml-auto text-gray-400" />
          )}
        </td>
      </tr>

      {/* Expanded detail row */}
      {expanded && (
        <tr className="bg-blue-50/40">
          <td colSpan={7} className="px-5 py-5">
            <div className="grid gap-6 sm:grid-cols-2">
              {/* Items */}
              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Order Items
                </p>
                <div className="space-y-3">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.title}
                          className="h-12 w-12 flex-shrink-0 rounded-lg border border-gray-200 object-cover"
                        />
                      ) : (
                        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-gray-100">
                          <FiPackage size={18} className="text-gray-400" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="truncate text-sm font-medium text-gray-800">
                          {item.title}
                        </p>
                        <p className="text-xs text-gray-500">
                          Qty: {item.quantity} &times; ₹
                          {item.price.toLocaleString('en-IN')}
                        </p>
                      </div>
                      <p className="whitespace-nowrap text-sm font-semibold text-gray-700">
                        ₹{(item.quantity * item.price).toLocaleString('en-IN')}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping address */}
              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Shipping Address
                </p>
                <div className="rounded-xl border border-gray-200 bg-white p-4 text-sm text-gray-700 space-y-1">
                  <p>{addr.address}</p>
                  <p>
                    {addr.city}, {addr.state} — {addr.pincode}
                  </p>
                  <p className="text-gray-500">Phone: {addr.phone}</p>
                </div>

                {order.notes && (
                  <div className="mt-4">
                    <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Notes
                    </p>
                    <p className="rounded-xl border border-gray-200 bg-white p-3 text-sm text-gray-600 italic">
                      {order.notes}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function MyOrdersPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/login');
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    if (!user) return;

    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await orderService.getMyOrders();
        const raw = res.data;
        let list: Order[] = [];
        if (Array.isArray(raw)) list = raw;
        else if (Array.isArray(raw?.data)) list = raw.data;
        else if (Array.isArray(raw?.data?.orders)) list = raw.data.orders;
        // Newest first
        list.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setOrders(list);
      } catch {
        setError('Unable to load orders. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="bg-gradient-to-br from-[#1e3a5f] to-[#2d5a8e] px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Link
            href="/dashboard"
            className="mb-3 inline-flex items-center gap-1.5 text-sm text-blue-200 hover:text-white"
          >
            <FiArrowLeft size={14} /> Back to Dashboard
          </Link>
          <h1 className="text-3xl font-extrabold text-white">My Orders</h1>
          <p className="mt-1 text-blue-300">
            Track and manage all your wholesale orders.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {loading && <Loader />}

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-6 py-6 text-center text-red-600 text-sm">
            {error}
          </div>
        )}

        {!loading && !error && orders.length === 0 && (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-20 text-center">
            <FiPackage size={48} className="mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-semibold text-gray-600">
              You have no orders yet
            </p>
            <p className="mt-1 text-sm text-gray-400">
              Browse our wholesale catalogue and place your first order.
            </p>
            <Link
              href="/shop"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-7 py-3 text-sm font-semibold text-white shadow-md shadow-orange-200 transition hover:bg-orange-600"
            >
              Shop Now
            </Link>
          </div>
        )}

        {!loading && !error && orders.length > 0 && (
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-100">
                <thead className="bg-gray-50">
                  <tr>
                    {[
                      'Order #',
                      'Date',
                      'Items',
                      'Total',
                      'Order Status',
                      'Payment',
                      '',
                    ].map((h) => (
                      <th
                        key={h}
                        className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 last:text-right"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {orders.map((order) => (
                    <OrderRow key={order._id} order={order} />
                  ))}
                </tbody>
              </table>
            </div>

            <div className="border-t border-gray-100 bg-gray-50 px-5 py-3 text-right text-xs text-gray-400">
              {orders.length} order{orders.length !== 1 ? 's' : ''} total
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
