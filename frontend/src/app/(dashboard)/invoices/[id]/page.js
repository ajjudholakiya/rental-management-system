'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { invoiceService } from '../../../../../services/invoiceService';
import { paymentService } from '../../../../../services/paymentService';
import Link from 'next/link';

export default function InvoiceDetailsPage() {
  const params = useParams();
  const id = params?.id;

  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [paying, setPaying] = useState(false);
  const [payAmount, setPayAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('credit_card');

  const fetchInvoice = async () => {
    try {
      const data = await invoiceService.getById(id);
      setInvoice(data.invoice || data);
      const remaining =
        Number(data.invoice?.totalAmount || data.totalAmount) -
        Number(data.invoice?.paidAmount || data.paidAmount);
      if (remaining > 0) setPayAmount(remaining.toString());
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load invoice');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!id) return;
    fetchInvoice();
  }, [id]);

  const handlePayment = async () => {
    setPaying(true);
    try {
      await paymentService.payInvoice(id, {
        amount: Number(payAmount),
        paymentMethod
      });
      // Re-fetch invoice details to update balance and status in the UI natively
      await fetchInvoice();
      alert('Payment successful!');
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to process payment');
    } finally {
      setPaying(false);
    }
  };

  if (loading) return <div className="p-8">Loading invoice...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;
  if (!invoice) return <div className="p-8">Invoice not found</div>;

  const total = Number(invoice.totalAmount);
  const paid = Number(invoice.paidAmount);
  const remaining = total - paid;
  const isFullyPaid = invoice.status === 'paid';

  return (
    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 max-w-3xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between mb-8 pb-6 border-b">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Invoice {invoice.invoiceNumber || `#${invoice.id}`}
          </h1>
          <p className="text-gray-500">
            Rental Order Ref: #{invoice.rentalOrderId}
          </p>
        </div>
        <div className="mt-4 md:mt-0 text-right">
          <span
            className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold capitalize ${
              isFullyPaid
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {invoice.status.replace('_', ' ')}
          </span>
          <div className="text-sm text-gray-400 mt-2">
            Issued: {new Date(invoice.createdAt).toLocaleDateString()}
          </div>
        </div>
      </div>

      <div className="mb-8 grid grid-cols-2 gap-4">
        <div className="bg-gray-50 p-6 rounded-lg text-center">
          <span className="block text-gray-500 text-sm font-semibold">
            Total Amount
          </span>
          <span className="block text-2xl font-bold text-gray-900">
            ${total.toFixed(2)}
          </span>
        </div>
        <div className="bg-gray-50 p-6 rounded-lg text-center">
          <span className="block text-gray-500 text-sm font-semibold">
            Balance Due
          </span>
          <span className="block text-2xl font-bold text-red-600">
            ${remaining.toFixed(2)}
          </span>
        </div>
      </div>

      {!isFullyPaid && (
        <div className="mb-8 p-6 bg-blue-50/50 rounded-xl border border-blue-100">
          <h2 className="text-lg font-semibold mb-4 text-blue-900">
            Make a Payment
          </h2>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Amount to Pay
              </label>
              <input
                type="number"
                max={remaining}
                min="0.01"
                step="0.01"
                value={payAmount}
                onChange={(e) => setPayAmount(e.target.value)}
                className="block w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:border-blue-500 text-sm"
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Method
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="block w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:border-blue-500 text-sm bg-white"
              >
                <option value="credit_card">Credit Card</option>
                <option value="paypal">PayPal</option>
                <option value="bank_transfer">Bank Transfer</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={handlePayment}
                disabled={
                  paying ||
                  Number(payAmount) <= 0 ||
                  Number(payAmount) > remaining
                }
                className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition disabled:opacity-50 h-[38px]"
              >
                {paying ? 'Processing...' : 'Pay Now'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between pt-6 border-t">
        <Link
          href="/invoices"
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          &larr; Back to Invoices
        </Link>
        <Link
          href={`/orders/${invoice.rentalOrderId}`}
          className="text-gray-600 hover:text-gray-800 text-sm font-medium underline"
        >
          View Rental Order
        </Link>
      </div>
    </div>
  );
}
