'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { invoiceService } from '../../../../services/invoiceService';

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const data = await invoiceService.getAll();
        setInvoices(data || []);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch invoices');
      } finally {
        setLoading(false);
      }
    };
    fetchInvoices();
  }, []);

  return (
    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Invoices</h1>
      </div>

      {loading ? (
        <div className="py-12 text-center text-gray-500">
          Loading invoices...
        </div>
      ) : error ? (
        <div className="py-12 text-center text-red-500">{error}</div>
      ) : invoices.length === 0 ? (
        <div className="py-12 text-center text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
          No invoices found. Generate an invoice from your active rental orders!
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="py-3 px-4 text-sm font-semibold text-gray-600">
                  Invoice ID
                </th>
                <th className="py-3 px-4 text-sm font-semibold text-gray-600">
                  Order ID
                </th>
                <th className="py-3 px-4 text-sm font-semibold text-gray-600">
                  Total
                </th>
                <th className="py-3 px-4 text-sm font-semibold text-gray-600">
                  Paid
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
              {invoices.map((inv) => (
                <tr
                  key={inv.id}
                  className="border-b border-gray-50 hover:bg-gray-50 transition"
                >
                  <td className="py-4 px-4 text-sm text-gray-900 font-medium">
                    #{inv.id}
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-600">
                    #{inv.rentalOrderId}
                  </td>
                  <td className="py-4 px-4 text-sm font-semibold text-gray-900">
                    ${Number(inv.totalAmount).toFixed(2)}
                  </td>
                  <td className="py-4 px-4 text-sm text-green-600">
                    ${Number(inv.paidAmount).toFixed(2)}
                  </td>
                  <td className="py-4 px-4 text-sm">
                    <span
                      className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold capitalize ${
                        inv.status === 'paid'
                          ? 'bg-green-100 text-green-800'
                          : inv.status === 'partially_paid'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {inv.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-sm">
                    <Link
                      href={`/invoices/${inv.id}`}
                      className="text-blue-600 hover:text-blue-800 font-semibold"
                    >
                      View & Pay &rarr;
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
