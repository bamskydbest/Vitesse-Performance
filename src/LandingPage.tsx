import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaInstagram, FaTiktok } from "react-icons/fa";

export default function LandingPage() {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false); // ✅ Fix

  // Hide success message after 10 seconds
  useEffect(() => {
    if (!success) return;
    const timer = setTimeout(() => setSuccess(false), 10000);
    return () => clearTimeout(timer);
  }, [success]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formUrl =
      "https://docs.google.com/forms/d/e/1FAIpQLSeRgFrmeTzdOTPebJVFd6shJvdNlbuoKLP4SfxlYIubuJt2QQ/formResponse";

    const googleFormData = new FormData();
    googleFormData.append("entry.415508027", formData.name);   // Name
    googleFormData.append("entry.321323710", formData.email);  // Email
    googleFormData.append("entry.379676042", formData.phone);  // Phone

    try {
      await fetch(formUrl, {
        method: "POST",
        mode: "no-cors",
        body: googleFormData,
      });

      setSuccess(true);
      setFormData({ name: "", email: "", phone: "" });
    } catch (err) {
      console.error("Google Form submit error", err);
    } finally {
      setLoading(false);
    }
  };

  const services = [
    { title: "Vehicle Diagnostics & Repairs", img: "/vehicle.jpg" },
    { title: "Performance & Specialist Services", img: "/performance.jpg" },
    { title: "Detailing & Vehicle Care", img: "/care.jpg" },
    { title: "Wrapping & Paint Protection", img: "/wrapping.jpg" },
    { title: "Parts & Consumables", img: "/parts.jpg" },
    { title: "And more", img: "/more.jpg" },
  ];

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-white backdrop-blur border-b border-black/10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="text-xl font-semibold tracking-wide text-black">
            VITESSE PERFORMANCE
          </div>

          {/* Desktop Links */}
          <ul className="hidden md:flex gap-8 text-sm text-black/70">
            <li><a href="#about" className="hover:text-black font-medium">Who we are</a></li>
            <li><a href="#services" className="hover:text-black font-medium">Services</a></li>
            <li><a href="#contact" className="hover:text-black font-medium">Contact</a></li>
          </ul>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-black focus:outline-none"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur border-t border-black/10">
            <ul className="flex flex-col gap-4 px-4 py-4 text-black/70">
              <li><a href="#about" className="hover:text-black font-medium">Who we are</a></li>
              <li><a href="#services" className="hover:text-black font-medium">Services</a></li>
              <li><a href="#contact" className="hover:text-black font-medium">Contact</a></li>
            </ul>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="relative flex flex-col items-center justify-center min-h-screen pt-28 px-4 text-center"
      >
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-purple-900/40 via-black to-black" />

        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-wide inline-flex flex-wrap justify-center gap-2">
          <span>Precision</span>
          <span className="text-purple-600">.</span>
          <span>Performance</span>
          <span className="text-purple-600">.</span>
          <span>Excellence</span>
        </h1>

        <p className="mt-4 text-white/70 text-sm sm:text-base">
          A garage without compromise
        </p>
        <p className="mt-6 sm:mt-8 uppercase tracking-widest text-sm sm:text-base font-bold text-white">
          Launching January 2026
        </p>

        {/* Form Section */}
        <div className="mt-10 w-full max-w-4xl">
          <h2 className="text-lg font-semibold mb-4">Be the first to know</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Name *"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="px-4 py-3 bg-black/60 border border-white/20 rounded-lg focus:outline-none focus:border-purple-500 w-full"
              required
            />
            <input
              type="email"
              placeholder="Email *"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="px-4 py-3 bg-black/60 border border-white/20 rounded-lg focus:outline-none focus:border-purple-500 w-full"
              required
            />
            <input
              type="tel"
              placeholder="Phone (optional)"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="px-4 py-3 bg-black/60 border border-white/20 rounded-lg focus:outline-none focus:border-purple-500 w-full"
            />
            <button
              type="submit"
              className="sm:col-span-3 mt-2 py-3 rounded-lg bg-purple-600 hover:bg-purple-700 transition font-medium w-full"
            >
              {loading ? "Submitting..." : "Notify Me"}
            </button>
          </form>

          {success && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-4 text-green-400 text-sm"
            >
              You’re on the list. We’ll be in touch.
            </motion.p>
          )}
        </div>

        {/* Social Icons */}
        <div className="mt-8 flex justify-center gap-6 text-white/70 text-2xl">
          <a href="#" className="hover:text-white transition">
            <FaInstagram />
          </a>
          <a href="#" className="hover:text-white transition">
            <FaTiktok />
          </a>
        </div>
      </motion.section>



      {/* About Section */}
      <section id="about" className="py-20 px-4 bg-black">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Who we are</h2>
          <p className="text-white/70 leading-relaxed">
            Vitesse is a premium automotive service centre built for owners who expect more from their vehicles—and from the people who work on them. We combine technical expertise, modern diagnostics, and meticulous attention to detail to deliver a seamless, high-quality automotive experience.
          </p>
        </div>
      </section>

      {/* Services Section */}
      <motion.section
        id="services"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="py-20 px-4 bg-gradient-to-b from-black to-purple-950/40"
      >
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-10">Our services</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-white/80">
  {services.map((service) => (
    <div
      key={service.title}
      className="p-6 rounded-2xl relative border border-black/20 cursor-pointer overflow-hidden 
                 hover:border-purple-500 hover:bg-purple-900/30 hover:text-white transition-all duration-300
                 flex items-center justify-center text-center"
      style={{
        backgroundImage: `url(${service.img})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "200px",
      }}
    >
      <div className="absolute inset-0 bg-black/40 hover:bg-black/30 transition" />
      <h3 className="relative z-10 text-lg font-semibold">{service.title}</h3>
    </div>
  ))}
</div>


        </div>
      </motion.section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4 bg-black">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Contact us</h2>
          <p className="text-white/70 mb-6">
            For enquiries, partnerships, or early access updates:
          </p>
          <div className="space-y-2 text-white/80">
            <p>Email: info@vitesseperformance.com</p>
            <p>Phone / WhatsApp: +233 XXX XXX XXX</p>
            <p>Location: Accra, Ghana</p>
          </div>
           <div className="mt-8 flex justify-center gap-6 text-white/70 text-xl">
      <a href="#" className="hover:text-white transition">
        <FaInstagram />
      </a>
      <a href="#" className="hover:text-white transition">
        <FaTiktok />
      </a>
    </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 text-center text-xs text-white/50 border-t border-white/10">
        © {new Date().getFullYear()} Vitesse Performance. All rights reserved.
      </footer>
    </div>
  );
}
