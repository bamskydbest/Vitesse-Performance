import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaInstagram, FaTiktok } from "react-icons/fa";

export default function LandingPage() {
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
    { title: "Vehicle Diagnostics & Repairs", img: "/vehicle.jpg" },
    { title: "Performance & Specialist Services", img: "/performance.jpg" },
    { title: "Detailing & Vehicle Care", img: "/care.jpg" },
    { title: "Wrapping & Paint Protection", img: "/wrapping.jpg" },
    { title: "Parts & Consumables", img: "/parts.jpg" },
    { title: "And more", img: "/more.jpg" },
  ];

  return (
    <div className="relative min-h-screen bg-black text-white font-sans overflow-hidden">
      {/* Global purple zig-zag overlay */}
<div
  aria-hidden
  className="pointer-events-none fixed inset-0 z-0 opacity-30"
  style={{
    backgroundImage: `repeating-linear-gradient(
      135deg,
      transparent,
      transparent 20px,
      rgba(168,85,247,0.35) 20px,
      rgba(168,85,247,0.35) 40px
    )`,
  }}
/>



      {/* ALL CONTENT ABOVE OVERLAY */}
      <div className="relative z-10">
        {/* Navbar */}
        <nav className="fixed top-0 left-0 w-full z-50 bg-white backdrop-blur border-b border-black/10">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <ul className="hidden md:flex gap-8 text-sm text-black/70">
              <li><a href="#about" className="hover:text-black font-medium">Who we are</a></li>
              <li><a href="#services" className="hover:text-black font-medium">Services</a></li>
              <li><a href="#contact" className="hover:text-black font-medium">Contact</a></li>
            </ul>

            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-black"
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
            <div className="md:hidden bg-white/95 border-t border-black/10">
              <ul className="flex flex-col gap-4 px-4 py-4 text-black/70">
                <li><a href="#about">Who we are</a></li>
                <li><a href="#services">Services</a></li>
                <li><a href="#contact">Contact</a></li>
              </ul>
            </div>
          )}
        </nav>

        {/* Hero */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="min-h-screen pt-24 px-4 flex flex-col items-center justify-center text-center"
        >
          <img
            src="/vitesse.jpg"
            alt="Vitesse logo"
            className="w-48 sm:w-56 md:w-64 lg:w-72 mb-4"
          />

          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-[Rajdhani] tracking-wider">
            Precision<span className="text-purple-600">.</span>Performance
            <span className="text-purple-600">.</span>Excellence
          </h1>

          <p className="mt-4 text-white/70">A garage without compromise</p>
          <p className="mt-6 uppercase tracking-widest font-bold">
            Launching January 2026
          </p>

          {/* Form */}
          <div className="mt-10 w-full max-w-4xl">
            <h2 className="mb-4 font-semibold font-[Rajdhani] tracking-wider">Be the first to know</h2>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <input
                placeholder="Name *"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="px-4 py-3 bg-black/60 border border-white/20 rounded-lg"
                required
              />
              <input
                placeholder="Email *"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="px-4 py-3 bg-black/60 border border-white/20 rounded-lg"
                required
              />
              <input
                placeholder="Phone (optional)"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="px-4 py-3 bg-black/60 border border-white/20 rounded-lg"
              />
              <button className="sm:col-span-3 py-3 bg-purple-600 rounded-lg">
                {loading ? "Submitting..." : "Notify Me"}
              </button>
            </form>

            {success && (
              <p className="mt-4 text-green-400 text-sm">
                You’re on the list. We’ll be in touch.
              </p>
            )}
          </div>

          <div className="mt-8 flex gap-6 text-2xl text-white/70">
            <FaInstagram />
            <FaTiktok />
          </div>
        </motion.section>



      {/* About Section */}
      <section id="about" className="py-20 px-4 bg-black">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold font-['Rajdhani'] tracking-wider mb-6">Who we are</h2>
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
          <h2 className="text-3xl font-bold font-[Rajdhani] mb-10">Our services</h2>
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
      <h3 className="relative z-10 text-lg font-[Rajdhani] font-semibold">{service.title}</h3>
    </div>
  ))}
</div>


        </div>
      </motion.section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4 bg-black">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold font-['Rajdhani'] tracking-wider mb-6">Contact us</h2>
          <p className="text-white/70 mb-6">
            For enquiries, partnerships, or early access updates:
          </p>
          <div className="space-y-2 text-white/80">
            <p>Email: info@vitesseperformance.com</p>
            {/* <p>Phone / WhatsApp: +233 XXX XXX XXX</p> */}
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
     </div>
  );
}
