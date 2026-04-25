'use client';

import { useParams } from 'next/navigation';

export default function PaymentGatewayPage() {
  const { invoiceId } = useParams();

  return (
    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 max-w-2xl mx-auto mt-12 text-center">
      <h1 className="text-2xl font-semibold text-gray-900 mb-4">
        Payment Gateway
      </h1>
      <p className="text-gray-500">
        Processing payment for Invoice ID: {invoiceId}
      </p>
    </div>
  );
}
