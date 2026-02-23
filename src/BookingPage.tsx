import React, { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaCheck, FaArrowLeft, FaChevronDown } from "react-icons/fa";

// ─── Constants ───────────────────────────────────────────────────────────────

const SERVICE_OPTIONS = [
  { value: "Oil & Filter Change", icon: "🔧" },
  { value: "Brake Service", icon: "🛑" },
  { value: "Tyre Rotation / Replacement", icon: "🔄" },
  { value: "Scheduled / Logbook Service", icon: "📋" },
  { value: "Suspension & Steering", icon: "🔩" },
  { value: "Electrical Diagnostics", icon: "⚡" },
  { value: "Air Conditioning", icon: "❄️" },
  { value: "Engine / Transmission", icon: "⚙️" },
  { value: "Roadworthy Inspection", icon: "🔍" },
  { value: "Performance Services", icon: "🏎️" },
  { value: "Detailing & Vehicle Care", icon: "✨" },
  { value: "Wrapping & Paint Protection", icon: "🎨" },
  { value: "Other / Not Sure", icon: "❓" },
];

const DROPOFF_OPTIONS = [
  { value: "drop-leave", icon: "🚗", label: "Drop & Leave", desc: "Leave the vehicle and collect it once work is complete" },
  { value: "wait", icon: "⏳", label: "Wait On-Site", desc: "Remain on-site while the vehicle is being serviced" },
  { value: "pickup", icon: "🚕", label: "Collection Service", desc: "We collect the vehicle from you — call to confirm availability" },
];

const TIME_SLOTS = [
  "07:30 – 09:00", "09:00 – 10:30", "10:30 – 12:00",
  "12:00 – 13:30", "13:30 – 15:00", "15:00 – 16:30",
];

const WARNING_LIGHTS = ["None", "Check Engine", "Oil Pressure", "Battery", "ABS", "Multiple / Other"];

const STEPS = [
  { num: "01", label: "Your Details" },
  { num: "02", label: "Vehicle" },
  { num: "03", label: "Service" },
  { num: "04", label: "Appointment" },
];

const URGENCY = [
  { val: "low",    icon: "🟢", title: "Routine", desc: "No rush, flexible timing",    active: "border-green-500 bg-green-500/10" },
  { val: "medium", icon: "🟡", title: "Soon",    desc: "Within the next 1–2 weeks",   active: "border-purple-500 bg-purple-600/15" },
  { val: "high",   icon: "🔴", title: "Urgent",  desc: "Safety concern, ASAP",        active: "border-red-500 bg-red-500/10" },
];

// ─── Types ────────────────────────────────────────────────────────────────────

interface FormData {
  firstName: string; lastName: string; phone: string; email: string; referral: string;
  year: string; make: string; model: string; variant: string; colour: string;
  vin: string; plate: string; mileage: string; transmission: string; fuelType: string; returning: string;
  services: string[]; urgency: string; issueDesc: string; warningLights: string;
  prefDate: string; prefTime: string; altDate: string; dropoff: string; additionalNotes: string;
}

type Errors = Record<string, string>;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function inputCls(errors: Errors, field: string) {
  const hasErr = !!errors[field];
  return (
    "w-full bg-white/5 border " +
    (hasErr ? "border-red-500" : "border-white/10") +
    " rounded-sm px-4 py-3 text-sm text-white placeholder-white/25" +
    " focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
  );
}

// ── Custom Select ─────────────────────────────────────────────────────────────

