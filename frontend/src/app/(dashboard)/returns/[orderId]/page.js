'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import axios from '../../../../../lib/axios';

export default function ReturnProcessPage() {
  const { orderId } = useParams();
  const router = useRouter();

  const [lateFee, setLateFee] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReturn = async () => {
    try {
      setLoading(true);

      await axios.post(`/returns/create-return/${orderId}`, {
        lateFee: Number(lateFee) || 0
      });

      alert('Product returned successfully');

      // Redirect to orders
      router.push('/orders');
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.error || 'Return failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 max-w-xl mx-auto">
      <h1 className="text-2xl font-semibold text-gray-900 mb-4">
        Process Return
      </h1>

      <p className="text-gray-500 mb-6">Order ID: {orderId}</p>

      <input
        type="number"
        placeholder="Late Fee (optional)"
        value={lateFee}
        onChange={(e) => setLateFee(e.target.value)}
        className="w-full border p-3 rounded mb-4"
      />

      <button
        onClick={handleReturn}
        disabled={loading}
        className="bg-red-600 text-white px-4 py-2 rounded w-full"
      >
        {loading ? 'Processing...' : 'Return Product'}
      </button>
    </div>
  );
}
