import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaInstagram, FaTiktok, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" as const },
  }),
};

export default function LandingPage({ onBook }: { onBook: () => void }) {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    googleFormData.append("entry.415508027", formData.name);
    googleFormData.append("entry.321323710", formData.email);
    googleFormData.append("entry.379676042", formData.phone);

    try {
      await fetch(formUrl, {
        method: "POST",
        mode: "no-cors",
        body: googleFormData,
      });

      setSuccess(true);
      setFormData({ name: "", email: "", phone: "" });
    } finally {
      setLoading(false);
    }
  };

  const services = [
    { title: "Vehicle Diagnostics & Repairs", img: "/MIC_0066.jpg" },
    { title: "Performance & Specialist Services", img: "/perform.jpg" },
    { title: "Detailing & Vehicle Care", img: "/MIC_0043.jpg" },
    { title: "Wrapping & Paint Protection", img: "/MIC_0095.jpg" },
    { title: "Parts & Consumables", img: "/consumable.jpg" },
    { title: "And more", img: "/MIC_0012.jpg" },
  ];

  return (
    <div className="relative min-h-screen bg-black text-white font-sans overflow-hidden">

      {/* Subtle diagonal texture */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0 opacity-15"
        style={{
          backgroundImage: `repeating-linear-gradient(
            135deg,
            transparent,
            transparent 40px,
            rgba(168,85,247,0.4) 40px,
            rgba(168,85,247,0.4) 41px
          )`,
        }}
      />

      <div className="relative z-10">

        {/* Navbar */}
        <nav className="fixed top-0 left-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

            {/* Brand */}
            {/* <a href="#" className="flex items-center">
              <img src="/vitesse.jpg" alt="Vitesse Performance" className="h-8 w-auto" />
            </a> */}

            {/* Desktop links */}
            <ul className="hidden md:flex items-center gap-8 text-sm text-white/60">
              <li>
                <a href="#about" className="hover:text-white transition-colors font-medium tracking-wide">
                  Who we are
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-white transition-colors font-medium tracking-wide">
                  What we do
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-white transition-colors font-medium tracking-wide">
                  Contact us
                </a>
              </li>
              <li>
                <button
                  onClick={onBook}
                  className="px-4 py-2 border border-purple-500 text-purple-400 text-xs font-semibold
                             tracking-widest uppercase rounded-sm hover:bg-purple-600 hover:text-white
                             transition-all duration-200"
                >
                  Book a Service
                </button>
              </li>
            </ul>

            {/* Mobile hamburger */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-white/70 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={mobileMenuOpen
                      ? "M6 18L18 6M6 6l12 12"
                      : "M4 6h16M4 12h16M4 18h16"}
                  />
                </svg>
              </button>
            </div>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden bg-black/95 border-t border-white/10">
              <ul className="flex flex-col gap-4 px-6 py-5 text-white/70">
                <li>
                  <a href="#about" onClick={() => setMobileMenuOpen(false)} className="hover:text-white transition-colors">
                    Who we are
                  </a>
                </li>
                <li>
                  <a href="#services" onClick={() => setMobileMenuOpen(false)} className="hover:text-white transition-colors">
                    What we do
                  </a>
                </li>
                <li>
                  <a href="#contact" onClick={() => setMobileMenuOpen(false)} className="hover:text-white transition-colors">
                    Contact us
                  </a>
                </li>
                <li>
                  <button
                    onClick={() => { setMobileMenuOpen(false); onBook(); }}
                    className="w-full text-left text-purple-400 font-semibold hover:text-purple-300 transition-colors"
                  >
                    Book a Service →
                  </button>
                </li>
              </ul>
            </div>
          )}
        </nav>

        {/* Hero */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="min-h-screen pt-5 px-4 flex flex-col items-center justify-center text-center"
        >
          <img
            src="/vitesse.jpg"
            alt="Vitesse logo"
            className="w-56 sm:w-66 md:w-74 lg:w-82 mb-4"
          />

          <p className="mt-4 text-white/60 tracking-wide">A workshop without compromise</p>
          <p className="mt-3 uppercase tracking-widest text-sm font-semibold text-purple-400">
            Opening 2026 | Accra
          </p>

          {/* Notify-me form */}
          <div className="mt-12 w-full max-w-3xl">
            <div className="flex items-center gap-3 justify-center mb-6">
              <span className="flex-1 h-px bg-purple-600/40 max-w-[80px]" />
              <h2 className="text-sm font-semibold font-[Rajdhani] tracking-widest uppercase text-white/70">
                Be the first to know
              </h2>
              <span className="flex-1 h-px bg-purple-600/40 max-w-[80px]" />
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                placeholder="Name *"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="px-4 py-3 bg-white/5 border border-white/15 rounded-lg text-sm placeholder-white/40
                           focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                required
              />
              <input
                type="email"
                placeholder="Email *"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="px-4 py-3 bg-white/5 border border-white/15 rounded-lg text-sm placeholder-white/40
                           focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                required
              />
              <input
                type="tel"
                placeholder="Phone (optional)"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="px-4 py-3 bg-white/5 border border-white/15 rounded-lg text-sm placeholder-white/40
                           focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
              />
              <button
                type="submit"
                disabled={loading}
                className="sm:col-span-3 py-3 bg-purple-600 hover:bg-purple-700 active:bg-purple-800
                           rounded-lg text-sm font-semibold tracking-wider uppercase transition-colors
                           disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? "Submitting…" : "Notify Me"}
              </button>
            </form>

            {success && (
              <motion.p
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 text-green-400 text-sm"
              >
                You're on the list. We'll be in touch.
              </motion.p>
            )}
          </div>

          {/* Socials */}
          <div className="mt-12 flex flex-col items-center gap-4">
            <p className="text-xs uppercase tracking-widest text-white/40">Follow us</p>
            <div className="flex gap-6 text-white/60">
              <a
                href="https://www.instagram.com/vitesse.gh?igsh=MXFlZ2dhbTM4bDN5aA%3D%3D&utm_source=qr"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors text-3xl"
              >
                <FaInstagram />
              </a>
              <a
                href="https://www.tiktok.com/@vitesse.gh?_r=1&_t=ZS-93Kz2uglWID"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors text-3xl"
              >
                <FaTiktok />
              </a>
            </div>
          </div>
        </motion.section>

        {/* About Section */}
        <motion.section
          id="about"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="py-24 px-4 bg-black"
        >
          <div className="max-w-3xl mx-auto text-center">
            <div className="flex items-center gap-3 justify-center mb-8">
              <span className="flex-1 h-px bg-purple-600/40" />
              <h2 className="text-3xl font-bold font-[Rajdhani] tracking-wider">Who we are</h2>
              <span className="flex-1 h-px bg-purple-600/40" />
            </div>
            <p className="text-white/65 leading-relaxed mb-5">
              Vitesse is a premium automotive service centre specialising in performance and luxury vehicles.
            </p>
            <p className="text-white/65 leading-relaxed mb-5">
              Our team works with modern diagnostic tools, manufacturer-level parts and procedures, and a clear,
              detail-led process to ensure every vehicle is handled properly from arrival to handover.
            </p>
            <p className="text-white/65 leading-relaxed">
              Our customers trust us to feel informed and at ease at each stage — with clear explanations,
              honest guidance, and confidence that their car is in the right hands.
            </p>
          </div>
        </motion.section>

        {/* Services Section */}
        <section
          id="services"
          className="py-24 px-4 bg-gradient-to-b from-black to-purple-950/40"
        >
          <div className="max-w-6xl mx-auto text-center">
            <div className="flex items-center gap-3 justify-center mb-3">
              <span className="flex-1 h-px bg-purple-600/40" />
              <h2 className="text-3xl font-bold font-[Rajdhani] tracking-wider">What we do</h2>
              <span className="flex-1 h-px bg-purple-600/40" />
            </div>
            <p className="text-sm text-white/50 font-semibold tracking-widest mb-12 uppercase">
              Precision <span className="text-purple-500">|</span> Performance <span className="text-purple-500">|</span> Excellence
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service, i) => (
                <motion.div
                  key={service.title}
                  custom={i}
                  variants={cardVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="group relative rounded-2xl overflow-hidden cursor-pointer border border-white/10
                             hover:border-purple-500 transition-all duration-300"
                  style={{ minHeight: "260px" }}
                >
                  {/* Background image */}
                  <div
                    className="absolute inset-0 bg-cover bg-center scale-100 group-hover:scale-105 transition-transform duration-500"
                    style={{ backgroundImage: `url(${service.img})` }}
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/50 group-hover:bg-black/35 transition-colors duration-300" />
                  {/* Title */}
                  <div className="relative z-10 h-full flex items-center justify-center p-6">
                    <h3
                      className="text-lg font-[Rajdhani] font-semibold text-white"
                      style={{ textShadow: "0 2px 8px rgba(0,0,0,0.8)" }}
                    >
                      {service.title}
                    </h3>
                  </div>
                </motion.div>
              ))}
            </div>
          {/* Book CTA */}
          <div className="mt-14 text-center">
            <div className="flex items-center gap-4 justify-center mb-6">
              <span className="flex-1 h-px bg-purple-600/30 max-w-[120px]" />
              <p className="text-xs uppercase tracking-widest text-white/40">Ready to book?</p>
              <span className="flex-1 h-px bg-purple-600/30 max-w-[120px]" />
            </div>
            <button
              onClick={onBook}
              className="px-10 py-4 bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white
                         text-xs font-semibold tracking-[0.2em] uppercase rounded-sm transition-colors
                         shadow-[0_0_30px_rgba(147,51,234,0.3)] hover:shadow-[0_0_40px_rgba(147,51,234,0.5)]"
            >
              Book a Service →
            </button>
          </div>
          </div>
        </section>

        {/* Contact Section */}
        <motion.section
          id="contact"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="py-24 px-4 bg-black"
        >
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center gap-3 justify-center mb-8">
              <span className="flex-1 h-px bg-purple-600/40" />
              <h2 className="text-3xl font-bold font-[Rajdhani] tracking-wider">Contact us</h2>
              <span className="flex-1 h-px bg-purple-600/40" />
            </div>
            <p className="text-white/60 mb-10">
              For enquiries, partnerships, or early access updates:
            </p>

            <div className="flex flex-col items-center gap-4 text-white/75 text-sm">
              <div className="flex items-center gap-3">
                <FaEnvelope className="text-purple-500 text-base shrink-0" />
                <span>info@vitesseperformance.com</span>
              </div>
              <div className="flex items-center gap-3">
                <FaMapMarkerAlt className="text-purple-500 text-base shrink-0" />
                <span>Vitesse Performance — Tse Addo, Accra</span>
              </div>
            </div>

            <div className="mt-12 flex flex-col items-center gap-4">
              <p className="text-xs uppercase tracking-widest text-white/40">Follow us</p>
              <div className="flex gap-6 text-white/60">
                <a
                  href="https://www.instagram.com/vitesse.gh?igsh=MXFlZ2dhbTM4bDN5aA%3D%3D&utm_source=qr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors text-3xl"
                >
                  <FaInstagram />
                </a>
                <a
                  href="https://www.tiktok.com/@vitesse.gh?_r=1&_t=ZS-93Kz2uglWID"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors text-3xl"
                >
                  <FaTiktok />
                </a>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Footer */}
        <footer className="py-6 text-center text-xs text-white/30 border-t border-white/10 tracking-wide">
          © {new Date().getFullYear()} Vitesse Performance. All rights reserved.
        </footer>

      </div>
    </div>
  );
}