function CustomSelect({
  value,
  onChange,
  options,
  placeholder,
  hasError,
}: {
  value: string;
  onChange: (val: string) => void;
  options: string[];
  placeholder: string;
  hasError?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`w-full flex items-center justify-between px-4 py-3 bg-white/5 border rounded-sm
                    text-sm text-left transition-all focus:outline-none
                    ${hasError
                      ? "border-red-500"
                      : open
                      ? "border-purple-500 ring-2 ring-purple-500/30"
                      : "border-white/10 hover:border-white/20"}`}
      >
        <span className={value ? "text-white" : "text-white/25"}>{value || placeholder}</span>
        <FaChevronDown
          className={`text-white/30 text-xs transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown panel */}
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.15, ease: "easeOut" as const }}
          className="absolute top-full left-0 right-0 z-50 mt-1 bg-[#0d0d0d] border border-white/10
                     rounded-sm overflow-hidden shadow-2xl"
        >
          {options.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => { onChange(opt); setOpen(false); }}
              className={`w-full px-4 py-3 text-sm text-left flex items-center justify-between
                          transition-colors duration-150
                          ${value === opt
                            ? "text-purple-400 bg-purple-600/10"
                            : "text-white/55 hover:text-white hover:bg-white/5"}`}
            >
              <span>{opt}</span>
              {value === opt && <FaCheck className="text-[9px] text-purple-400" />}
            </button>
          ))}
        </motion.div>
      )}
    </div>
  );
}

// ── Shared UI ─────────────────────────────────────────────────────────────────

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-[10px] tracking-[0.18em] uppercase text-white/50 font-medium mb-1.5">
      {children}
    </label>
  );
}

function Required() {
  return <span className="text-purple-400 ml-0.5">*</span>;
}

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <p className="text-red-400 text-xs mt-1.5">{msg}</p>;
}

function SectionHeader({ num, title, sub }: { num: string; title: string; sub: string }) {
  return (
    <div className="flex items-baseline gap-4 mb-8">
      <span className="font-[Rajdhani] text-6xl text-white/8 leading-none select-none">{num}</span>
      <div>
        <h2 className="font-[Rajdhani] text-2xl tracking-wider text-white">{title}</h2>
        <p className="text-white/40 text-sm mt-0.5">{sub}</p>
      </div>
    </div>
  );
}

function NavRow({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex justify-between items-center mt-10 pt-6 border-t border-white/10">
      {children}
    </div>
  );
}

function PrimaryBtn({ onClick, children, loading }: { onClick: () => void; children: React.ReactNode; loading?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className="px-8 py-3 bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white
                 text-xs font-semibold tracking-[0.18em] uppercase rounded-sm transition-colors
                 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {children}
    </button>
  );
}

function GhostBtn({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="px-6 py-3 border border-white/10 hover:border-white/30 text-white/50 hover:text-white
                 text-xs font-medium tracking-[0.15em] uppercase rounded-sm transition-colors"
    >
      {children}
    </button>
  );
}

function Divider() {
  return <div className="h-px bg-white/10 my-6" />;
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function BookingPage({ onBack }: { onBack: () => void }) {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refNum, setRefNum] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [formData, setFormData] = useState<FormData>({
    firstName: "", lastName: "", phone: "", email: "", referral: "",
    year: "", make: "", model: "", variant: "", colour: "",
    vin: "", plate: "", mileage: "", transmission: "", fuelType: "", returning: "",
    services: [], urgency: "", issueDesc: "", warningLights: "",
    prefDate: "", prefTime: "", altDate: "", dropoff: "", additionalNotes: "",
  });

  const minDate = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
  }, []);

  function setField(field: keyof FormData, value: string | string[]) {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => { const e = { ...prev }; delete e[field]; return e; });
  }

  function toggleService(val: string) {
    const updated = formData.services.includes(val)
      ? formData.services.filter((s) => s !== val)
      : [...formData.services, val];
    setField("services", updated);
  }

  function validate(s: number): Errors {
    const e: Errors = {};
    if (s === 1) {
      if (!formData.firstName.trim()) e.firstName = "Please enter your first name.";
      if (!formData.lastName.trim()) e.lastName = "Please enter your last name.";
      if (!formData.phone.trim()) e.phone = "Please enter a valid phone number.";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) e.email = "Please enter a valid email address.";
    }
    if (s === 2) {
      const yr = parseInt(formData.year);
      if (!yr || yr < 1980 || yr > 2026) e.year = "Please enter a valid year (1980–2026).";
      if (!formData.make.trim()) e.make = "Please enter the make.";
      if (!formData.model.trim()) e.model = "Please enter the model.";
      if (!formData.plate.trim()) e.plate = "Please enter the license plate.";
    }
    if (s === 3) {
      if (formData.services.length === 0) e.services = "Please select at least one service.";
      if (!formData.urgency) e.urgency = "Please select an urgency level.";
    }
    if (s === 4) {
      if (!formData.prefDate) e.prefDate = "Please select a preferred date.";
      if (!formData.dropoff) e.dropoff = "Please select a drop-off preference.";
    }
    return e;
  }

  function next() {
    const e = validate(step);
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    setStep((s) => s + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function prev() {
    setStep((s) => s - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function submit() {
    const e = validate(4);
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    setLoading(true);

    const formUrl =
      "https://docs.google.com/forms/d/e/1FAIpQLSclbwqw9Nn3Z0KJAeEdx2cFyd05hkJojY7eaeVzpzsNyqlWzw/formResponse";

    const gf = new FormData();
    gf.append("entry.1052484752", formData.firstName);
    gf.append("entry.719180244",  formData.lastName);
    gf.append("entry.728392937",  formData.phone);
    gf.append("entry.183730933",  formData.email);
    gf.append("entry.1124907674", formData.referral);
    gf.append("entry.1746240739", formData.make);
    gf.append("entry.940962336",  formData.model);
    gf.append("entry.571064245",  formData.year);
    gf.append("entry.75954403",   formData.variant);
    gf.append("entry.177631902",  formData.colour);
    gf.append("entry.1827780597", formData.vin);
    gf.append("entry.2047060028", formData.plate);
    gf.append("entry.1309878731", formData.mileage);
    gf.append("entry.1258598222", formData.transmission);
    gf.append("entry.475270691",  formData.fuelType);
    gf.append("entry.1135185727", formData.returning);
    gf.append("entry.300350345",  formData.services.join(", "));
    gf.append("entry.780648947",  formData.urgency);
    gf.append("entry.1398947822", formData.issueDesc);
    gf.append("entry.929568476",  formData.warningLights);
    gf.append("entry.1648734725", formData.prefDate);
    gf.append("entry.51356322",   formData.prefTime);
    gf.append("entry.177036290",  formData.altDate);
    gf.append("entry.1451392435", formData.dropoff);
    gf.append("entry.794702449",  formData.additionalNotes);

    try {
      await fetch(formUrl, { method: "POST", mode: "no-cors", body: gf });
    } finally {
      setRefNum("VIT-" + Date.now().toString(36).toUpperCase().slice(-6));
      setLoading(false);
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  // ── Confirmation ──────────────────────────────────────────────────────────

  if (submitted) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-md w-full"
        >
          <div className="w-20 h-20 rounded-full bg-green-500/15 border border-green-500/60
                          flex items-center justify-center mx-auto mb-8 text-3xl text-green-400">
            ✓
          </div>
          <h2 className="font-[Rajdhani] text-4xl font-bold tracking-wider mb-4">Booking Received</h2>
          <p className="text-white/60 leading-relaxed mb-8">
            Thanks, <strong className="text-white">{formData.firstName}</strong>! We've received your service
            request and will confirm your appointment within 2 business hours.
          </p>
          <div className="inline-block bg-white/5 border border-white/10 px-8 py-4 mb-3
                          font-[Rajdhani] tracking-[0.2em] text-xl text-purple-400 rounded-sm">
            {refNum}
          </div>
          <p className="text-white/30 text-xs mb-10">Bring this reference when you come in.</p>
          <button
            onClick={onBack}
            className="flex items-center gap-2 mx-auto text-white/40 hover:text-white transition-colors text-sm"
          >
            <FaArrowLeft className="text-xs" /> Back to Vitesse
          </button>
        </motion.div>
      </div>
    );
  }

  // ── Page Shell ────────────────────────────────────────────────────────────

  return (
    <div className="relative min-h-screen bg-black text-white font-sans overflow-x-hidden">

      {/* Grid texture */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0 opacity-10"
        style={{
          backgroundImage: `
            repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(255,255,255,0.05) 40px, rgba(255,255,255,0.05) 41px),
            repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(255,255,255,0.05) 40px, rgba(255,255,255,0.05) 41px)
          `,
        }}
      />

      <div className="relative z-10 max-w-3xl mx-auto px-4 py-16 pb-28">

        {/* Header */}
        <header className="mb-14 pb-8 border-b border-white/10">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-white/40 hover:text-white transition-colors text-sm mb-8"
          >
            <FaArrowLeft className="text-xs" /> Back to Vitesse
          </button>
          <img src="/vitesse.jpg" alt="Vitesse Performance" className="h-10 w-auto mb-5" />
          <h1 className="font-[Rajdhani] text-5xl font-bold tracking-wide">
            Book a <span className="text-purple-500">Service</span>
          </h1>
          <p className="text-white/45 mt-2 text-sm leading-relaxed">
            Complete the form below and our team will confirm your appointment within 2 business hours.
          </p>
        </header>

        {/* Step progress */}
        <div className="relative flex mb-12">
          <div className="absolute top-4 left-4 right-4 h-px bg-white/10 z-0" />
          {STEPS.map((s, i) => {
            const n = i + 1;
            const isActive = n === step;
            const isDone = n < step;
            return (
              <div key={s.num} className="flex-1 flex flex-col items-center gap-2 relative z-10">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium
                                 transition-all duration-300
                                 ${isActive
                                   ? "bg-purple-600 text-white shadow-[0_0_20px_rgba(147,51,234,0.5)]"
                                   : isDone
                                   ? "bg-black border border-purple-500 text-purple-400"
                                   : "bg-zinc-900 border border-white/10 text-white/25"}`}>
                  {isDone ? <FaCheck className="text-[9px]" /> : s.num}
                </div>
                <span className={`hidden sm:block text-[10px] tracking-widest uppercase transition-colors
                                  ${isActive ? "text-purple-400" : isDone ? "text-white/35" : "text-white/20"}`}>
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Form steps */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.28, ease: "easeOut" as const }}
          >

            {/* ── STEP 1: Your Details ─────────────────────────────────── */}
            {step === 1 && (
              <div>
                <SectionHeader num="01" title="Your Details" sub="How can we reach you about your booking?" />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <FieldLabel>First Name <Required /></FieldLabel>
                    <input type="text" value={formData.firstName} placeholder="First name" autoComplete="given-name"
                      onChange={(e) => setField("firstName", e.target.value)}
                      className={inputCls(errors, "firstName")} />
                    <FieldError msg={errors.firstName} />
                  </div>
                  <div>
                    <FieldLabel>Last Name <Required /></FieldLabel>
                    <input type="text" value={formData.lastName} placeholder="Last name" autoComplete="family-name"
                      onChange={(e) => setField("lastName", e.target.value)}
                      className={inputCls(errors, "lastName")} />
                    <FieldError msg={errors.lastName} />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <FieldLabel>Phone Number <Required /></FieldLabel>
                    <input type="tel" value={formData.phone} placeholder="Phone number" autoComplete="tel"
                      onChange={(e) => setField("phone", e.target.value)}
                      className={inputCls(errors, "phone")} />
                    <FieldError msg={errors.phone} />
                  </div>
                  <div>
                    <FieldLabel>Email Address <Required /></FieldLabel>
                    <input type="email" value={formData.email} placeholder="Email address" autoComplete="email"
                      onChange={(e) => setField("email", e.target.value)}
                      className={inputCls(errors, "email")} />
                    <FieldError msg={errors.email} />
                  </div>
                </div>

                <div className="mb-4">
                  <FieldLabel>How did you hear about us?</FieldLabel>
                  <CustomSelect
                    value={formData.referral}
                    onChange={(v) => setField("referral", v)}
                    options={["Google / Search", "Social Media", "Friend / Family Referral", "Roadside Signage", "Repeat Customer", "Other"]}
                    placeholder="Select an option"
                  />
                </div>

                <NavRow>
                  <span />
                  <PrimaryBtn onClick={next}>Next — Vehicle →</PrimaryBtn>
                </NavRow>
              </div>
            )}

            {/* ── STEP 2: Vehicle Details ──────────────────────────────── */}
            {step === 2 && (
              <div>
                <SectionHeader num="02" title="Vehicle Details" sub="Tell us about the vehicle we'll be working on." />

                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div>
                    <FieldLabel>Year <Required /></FieldLabel>
                    <input type="number" value={formData.year} placeholder="Year" min="1980" max="2026"
                      onChange={(e) => setField("year", e.target.value)}
                      className={inputCls(errors, "year")} />
                    <FieldError msg={errors.year} />
                  </div>
                  <div>
                    <FieldLabel>Make <Required /></FieldLabel>
                    <input type="text" value={formData.make} placeholder="Manufacturer"
                      onChange={(e) => setField("make", e.target.value)}
                      className={inputCls(errors, "make")} />
                    <FieldError msg={errors.make} />
                  </div>
                  <div>
                    <FieldLabel>Model <Required /></FieldLabel>
                    <input type="text" value={formData.model} placeholder="Model name"
                      onChange={(e) => setField("model", e.target.value)}
                      className={inputCls(errors, "model")} />
                    <FieldError msg={errors.model} />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <FieldLabel>Variant / Trim</FieldLabel>
                    <input type="text" value={formData.variant} placeholder="Trim or variant"
                      onChange={(e) => setField("variant", e.target.value)}
                      className={inputCls(errors, "variant")} />
                  </div>
                  <div>
                    <FieldLabel>Colour</FieldLabel>
                    <input type="text" value={formData.colour} placeholder="Vehicle colour"
                      onChange={(e) => setField("colour", e.target.value)}
                      className={inputCls(errors, "colour")} />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <FieldLabel>VIN (optional)</FieldLabel>
                    <input type="text" value={formData.vin} placeholder="VIN number" maxLength={17}
                      onChange={(e) => setField("vin", e.target.value.toUpperCase())}
                      className={inputCls(errors, "vin")} />
                    <p className="text-white/25 text-xs mt-1 italic">Speeds up parts ordering.</p>
                  </div>
                  <div>
                    <FieldLabel>License Plate <Required /></FieldLabel>
                    <input type="text" value={formData.plate} placeholder="License plate"
                      onChange={(e) => setField("plate", e.target.value.toUpperCase())}
                      className={inputCls(errors, "plate")} />
                    <FieldError msg={errors.plate} />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <FieldLabel>Current Mileage (km)</FieldLabel>
                    <input type="number" value={formData.mileage} placeholder="Mileage in km"
                      onChange={(e) => setField("mileage", e.target.value)}
                      className={inputCls(errors, "mileage")} />
                  </div>
                  <div>
                    <FieldLabel>Transmission</FieldLabel>
                    <CustomSelect
                      value={formData.transmission}
                      onChange={(v) => setField("transmission", v)}
                      options={["Automatic", "Manual", "CVT", "Semi-Automatic", "Not Sure"]}
                      placeholder="Select type"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <FieldLabel>Fuel Type</FieldLabel>
                    <CustomSelect
                      value={formData.fuelType}
                      onChange={(v) => setField("fuelType", v)}
                      options={["Petrol", "Diesel", "Hybrid", "Electric", "LPG"]}
                      placeholder="Select type"
                    />
                  </div>
                  <div>
                    <FieldLabel>Previous Service at Vitesse?</FieldLabel>
                    <CustomSelect
                      value={formData.returning}
                      onChange={(v) => setField("returning", v)}
                      options={["No — first visit", "Yes — returning customer"]}
                      placeholder="Select"
                    />
                  </div>
                </div>

                <NavRow>
                  <GhostBtn onClick={prev}>← Back</GhostBtn>
                  <PrimaryBtn onClick={next}>Next — Service →</PrimaryBtn>
                </NavRow>
              </div>
            )}

            {/* ── STEP 3: Service Required ─────────────────────────────── */}
            {step === 3 && (
              <div>
                <SectionHeader num="03" title="Service Required" sub="What can we help you with today?" />

                <FieldLabel>Service Type <Required /> — select all that apply</FieldLabel>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 mb-1">
                  {SERVICE_OPTIONS.map((s) => {
                    const active = formData.services.includes(s.value);
                    return (
                      <button key={s.value} type="button" onClick={() => toggleService(s.value)}
                        className={`flex items-center gap-3 px-4 py-3 border rounded-sm text-sm text-left
                                    transition-all duration-200
                                    ${active
                                      ? "border-purple-500 bg-purple-600/15 text-white"
                                      : "border-white/10 bg-white/5 text-white/55 hover:border-white/20 hover:text-white/80"}`}>
                        <span className="text-base">{s.icon}</span>
                        <span>{s.value}</span>
                      </button>
                    );
                  })}
                </div>
                <FieldError msg={errors.services} />

                <Divider />

                <FieldLabel>Urgency Level <Required /></FieldLabel>
                <div className="grid grid-cols-3 gap-3 mt-2 mb-1">
                  {URGENCY.map((u) => (
                    <button key={u.val} type="button" onClick={() => setField("urgency", u.val)}
                      className={`flex flex-col items-center gap-1 px-3 py-4 border rounded-sm text-center
                                  transition-all duration-200
                                  ${formData.urgency === u.val
                                    ? u.active
                                    : "border-white/10 bg-white/5 hover:border-white/20"}`}>
                      <span className="text-xl">{u.icon}</span>
                      <span className="text-xs font-semibold uppercase tracking-widest text-white/70">{u.title}</span>
                      <span className="text-[10px] text-white/30">{u.desc}</span>
                    </button>
                  ))}
                </div>
                <FieldError msg={errors.urgency} />

                <Divider />

                <div className="mb-4">
                  <FieldLabel>Describe the Issue / Symptoms</FieldLabel>
                  <textarea value={formData.issueDesc} rows={4}
                    placeholder="Describe any symptoms, noises, warning lights, or concerns you've noticed — include when it started and how often it occurs."
                    onChange={(e) => setField("issueDesc", e.target.value)}
                    className={inputCls(errors, "issueDesc") + " resize-y"} />
                  <p className="text-white/25 text-xs mt-1 italic">The more detail you provide, the better we can prepare for your visit.</p>
                </div>

                <div className="mb-4">
                  <FieldLabel>Warning Lights on Dashboard?</FieldLabel>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {WARNING_LIGHTS.map((light) => (
                      <button key={light} type="button" onClick={() => setField("warningLights", light)}
                        className={`px-4 py-2 border rounded-sm text-xs tracking-wide transition-all duration-200
                                    ${formData.warningLights === light
                                      ? "border-purple-500 bg-purple-600/15 text-white"
                                      : "border-white/10 bg-white/5 text-white/45 hover:border-white/20 hover:text-white/70"}`}>
                        {light}
                      </button>
                    ))}
                  </div>
                </div>

                <NavRow>
                  <GhostBtn onClick={prev}>← Back</GhostBtn>
                  <PrimaryBtn onClick={next}>Next — Appointment →</PrimaryBtn>
                </NavRow>
              </div>
            )}

            {/* ── STEP 4: Appointment ──────────────────────────────────── */}
            {step === 4 && (
              <div>
                <SectionHeader num="04" title="Appointment" sub="Choose your preferred slot and drop-off preference." />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <FieldLabel>Preferred Date <Required /></FieldLabel>
                    <input type="date" value={formData.prefDate} min={minDate}
                      onChange={(e) => setField("prefDate", e.target.value)}
                      style={{ colorScheme: "dark" }}
                      className={inputCls(errors, "prefDate")} />
                    <FieldError msg={errors.prefDate} />
                  </div>
                  <div>
                    <FieldLabel>Preferred Time</FieldLabel>
                    <CustomSelect
                      value={formData.prefTime}
                      onChange={(v) => setField("prefTime", v)}
                      options={TIME_SLOTS}
                      placeholder="Select a time slot"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <FieldLabel>Alternate Date (if first choice unavailable)</FieldLabel>
                  <input type="date" value={formData.altDate} min={minDate}
                    onChange={(e) => setField("altDate", e.target.value)}
                    style={{ colorScheme: "dark" }}
                    className={inputCls(errors, "altDate")} />
                </div>

                <Divider />

                <FieldLabel>Drop-off Preference <Required /></FieldLabel>
                <div className="flex flex-col gap-3 mt-2 mb-1">
                  {DROPOFF_OPTIONS.map((d) => (
                    <button key={d.value} type="button" onClick={() => setField("dropoff", d.value)}
                      className={`flex items-start gap-4 px-5 py-4 border rounded-sm text-left
                                  transition-all duration-200
                                  ${formData.dropoff === d.value
                                    ? "border-purple-500 bg-purple-600/15"
                                    : "border-white/10 bg-white/5 hover:border-white/20"}`}>
                      <span className="text-xl mt-0.5">{d.icon}</span>
                      <div>
                        <p className="text-sm font-medium text-white">{d.label}</p>
                        <p className="text-xs text-white/40 mt-0.5">{d.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
                <FieldError msg={errors.dropoff} />

                <Divider />

                <div className="mb-4">
                  <FieldLabel>Additional Notes for Our Team</FieldLabel>
                  <textarea value={formData.additionalNotes} rows={3}
                    placeholder="Any additional information — preferred contact times, access instructions, work budget limits, collection deadline, etc."
                    onChange={(e) => setField("additionalNotes", e.target.value)}
                    className={inputCls(errors, "additionalNotes") + " resize-y"} />
                </div>

                <NavRow>
                  <GhostBtn onClick={prev}>← Back</GhostBtn>
                  <PrimaryBtn onClick={submit} loading={loading}>
                    {loading ? "Submitting…" : "Confirm Booking ✓"}
                  </PrimaryBtn>
                </NavRow>
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
