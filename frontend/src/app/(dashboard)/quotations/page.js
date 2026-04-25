'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { quotationService } from '../../../../services/quotationService';

export default function QuotationsPage() {
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchQuotations = async () => {
      try {
        const data = await quotationService.getAll();
        setQuotations(data || []);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch quotations');
      } finally {
        setLoading(false);
      }
    };
    fetchQuotations();
  }, []);

  return (
    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Quotations</h1>
        <Link
          href="/products"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition"
        >
          New Quotation
        </Link>
      </div>

      {loading ? (
        <div className="py-12 text-center text-gray-500">
          Loading quotations...
        </div>
      ) : error ? (
        <div className="py-12 text-center text-red-500">{error}</div>
      ) : quotations.length === 0 ? (
        <div className="py-12 text-center text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
          No quotations found. Browse products to get started!
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="py-3 px-4 text-sm font-semibold text-gray-600">
                  ID
                </th>
                <th className="py-3 px-4 text-sm font-semibold text-gray-600">
                  Total Price
                </th>
                <th className="py-3 px-4 text-sm font-semibold text-gray-600">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {quotations.map((q) => (
                <tr
                  key={q.id}
                  className="border-b border-gray-50 hover:bg-gray-50 transition"
                >
                  <td className="py-4 px-4 text-sm text-gray-900 font-medium">
                    #{q.id}
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-600">
                    $
                    {(q.items || [])
                      .reduce((sum, item) => sum + Number(item.price || 0), 0)
                      .toFixed(2)}
                  </td>
                  <td className="py-4 px-4 text-sm">
                    <Link
                      href={`/quotations/${q.id}`}
                      className="text-blue-600 hover:text-blue-800 font-semibold"
                    >
                      View Details &rarr;
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
