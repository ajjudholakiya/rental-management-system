'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { rentalOrderService } from '../../../../services/rentalOrderService';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await rentalOrderService.getAll();
        setOrders(data || []);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch rental orders');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Rental Orders</h1>
      </div>

      {loading ? (
        <div className="py-12 text-center text-gray-500">Loading orders...</div>
      ) : error ? (
        <div className="py-12 text-center text-red-500">{error}</div>
      ) : orders.length === 0 ? (
        <div className="py-12 text-center text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
          No rental orders found. Confirm your quotations to begin!
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="py-3 px-4 text-sm font-semibold text-gray-600">
                  Order ID
                </th>
                <th className="py-3 px-4 text-sm font-semibold text-gray-600">
                  Quotation ID
                </th>
                <th className="py-3 px-4 text-sm font-semibold text-gray-600">
                  Status
                </th>
                <th className="py-3 px-4 text-sm font-semibold text-gray-600">
                  Total Amount
                </th>
                <th className="py-3 px-4 text-sm font-semibold text-gray-600">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr
                  key={o.id}
                  className="border-b border-gray-50 hover:bg-gray-50 transition"
                >
                  <td className="py-4 px-4 text-sm text-gray-900 font-medium">
                    #{o.id}
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-600">
                    #{o.quotationId}
                  </td>
                  <td className="py-4 px-4 text-sm">
                    <span
                      className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold capitalize ${
                        o.status === 'completed'
                          ? 'bg-indigo-100 text-indigo-800'
                          : o.status === 'confirmed'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {o.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-600">
                    ${Number(o.totalAmount).toFixed(2)}
                  </td>
                  <td className="py-4 px-4 text-sm">
                    <Link
                      href={`/orders/${o.id}`}
                      className="text-indigo-600 hover:text-indigo-800 font-semibold"
                    >
                      View Order &rarr;
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
