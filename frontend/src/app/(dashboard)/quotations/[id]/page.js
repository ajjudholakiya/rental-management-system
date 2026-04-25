'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { quotationService } from '../../../../../services/quotationService';
import { rentalOrderService } from '../../../../../services/rentalOrderService';
import Link from 'next/link';

export default function QuotationDetailsPage() {
  const params = useParams();
  const id = params?.id;
  const router = useRouter();

  const [quotation, setQuotation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchQuote = async () => {
      try {
        const data = await quotationService.getById(id);
        // data could be directly the quotation or nested
        setQuotation(data.quotation || data);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load quotation');
      } finally {
        setLoading(false);
      }
    };
    fetchQuote();
  }, [id]);

  const handleConfirm = async () => {
    setConfirming(true);
    try {
      const order = await rentalOrderService.createOrder(id);
      router.push(`/orders/${order.id}`);
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to confirm quotation');
      setConfirming(false);
    }
  };

  const handleUpdateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      await quotationService.updateItem(id, itemId, newQuantity);

      const data = await quotationService.getById(id);
      setQuotation(data.quotation || data);
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to update quantity');
    }
  };

  if (loading) return <div className="p-8">Loading quotation...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;
  if (!quotation) return <div className="p-8">Quotation not found</div>;

  return (
    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between mb-8 pb-6 border-b">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Quotation #{quotation.id}
          </h1>
          <p className="text-gray-500">
            {quotation.notes || 'No notes provided'}
          </p>
        </div>
        <div className="mt-4 md:mt-0 text-right">
          <span
            className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold capitalize ${
              quotation.status === 'draft'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-green-100 text-green-800'
            }`}
          >
            {quotation.status}
          </span>
          <div className="text-sm text-gray-400 mt-2">
            Created: {new Date(quotation.createdAt).toLocaleDateString()}
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">
          Requested Items
        </h2>
        {quotation.items && quotation.items.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left bg-gray-50 rounded-lg overflow-hidden">
              <thead className="bg-gray-100 text-gray-600">
                <tr>
                  <th className="px-4 py-3 font-medium text-sm">Product ID</th>
                  <th className="px-4 py-3 font-medium text-sm">Dates</th>
                  <th className="px-4 py-3 font-medium text-sm">Quantity</th>
                  <th className="px-4 py-3 font-medium text-sm text-right">
                    Total Price
                  </th>
                </tr>
              </thead>
              <tbody>
                {quotation.items.map((item) => (
                  <tr key={item.id} className="border-t border-gray-200">
                    <td className="px-4 py-3 text-sm text-gray-800">
                      {item.productId}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {new Date(item.startDate).toLocaleDateString()} &rarr;{' '}
                      {new Date(item.endDate).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-800">
                      {quotation.status === 'draft' ? (
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() =>
                              handleUpdateQuantity(item.id, item.quantity - 1)
                            }
                            disabled={item.quantity <= 1}
                            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold w-6 h-6 rounded flex items-center justify-center transition disabled:opacity-50"
                          >
                            &minus;
                          </button>
                          <span className="font-medium w-4 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              handleUpdateQuantity(item.id, item.quantity + 1)
                            }
                            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold w-6 h-6 rounded flex items-center justify-center transition"
                          >
                            +
                          </button>
                        </div>
                      ) : (
                        item.quantity
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold text-gray-800 text-right">
                      ${Number(item.price).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 italic">No items attached.</p>
        )}
      </div>

      <div className="flex items-center justify-between pt-6 border-t">
        <Link
          href="/quotations"
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          &larr; Back to Quotations
        </Link>
        {quotation.status === 'draft' &&
          quotation.items &&
          quotation.items.length > 0 && (
            <button
              onClick={handleConfirm}
              disabled={confirming}
              className="bg-blue-600 text-white px-8 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-700 transition disabled:opacity-50"
            >
              {confirming ? 'Creating Order...' : 'Confirm Order'}
            </button>
          )}
      </div>
    </div>
  );
}
