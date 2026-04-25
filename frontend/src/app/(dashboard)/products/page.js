'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { productService } from '../../../../services/productService';

export default function ProductsPage() {
  const router = useRouter();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productService.getAll();
        setProducts(data.products || data || []);
      } catch (err) {
        setError('Failed to load products.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // 🔄 Loading
  if (loading) {
    return (
      <div className="text-gray-500 animate-pulse">Loading products...</div>
    );
  }

  // ❌ Error
  if (error) {
    return (
      <div className="text-red-500 bg-red-50 p-4 border rounded">{error}</div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 🔹 Title */}
      <h1 className="text-2xl font-semibold text-gray-900">All Products</h1>

      {/* 📭 Empty */}
      {products.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-xl shadow-sm border border-gray-100">
          <p className="text-gray-500">No products available.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left">
            {/* 🔹 Header */}
            <thead className="bg-gray-50 text-gray-600 text-sm">
              <tr>
                <th className="p-4">Product Name</th>
                <th className="p-4">Price / Day</th>
                <th className="p-4">Quantity</th>
                <th className="p-4">Total / Day</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>

            {/* 🔹 Body */}
            <tbody>
              {products.map((product) => {
                const price = product.pricing?.pricePerDay || 0;
                const quantity = product.quantity ?? 1;
                const total = price * quantity;

                return (
                  <tr
                    key={product.id}
                    onClick={() => router.push(`/products/${product.id}`)}
                    className="hover:bg-gray-50 transition cursor-pointer"
                  >
                    {/* Name */}
                    <td className="p-4 font-medium text-gray-900">
                      {product.name}
                    </td>

                    {/* Price */}
                    <td className="p-4">{price ? `$${price}` : 'Not Set'}</td>

                    {/* Quantity */}
                    <td className="p-4">{quantity}</td>

                    {/* Total */}
                    <td className="p-4 font-semibold text-gray-900">
                      ${total}
                    </td>

                    {/* Status */}
                    <td className="p-4">
                      <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
                        {product.status || 'available'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
