import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { path: '/search', label: 'Search' },
  { path: '/cart', label: 'Cart' },
  { path: '/checkout', label: 'Checkout' },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-6">
          <Link to="/search" className="text-xl font-bold text-blue-600">
            E-commerce Automation
          </Link>
          <div className="flex gap-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-1 rounded ${
                  location.pathname === item.path
                    ? 'bg-blue-100 text-blue-700 font-medium'
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>
      <main className="max-w-5xl mx-auto px-4 py-6">{children}</main>
    </div>
  );
}
