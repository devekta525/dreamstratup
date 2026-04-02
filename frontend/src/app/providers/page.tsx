'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiTool, FiZap, FiDroplet, FiArrowRight } from 'react-icons/fi';

const PROFESSIONS = [
  { icon: <FiTool />, title: 'Carpenter', desc: 'Custom furniture, woodwork, door installations, and modular repairs.' },
  { icon: <FiZap />, title: 'Electrician', desc: 'Wiring, fixture setups, and electrical repairs for all client sizes.' },
  { icon: <FiDroplet />, title: 'Plumber', desc: 'Pipeline installations, leak fixes, and complete bathroom setups.' },
];

export default function ProvidersPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="min-h-screen bg-slate-50 text-[#1e3a5f] overflow-hidden relative">
      {/* Background gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-blue-100/60 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[0] right-[-10%] w-[500px] h-[500px] bg-orange-100/50 rounded-full blur-[120px] pointer-events-none" />

      {/* Hero */}
      <section className={`relative pt-32 pb-24 px-4 transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-block border border-blue-200 bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-8 shadow-sm">
            Service Providers
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 text-[#1e3a5f] leading-tight">
            Elevate Your <span className="text-orange-500">Trade</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
            Turn your skills into steady, reliable income. Join DreamStartup's elite network of professionals and let the work come to you.
          </p>
          <Link
            href="/register?role=vendor"
            className="group inline-flex items-center gap-3 bg-[#1e3a5f] text-white font-bold px-8 py-4 rounded-full overflow-hidden relative transition-all hover:scale-105 hover:bg-[#16304f] shadow-lg"
          >
            <span className="relative z-10">Join the Network</span>
            <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-1 transition-transform z-10">
              <FiArrowRight />
            </span>
          </Link>
        </div>
      </section>

      {/* Professions Grid */}
      <section className="relative z-10 py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#1e3a5f] mb-4">Professions We Elevate</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {PROFESSIONS.map((prof, i) => (
              <div key={prof.title} className="group relative transition-all duration-500 hover:-translate-y-2" style={{ transitionDelay: `${i * 150}ms` }}>
                <div className="relative h-full bg-white border border-slate-200 rounded-3xl p-8 shadow-sm hover:shadow-xl hover:border-blue-200 overflow-hidden transition-all duration-300">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-[40px] group-hover:bg-blue-100 transition-all pointer-events-none" />
                  <div className="w-16 h-16 bg-blue-50 text-[#1e3a5f] border border-blue-100 flex items-center justify-center rounded-2xl text-3xl mb-6 group-hover:scale-110 transition-transform origin-left group-hover:bg-[#1e3a5f] group-hover:text-white">
                    {prof.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-[#1e3a5f] mb-4">{prof.title}</h3>
                  <p className="text-slate-500 leading-relaxed font-medium">
                    {prof.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works with Timeline */}
      <section className="relative z-10 py-24 px-4 bg-white border-y border-slate-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#1e3a5f] mb-4">The Journey</h2>
            <p className="text-slate-500">4 easy steps to recurring jobs</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            <div className="hidden md:block absolute top-[28px] left-[10%] right-[10%] h-[2px] bg-slate-100" />
            {[
              { num: '01', title: 'Register', p: 'Create an account.' },
              { num: '02', title: 'Verify', p: 'Pass the 48h review.' },
              { num: '03', title: 'Connect', p: 'Receive job leads.' },
              { num: '04', title: 'Earn', p: 'Complete & collect.' }
            ].map((step, i) => (
              <div key={step.num} className="text-center relative group">
                <div className="w-14 h-14 mx-auto rounded-full bg-white border-2 border-slate-200 flex items-center justify-center text-slate-400 font-bold text-lg relative z-10 group-hover:border-orange-500 group-hover:text-orange-500 group-hover:shadow-[0_10px_20px_rgba(249,115,22,0.2)] transition-all bg-white">
                  {step.num}
                </div>
                <h3 className="text-xl font-bold text-[#1e3a5f] mt-6 mb-2">{step.title}</h3>
                <p className="text-sm text-slate-500 font-medium">{step.p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-4 text-center relative z-10">
        <h2 className="text-4xl font-extrabold text-[#1e3a5f] mb-8">Ready to revolutionize your work?</h2>
        <Link href="/register?role=vendor" className="inline-block bg-orange-500 text-white font-bold py-4 px-12 rounded-full hover:bg-orange-600 hover:shadow-lg transition-all transform hover:-translate-y-1">
          Start Now
        </Link>
      </section>
    </div>
  );
}
