'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import axiosInstance from '../../../../../../lib/axios';
import { productService } from '../../../../../../services/productService';
import Link from 'next/link';

export default function ProductPricingPage() {
  const { id } = useParams();
  const router = useRouter();

  const [product, setProduct] = useState(null);
  const [formData, setFormData] = useState({
    pricePerHour: '',
    pricePerDay: '',
    pricePerWeek: ''
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await productService.getById(id);
        const fetchedProduct = data.product || data;
        setProduct(fetchedProduct);

        // Populate if pricing already exists (pricing might be an array or object depending on relation)
        if (fetchedProduct.pricing) {
          const currentPricing = Array.isArray(fetchedProduct.pricing)
            ? fetchedProduct.pricing[0]
            : fetchedProduct.pricing;
          if (currentPricing) {
            setFormData({
              pricePerHour: currentPricing.pricePerHour || '',
              pricePerDay: currentPricing.pricePerDay || '',
              pricePerWeek: currentPricing.pricePerWeek || ''
            });
          }
        }
      } catch (err) {
        setError('Failed to fetch product details.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess(false);

    try {
      // Backend route: router.post('/set-product-price/:id/pricing', ...)
      await axiosInstance.post(
        `/products/set-product-price/${id}/pricing`,
        formData
      );
      setSuccess(true);
      // Automatically redirect back to products after a short delay
      setTimeout(() => {
        router.push('/vendor/products');
      }, 1500);
    } catch (err) {
      setError(
        err.response?.data?.error || 'Failed to update pricing strategy.'
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return <div className="animate-pulse p-8">Loading pricing data...</div>;

  return (
    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Manage Pricing Strategy
        </h1>
        <p className="text-gray-500 mt-1">
          Configure the rental pricing structures for{' '}
          <strong>{product?.name || `Product ID: ${id}`}</strong>
        </p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 p-4 border border-red-200 rounded text-red-600 text-sm font-medium">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 bg-green-50 p-4 border border-green-200 rounded text-green-700 text-sm font-medium">
          Pricing successfully saved! Redirecting...
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Price Per Hour ($)
            </label>
            <input
              type="number"
              name="pricePerHour"
              min="0"
              step="0.01"
              value={formData.pricePerHour}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Price Per Day ($)
            </label>
            <input
              type="number"
              name="pricePerDay"
              min="0"
              step="0.01"
              value={formData.pricePerDay}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Price Per Week ($)
            </label>
            <input
              type="number"
              name="pricePerWeek"
              min="0"
              step="0.01"
              value={formData.pricePerWeek}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-4 pt-4 border-t border-gray-100">
          <Link
            href="/vendor/products"
            className="py-2 px-4 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="py-2 px-4 text-sm font-medium text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700 disabled:opacity-70 transition-colors"
          >
            {saving ? 'Saving...' : 'Save Pricing Strategy'}
          </button>
        </div>
      </form>
    </div>
  );
}
