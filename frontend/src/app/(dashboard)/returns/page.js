'use client';

import { useEffect, useState } from 'react';
import axiosInstance from '../../../../lib/axios';
import Link from 'next/link';

export default function ReturnsPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axiosInstance.get(
          '/rental-orders/get-my-rental-orders'
        );
        // Filter out only active confirmed orders that require returning
        const activeOrders = res.data.filter(
          (order) => order.status === 'confirmed'
        );
        setOrders(activeOrders);
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
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Active Rentals for Return
      </h1>

      {loading ? (
        <div className="py-12 text-center text-gray-500">Loading orders...</div>
      ) : error ? (
        <div className="py-12 text-center text-red-500">{error}</div>
      ) : orders.length === 0 ? (
        <div className="py-12 text-center text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
          No data found
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
                  Status
                </th>
                <th className="py-3 px-4 text-sm font-semibold text-gray-600">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-gray-50 hover:bg-gray-50 transition"
                >
                  <td className="py-4 px-4 text-sm text-gray-900 font-medium">
                    #{order.id}
                  </td>
                  <td className="py-4 px-4 text-sm">
                    <span className="inline-flex px-3 py-1 rounded-full text-sm font-semibold capitalize bg-blue-100 text-blue-800">
                      {order.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-sm">
                    <Link
                      href={`/orders/${order.id}`}
                      className="text-indigo-600 hover:text-indigo-800 font-semibold"
                    >
                      Return Product &rarr;
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
