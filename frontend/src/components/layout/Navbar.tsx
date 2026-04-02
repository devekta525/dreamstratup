'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { FiShoppingCart, FiMenu, FiX, FiHome, FiSearch, FiMoon } from 'react-icons/fi';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cartCount, refreshCart } = useCart();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // Auto-close menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const navLinks = [
    { name: 'Wholesale', path: '/shop' },
    { name: 'Startup Kits', path: '/startup' },
    { name: 'Services', path: '/providers' },
    { name: 'Contact Us', path: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/85 backdrop-blur-xl border-b border-gray-100 shadow-sm transition-all duration-300">
      {/* Decorative gradient line at the top */}
      <div className="h-1 w-full bg-gradient-to-r from-[#1e3a5f] via-[#2bbef9] to-orange-500"></div>
      
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between gap-4 lg:gap-8">
        
        {/* Left: Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
          <div className="w-11 h-11 bg-gradient-to-br from-[#1e3a5f] to-[#2bbef9] rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform duration-300">
            <FiHome size={22} className="text-white" />
          </div>
          <div className="leading-tight hidden md:block">
            <div className="text-xl font-extrabold tracking-tight text-[#1e3a5f]">
              Dream<span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-pink-500">Startup</span>
            </div>
            <div className="text-[9px] font-bold text-gray-400 tracking-widest uppercase">B2B Platform</div>
          </div>
        </Link>

        {/* Center: Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.path || (link.path !== '/' && pathname.startsWith(link.path));
            return (
              <Link 
                key={link.path} 
                href={link.path}
                className={`px-4 py-2.5 rounded-full text-sm font-bold transition-all duration-200 ${
                  isActive 
                    ? 'bg-blue-50 text-blue-600 shadow-sm border border-blue-100/50' 
                    : 'text-gray-500 hover:bg-gray-50 hover:text-[#1e3a5f]'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center gap-3 sm:gap-5 shrink-0 ml-auto lg:ml-0">
          
          {/* Search Bar (Hidden on mobile) */}
          <div className="hidden xl:flex relative group">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={16} />
            <input 
              type="text" 
              placeholder="Search..." 
              className="w-[200px] h-10 pl-11 pr-12 rounded-full bg-gray-100/80 border border-transparent focus:bg-white focus:border-blue-200 focus:ring-4 focus:ring-blue-50 text-sm font-medium transition-all outline-none"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
              <kbd className="hidden lg:inline-flex items-center justify-center px-1.5 h-5 text-[10px] font-bold text-gray-400 bg-white border border-gray-200 rounded shadow-sm">⌘K</kbd>
            </div>
          </div>

          {/* Dark Mode Icon */}
          <button className="hidden sm:flex items-center justify-center w-10 h-10 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition-colors" title="Toggle Dark Mode">
            <FiMoon size={20} />
          </button>

          {/* Cart */}
          <Link href="/cart" className="relative flex items-center justify-center w-10 h-10 rounded-full text-gray-700 hover:bg-gray-100 transition-colors">
            <FiShoppingCart size={22} />
            <span className="absolute top-0 right-0 -mr-1 -mt-1 min-w-[20px] h-5 px-1 rounded-full bg-gradient-to-r from-blue-600 to-blue-500 text-white text-[11px] font-bold flex items-center justify-center shadow-sm border-2 border-white">
              {cartCount > 99 ? '99+' : cartCount}
            </span>
          </Link>

          {/* Auth */}
          <div className="hidden sm:flex items-center gap-4 pl-3 border-l border-gray-200">
            {user ? (
               <div className="relative group">
                 <button className="flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-blue-600 transition" type="button">
                   <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#1e3a5f] to-blue-400 text-white flex items-center justify-center shadow-inner font-bold text-sm">
                     {user.name?.charAt(0).toUpperCase()}
                   </div>
                 </button>
                 <div className="absolute right-0 mt-2 w-56 bg-white text-gray-800 rounded-2xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 border border-gray-100 overflow-hidden transform origin-top group-hover:scale-100 scale-95">
                   <div className="px-5 py-4 bg-gradient-to-b from-gray-50 to-white border-b border-gray-100">
                     <p className="text-sm font-bold text-gray-900 truncate">{user.name}</p>
                     <p className="text-xs text-gray-500 truncate mt-0.5">{user.email}</p>
                   </div>
                   <div className="py-2.5">
                     <Link href={user.role === 'admin' ? '/admin' : user.role === 'vendor' ? '/provider/dashboard' : '/dashboard'} className="block px-5 py-2 hover:bg-blue-50 hover:text-blue-600 text-sm font-medium transition-colors">Dashboard</Link>
                     <Link href="/dashboard/profile" className="block px-5 py-2 hover:bg-blue-50 hover:text-blue-600 text-sm font-medium transition-colors">Profile</Link>
                     <Link href="/dashboard/orders" className="block px-5 py-2 hover:bg-blue-50 hover:text-blue-600 text-sm font-medium transition-colors">Orders</Link>
                     <Link href="/dashboard/wishlist" className="block px-5 py-2 hover:bg-blue-50 hover:text-blue-600 text-sm font-medium transition-colors">Wishlist</Link>
                   </div>
                   <div className="py-2.5 border-t border-gray-100 bg-gray-50/50">
                     <button onClick={logout} className="block w-full text-left px-5 py-2 hover:bg-red-50 text-red-600 text-sm font-bold transition-colors">Logout Account</button>
                   </div>
                 </div>
               </div>
            ) : (
              <>
                <Link href="/login" className="text-sm font-bold text-gray-500 hover:text-gray-800 transition-colors">Login</Link>
                <Link href="/register" className="text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 shadow-md shadow-blue-500/20 px-6 py-2.5 rounded-full transition-all hover:shadow-lg hover:-translate-y-0.5">Sign Up</Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden flex items-center justify-center w-10 h-10 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors">
            {isOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`lg:hidden absolute w-full bg-white shadow-2xl border-t border-gray-100 transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-[600px] opacity-100 visible' : 'max-h-0 opacity-0 invisible'}`}>
        <div className="px-5 py-6 space-y-4">
          {/* Mobile Search */}
          <div className="relative xl:hidden mb-6">
             <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
             <input 
               type="text" 
               placeholder="Search products..." 
               className="w-full h-12 pl-11 pr-4 rounded-full bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-50 text-base font-medium outline-none transition-all"
               autoComplete="off"
             />
          </div>

          <div className="space-y-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.path || (link.path !== '/' && pathname.startsWith(link.path));
              return (
                <Link 
                  key={link.path} 
                  href={link.path} 
                  onClick={() => setIsOpen(false)} 
                  className={`block py-3 px-4 rounded-xl text-base font-bold transition-colors ${
                    isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>
          
          {!user && (
            <div className="pt-6 mt-2 border-t border-gray-100 flex flex-col gap-3">
               <Link href="/login" onClick={() => setIsOpen(false)} className="w-full py-3.5 text-center font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">Log In</Link>
               <Link href="/register" onClick={() => setIsOpen(false)} className="w-full py-3.5 text-center font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md transition-colors">Create Account</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
