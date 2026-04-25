'use client';

import { useContext } from 'react';
import { AuthContext } from '../../../../context/AuthContext';
import Link from 'next/link';

export default function ProfilePage() {
  const { user } = useContext(AuthContext);

  return (
    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">
        User Profile
      </h1>

      <div className="space-y-4">
        <div>
          <label className="text-sm text-gray-500">Name</label>
          <p className="text-lg text-gray-800 font-medium">
            {user?.name || '---'}
          </p>
        </div>
        <div>
          <label className="text-sm text-gray-500">Email Document</label>
          <p className="text-lg text-gray-800 font-medium">
            {user?.email || '---'}
          </p>
        </div>
        <div>
          <label className="text-sm text-gray-500">Account Role</label>
          <p className="text-lg text-gray-800 font-medium capitalize">
            {user?.role || '---'}
          </p>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-gray-100 flex gap-4">
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition">
          Edit Profile
        </button>
        <Link
          href="/change-password"
          className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition"
        >
          Change Password
        </Link>
      </div>
    </div>
  );
}
