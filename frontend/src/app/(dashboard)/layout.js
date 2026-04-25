'use client';

import Link from 'next/link';
import { useContext, useEffect } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import { usePathname, useRouter } from 'next/navigation';

export default function DashboardLayout({ children }) {
  const { user, logoutAuth } = useContext(AuthContext);
  const pathname = usePathname();
  const router = useRouter();

  // If user is not yet loaded or doesn't exist, avoid rendering UI to prevent hydration mismatch before redirect
  if (!user) return null;

  const isVendor = user.role === 'vendor';

  // --- Navbar Navigation ---
  const navbarLinks = isVendor
    ? [
        { name: 'Dashboard', href: '/vendor/products' },
        { name: 'Products', href: '/vendor/products' },
        { name: 'Add Product', href: '/vendor/add-product' },
        { name: 'Profile', href: '/profile' }
      ]
    : [
        { name: 'Dashboard', href: '/products' },
        { name: 'Products', href: '/products' },
        { name: 'Quotations', href: '/quotations' },
        { name: 'Orders', href: '/orders' },
        { name: 'Invoices', href: '/invoices' },
        { name: 'Profile', href: '/profile' }
      ];

  // --- Sidebar Navigation ---
  const sidebarLinks = isVendor
    ? [
        { name: 'Products', href: '/vendor/products' },
        { name: 'Add Product', href: '/vendor/add-product' },
        // Dummy placeholder path for pricing, typically a list component or nested
        { name: 'Pricing', href: '/vendor/pricing' }
      ]
    : [
        { name: 'Products', href: '/products' },
        { name: 'Quotations', href: '/quotations' },
        { name: 'Orders', href: '/orders' },
        { name: 'Invoices', href: '/invoices' },
        { name: 'Payments', href: '/payments' },
        { name: 'Returns', href: '/returns' }
      ];

  // Restrict access
  useEffect(() => {
    const isVendorPath = pathname.startsWith('/vendor');
    const isCustomerExclusivePath =
      pathname.startsWith('/quotations') ||
      pathname.startsWith('/orders') ||
      pathname.startsWith('/invoices') ||
      pathname.startsWith('/payments') ||
      pathname.startsWith('/returns');

    if (isVendor && (isCustomerExclusivePath || pathname === '/products')) {
      router.push('/vendor/products');
    }

    if (!isVendor && isVendorPath) {
      router.push('/products');
    }
  }, [isVendor, pathname, router]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Top Navbar */}
      <header className="bg-white shadow-sm border-b border-gray-100 z-10">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <h1 className="text-xl font-bold text-gray-800">RentalApp</h1>
              <nav className="hidden md:flex space-x-6">
                {navbarLinks.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-gray-600 hover:text-blue-600 text-sm font-medium transition-colors"
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>

            <div className="flex items-center space-x-4">
              <div className="hidden md:flex flex-col text-right">
                <span className="text-sm font-bold text-gray-800">
                  {user?.name}
                </span>
                <span className="text-xs text-gray-500 capitalize">
                  {user?.role}
                </span>
              </div>
              <div className="w-10 h-10 bg-blue-600 text-white flex items-center justify-center rounded-full font-bold">
                {user?.name?.[0]?.toUpperCase() || 'U'}
              </div>
              <button
                onClick={logoutAuth}
                className="ml-4 text-sm font-medium text-red-600 hover:text-red-700 transition-colors hidden md:block"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Body with Sidebar */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-lg hidden md:flex flex-col border-r border-gray-100 overflow-y-auto">
          <div className="p-4 border-b border-gray-100">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Module Navigation
            </p>
          </div>
          <nav className="flex-1 mt-4">
            {sidebarLinks.map((item) => {
              const isActive =
                pathname === item.href ||
                (pathname.startsWith(item.href) && item.href !== '/products');
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-6 py-3 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 border-r-4 border-blue-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Mobile Logout fallback hidden normally but visible on smaller screens if sidebar exists */}
          <div className="p-4 border-t border-gray-200 block md:hidden">
            <button
              onClick={logoutAuth}
              className="w-full bg-red-50 text-red-600 py-2 rounded-md hover:bg-red-100 transition-colors"
            >
              Logout
            </button>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
