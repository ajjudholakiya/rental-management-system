'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { quotationService } from '../../../../../services/quotationService';
import { productService } from '../../../../../services/productService';
import { reservationService } from '../../../../../services/reservationService';
import Link from 'next/link';

export default function ProductDetailPage() {
  const params = useParams();
  const id = params?.id;
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [renting, setRenting] = useState(false);

  const [startDate, setStartDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [endDate, setEndDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (!id) return;
    const fetchProduct = async () => {
      try {
        const data = await productService.getById(id);
        setProduct(data.product || data || null);
      } catch (err) {
        setError(
          err.response?.data?.error ||
            err.message ||
            JSON.stringify(err) ||
            'Failed to load product details.'
        );
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleRent = async () => {
    if (!startDate || !endDate) {
      setError('Please select both start and end dates.');
      return;
    }
    if (new Date(endDate) <= new Date(startDate)) {
      setError('End date must be after start date.');
      return;
    }
    if (quantity < 1) {
      setError('Quantity must be at least 1.');
      return;
    }

    setRenting(true);
    setError('');

    try {
      const isAvailable = await reservationService.checkAvailability(
        product.id || product._id,
        new Date(startDate).toISOString(),
        new Date(endDate).toISOString()
      );

      if (!isAvailable?.available) {
        setError(
          'Product is not available for selected dates. Please choose different dates.'
        );
        setRenting(false);
        return;
      }

      const quote = await quotationService.createQuotation({
        notes: `Reservation for ${product.name}`
      });

      await quotationService.addItem(quote.id, {
        productId: product.id || product._id,
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
        quantity: parseInt(quantity, 10)
      });

      router.push(`/quotations/${quote.id}`);
    } catch (err) {
      setError(
        err.response?.data?.error || 'Failed to initialize rent process.'
      );
      setRenting(false);
    }
  };

  if (loading) {
    return (
      <div className="text-gray-500 animate-pulse mt-8 flex justify-center">
        Loading details...
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="bg-red-50 p-4 border border-red-200 rounded max-w-lg mx-auto mt-8">
        <p className="text-red-600">{error || 'Product not found'}</p>
        <button
          onClick={() => router.push('/products')}
          className="mt-4 text-blue-600 hover:underline"
        >
          Return to Products
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden text-gray-900 mt-8">
      {/* Content Layout */}
      <div className="p-8">
        <div className="flex justify-between items-start mb-6 border-b border-gray-100 pb-6">
          <div className="space-y-1">
            <h1 className="text-[28px] font-bold text-[#111827] leading-none">
              {product.name}
            </h1>
            <p className="text-[14px] text-gray-500">
              ID: {product.id || product._id || id}
            </p>
          </div>

          <div className="flex flex-col items-end">
            <div className="text-2xl font-bold text-gray-900 mb-1.5 flex items-start">
              <span className="text-xl">$</span>
              <span>
                {product.pricing?.pricePerDay
                  ? product.pricing.pricePerDay
                  : '-'}
              </span>
              <span className="text-sm font-medium text-gray-500 self-end ml-1 mb-1">
                / day
              </span>
            </div>
            <span
              className={`text-[11px] px-3 py-1 font-semibold uppercase tracking-wider rounded-full ${product.status === 'inactive' ? 'bg-red-100 text-red-800' : 'bg-[#D1FAE5] text-[#065F46]'}`}
            >
              {product.status || 'available'}
            </span>
          </div>
        </div>

        <div className="bg-[#F9FAFB] p-5 rounded-lg mb-8">
          <h2 className="text-[13px] font-bold text-gray-500 uppercase tracking-wider mb-2">
            Description
          </h2>
          <p className="text-[14px] text-[#4B5563] leading-relaxed whitespace-pre-wrap">
            {product.description ||
              'No description available for this product.'}
          </p>
        </div>

        <div className="border-t border-gray-100 pt-6">
          <h3 className="text-md font-bold text-gray-900 mb-4">
            Start your Rental
          </h3>

          <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
            <div className="w-full">
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setStartDate(e.target.value)}
                className="block w-full rounded-md border border-gray-300 py-2.5 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            <div className="w-full">
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                min={startDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="block w-full rounded-md border border-gray-300 py-2.5 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            <div className="w-1/3 min-w-[80px]">
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Qty
              </label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="block w-full rounded-md border border-gray-300 py-2.5 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleRent}
              disabled={renting || product.status === 'inactive'}
              className="flex-1 bg-[#2563EB] text-white px-6 py-3 rounded-lg text-sm font-semibold hover:bg-blue-700 transition w-auto inline-flex items-center justify-center disabled:opacity-50"
            >
              {renting ? 'Processing...' : 'Rent Product'}
            </button>

            <Link
              href="/products"
              className="bg-[#F3F4F6] text-[#374151] px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-200 transition"
            >
              Back to List
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
