'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { enquiryService } from '@/services/enquiry.service';
import { FiMessageSquare, FiTrendingUp, FiPhone, FiMail, FiMapPin, FiSend } from 'react-icons/fi';

interface EnquiryForm {
  name: string;
  phone: string;
  email: string;
  message: string;
}

const EMPTY: EnquiryForm = { name: '', phone: '', email: '', message: '' };

export default function ContactPage() {
  const [activeTab, setActiveTab] = useState<'bulk_order' | 'startup'>('bulk_order');
  const [form, setForm] = useState<EnquiryForm>(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => setVisible(true), []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await enquiryService.submit({ ...form, type: activeTab });
      toast.success('Enquiry submitted! Watch your inbox.');
      setForm(EMPTY);
    } catch (err: unknown) {
      toast.error('Failed to submit enquiry. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-[#1e3a5f] overflow-hidden relative">
      {/* Abstract Backgrounds */}
      <div className="absolute top-1/4 left-0 -ml-64 w-[800px] h-[800px] bg-orange-100/60 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-100/50 rounded-full blur-[120px] pointer-events-none" />
      
      {/* Hero */}
      <section className={`relative pt-32 pb-16 px-4 transition-all duration-1000 transform ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 text-[#1e3a5f] text-sm font-bold tracking-wide uppercase mb-6 shadow-sm">
            Get In Touch
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 text-[#1e3a5f] leading-tight">
            Let's Collaborate
          </h1>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed font-light">
            Whether you're looking to bulk order or kickstart a new venture, our team is ready to scale your ambition.
          </p>
        </div>
      </section>

      {/* Interactive Form Section */}
      <section className="relative z-10 max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white border border-slate-200 rounded-[2.5rem] p-4 md:p-8 shadow-xl relative overflow-hidden">
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-blue-50/50 to-transparent blur-3xl pointer-events-none" />
          
          <div className="flex flex-col lg:flex-row gap-12 relative z-10">
            {/* Form Left Side */}
            <div className="flex-1 lg:p-8">
              {/* Custom Tab Switcher */}
              <div className="flex p-1 bg-slate-100 rounded-2xl mb-10 w-full max-w-md mx-auto lg:mx-0 shadow-inner">
                <button
                  type="button"
                  onClick={() => setActiveTab('bulk_order')}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${activeTab === 'bulk_order' ? 'bg-white text-[#1e3a5f] shadow-sm border border-slate-200' : 'text-slate-500 hover:text-[#1e3a5f]'}`}
                >
                  <FiMessageSquare /> Bulk Order
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('startup')}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${activeTab === 'startup' ? 'bg-white text-orange-500 shadow-sm border border-orange-100' : 'text-slate-500 hover:text-orange-500'}`}
                >
                  <FiTrendingUp /> Startup
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Name</label>
                    <input type="text" name="name" value={form.name} onChange={handleChange} required className="w-full bg-slate-50 border border-slate-200 focus:border-blue-400 focus:bg-white rounded-xl px-5 py-4 text-[#1e3a5f] font-medium outline-none transition-all shadow-inner" placeholder="Enter your name" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Phone</label>
                    <input type="tel" name="phone" value={form.phone} onChange={handleChange} required pattern="[6-9][0-9]{9}" className="w-full bg-slate-50 border border-slate-200 focus:border-blue-400 focus:bg-white rounded-xl px-5 py-4 text-[#1e3a5f] font-medium outline-none transition-all shadow-inner" placeholder="Enter phone" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email</label>
                  <input type="email" name="email" value={form.email} onChange={handleChange} required className="w-full bg-slate-50 border border-slate-200 focus:border-blue-400 focus:bg-white rounded-xl px-5 py-4 text-[#1e3a5f] font-medium outline-none transition-all shadow-inner" placeholder="Enter email address" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Message</label>
                  <textarea name="message" value={form.message} onChange={handleChange} required rows={4} className="w-full bg-slate-50 border border-slate-200 focus:border-blue-400 focus:bg-white rounded-xl px-5 py-4 text-[#1e3a5f] font-medium outline-none transition-all resize-none shadow-inner" placeholder={activeTab === 'bulk_order' ? "Tell us about what you want to order..." : "Tell us about your startup vision..."} />
                </div>
                <button type="submit" disabled={submitting} className={`w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-white transition-all transform hover:-translate-y-1 shadow-md ${activeTab === 'bulk_order' ? 'bg-[#1e3a5f] hover:bg-[#16304f]' : 'bg-orange-500 hover:bg-orange-600'}`}>
                  {submitting ? 'Sending securely...' : (
                    <><FiSend /> Send Message</>
                  )}
                </button>
              </form>
            </div>

            {/* Direct Contact Info */}
            <div className="lg:w-1/3 flex flex-col justify-center gap-6 lg:border-l border-slate-100 lg:pl-12 pt-8 lg:pt-0">
              {[
                { icon: <FiPhone />, title: 'Call Us', val: '+91 98765 43210' },
                { icon: <FiMail />, title: 'Email Us', val: 'hello@dreamstartup.in' },
                { icon: <FiMapPin />, title: 'Visit Us', val: 'MG Road, Jaipur, 302001' },
              ].map((c) => (
                <div key={c.title} className="flex items-center gap-5 p-5 rounded-2xl bg-white border border-slate-100 hover:border-blue-200 hover:shadow-md transition-all group cursor-default">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#1e3a5f] flex items-center justify-center group-hover:scale-110 group-hover:bg-[#1e3a5f] group-hover:text-white transition-all duration-300">
                    {c.icon}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">{c.title}</h4>
                    <p className="font-bold text-slate-700">{c.val}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <div className="h-24"></div>
    </div>
  );
}
