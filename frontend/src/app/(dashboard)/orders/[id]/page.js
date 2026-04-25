'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { rentalOrderService } from '../../../../../services/rentalOrderService';
import { invoiceService } from '../../../../../services/invoiceService';
import { returnService } from '../../../../../services/returnService';
import Link from 'next/link';

export default function OrderDetailsPage() {
  const params = useParams();
  const id = params?.id;
  const router = useRouter();

  const [order, setOrder] = useState(null);
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [creatingInvoice, setCreatingInvoice] = useState(false);

  const fetchOrder = async () => {
    try {
      const data = await rentalOrderService.getById(id);
      setOrder(data.order || data);

      const invoices = await invoiceService.getAll();
      const matched = invoices.find(
        (inv) => Number(inv.rentalOrderId) === Number(id)
      );
      setInvoice(matched || null);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load rental order');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!id) return;
    fetchOrder();
  }, [id]);

  const handleCreateInvoice = async () => {
    setCreatingInvoice(true);
    try {
      const invoice = await invoiceService.createInvoice(id);
      router.push(`/invoices/${invoice.id}`);
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to create invoice');
    } finally {
      setCreatingInvoice(false);
    }
  };

  if (loading) return <div className="p-8">Loading order details...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;
  if (!order) return <div className="p-8">Order not found</div>;

  return (
    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between mb-8 pb-6 border-b">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Rental Order #{order.id}
          </h1>
          <p className="text-gray-500">Quotation Ref: #{order.quotationId}</p>
        </div>
        <div className="mt-4 md:mt-0 text-right">
          <span
            className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold capitalize ${
              order.status === 'completed'
                ? 'bg-indigo-100 text-indigo-800'
                : order.status === 'confirmed'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-gray-100 text-gray-800'
            }`}
          >
            {order.status}
          </span>
          <div className="text-xl font-bold text-gray-900 mt-2">
            Total: ${Number(order.totalAmount).toFixed(2)}
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">
          Tracking Information
        </h2>
        <div className="bg-gray-50 p-6 rounded-lg text-sm text-gray-700">
          <p className="mb-2">
            <span className="font-medium text-gray-900">Order Placed:</span>{' '}
            {new Date(order.createdAt).toLocaleString()}
          </p>
          <p>
            <span className="font-medium text-gray-900">Customer ID:</span>{' '}
            {order.customerId}
          </p>
        </div>
      </div>

      {invoice && invoice.status !== 'paid' && order.status !== 'completed' && (
        <div className="mb-8 p-6 bg-yellow-50/50 rounded-xl border border-yellow-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold mb-1 text-yellow-900">
              Payment Required
            </h2>
            <p className="text-sm text-yellow-700">
              An invoice has been generated for this rental. Please complete the
              payment to unlock the next phase.
            </p>
          </div>
          <Link
            href={`/payments/${invoice.id}`}
            className="bg-yellow-600 text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-yellow-700 transition shadow-sm"
          >
            Pay Now
          </Link>
        </div>
      )}

      {invoice && invoice.status === 'paid' && order.status !== 'completed' && (
        <div className="mb-8 p-6 bg-red-50/50 rounded-xl border border-red-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold mb-1 text-red-900">
              Process Return
            </h2>
            <p className="text-sm text-red-700">
              Payment is fully resolved. Redirecting to dedicated Return
              terminal.
            </p>
          </div>
          <Link
            href={`/returns/${order.id}`}
            className="bg-red-600 text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-red-700 transition"
          >
            Return Product
          </Link>
        </div>
      )}

      <div className="flex items-center justify-between pt-6 border-t">
        <Link
          href="/orders"
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          &larr; Back to Dashboard
        </Link>

        {order.status === 'confirmed' && !invoice && (
          <button
            onClick={handleCreateInvoice}
            disabled={creatingInvoice}
            className="bg-indigo-600 text-white px-8 py-2.5 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {creatingInvoice ? 'Generating Invoice...' : 'Generate Invoice'}
          </button>
        )}
      </div>
    </div>
  );
}
