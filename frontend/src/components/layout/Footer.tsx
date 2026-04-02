import Link from 'next/link';
import { FiPhone, FiMail, FiMapPin } from 'react-icons/fi';
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaYoutube } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="relative text-gray-300">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0b1220] via-[#0b1427] to-[#070d18]" />
      <div
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg width=\'56\' height=\'56\' viewBox=\'0 0 56 56\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.35\'%3E%3Cpath d=\'M0 28L28 0l28 28-28 28z\'/%3E%3C/g%3E%3C/svg%3E")',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <h3 className="text-white text-xl font-extrabold mb-4">
              Dream<span className="text-orange-400">Startup</span>
            </h3>
            <p className="text-sm leading-relaxed text-gray-300/90">
              Apka Sapna, Humara Sahayog. Your one-stop platform for wholesale products, business startup kits, and local service providers.
            </p>

            <div className="mt-5 flex items-center gap-3">
              <a
                href="#"
                className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-white/10 border border-white/10 hover:bg-white/15 transition"
                aria-label="Facebook"
              >
                <FaFacebookF size={14} className="text-white" />
              </a>
              <a
                href="#"
                className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-white/10 border border-white/10 hover:bg-white/15 transition"
                aria-label="Instagram"
              >
                <FaInstagram size={15} className="text-white" />
              </a>
              <a
                href="#"
                className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-white/10 border border-white/10 hover:bg-white/15 transition"
                aria-label="LinkedIn"
              >
                <FaLinkedinIn size={15} className="text-white" />
              </a>
              <a
                href="#"
                className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-white/10 border border-white/10 hover:bg-white/15 transition"
                aria-label="YouTube"
              >
                <FaYoutube size={16} className="text-white" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-extrabold mb-4">Quick Links</h4>
            <div className="space-y-2.5 text-sm">
              <Link href="/shop" className="block hover:text-orange-400 transition">Shop Wholesale</Link>
              <Link href="/startup" className="block hover:text-orange-400 transition">Start Your Business</Link>
              <Link href="/providers" className="block hover:text-orange-400 transition">Service Providers</Link>
              <Link href="/contact" className="block hover:text-orange-400 transition">Contact Us</Link>
            </div>
          </div>

          <div>
            <h4 className="text-white font-extrabold mb-4">Categories</h4>
            <div className="space-y-2.5 text-sm">
              <Link href="/shop?category=Furniture+Hardware" className="block hover:text-orange-400 transition">Furniture Hardware</Link>
              <Link href="/shop?category=Sanitary" className="block hover:text-orange-400 transition">Sanitary</Link>
              <Link href="/shop?category=Electrical" className="block hover:text-orange-400 transition">Electrical</Link>
              <Link href="/shop?category=Home+Decor" className="block hover:text-orange-400 transition">Home Decor</Link>
            </div>
          </div>

          <div>
            <h4 className="text-white font-extrabold mb-4">Contact</h4>
            <div className="space-y-3 text-sm">
              <p className="flex items-start gap-2">
                <FiPhone size={14} className="mt-0.5 text-white/80" />
                <span>+91 98765 43210</span>
              </p>
              <p className="flex items-start gap-2">
                <FiMail size={14} className="mt-0.5 text-white/80" />
                <span>info@dreamstartup.in</span>
              </p>
              <p className="flex items-start gap-2">
                <FiMapPin size={14} className="mt-0.5 text-white/80" />
                <span>Mumbai, Maharashtra, India</span>
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} DreamStartup. All rights reserved.</p>
          <div className="text-xs text-gray-500">Available</div>
        </div>
      </div>
    </footer>
  );
}
