import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Phone, Clock, MapPin, Star, CheckCircle, Droplets, Flame, Wrench, ChevronDown, Menu, X, ArrowRight, Shield, Award, Zap } from "lucide-react";

function useCounter(target: number, duration = 1800, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const step = (ts: number) => {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(ease * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return count;
}

const PHONE = "+353 87 357 5184";
const PHONE_DISPLAY = "087 357 5184";

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

function FadeUp({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const { ref, inView } = useInView();
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 36 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const reviews = [
  {
    name: "Julia Soliwoda",
    rating: 5,
    date: "3 months ago",
    text: "Richie is amazing!!! I called panicking at 6 pm with an emergency leak — clogged toilet, damaged pipe. He assured me to stay calm, told me not to flush, and came first thing in the morning to fix it. Very fair with prices!",
    photos: 5,
  },
  {
    name: "Dave Carr",
    rating: 5,
    date: "6 months ago",
    text: "After being let down by several other plumbers, I called Richie. My 85-year-old Dad had no heating for 2 weeks. Richie said he'd try to call next day — and he actually showed up. Brilliant service, genuine man.",
    photos: 0,
  },
  {
    name: "Mark McCahey",
    rating: 5,
    date: "8 months ago",
    text: "Called Richie on a Sunday morning with a burst pipe. Had it sorted within two hours. Professional, tidy, and the price was very reasonable. Would highly recommend to anyone in Kilkenny.",
    photos: 0,
  },
];

const services = [
  { icon: Droplets, label: "Emergency Leaks", desc: "Burst pipes, clogged drains, overflow damage — stopped fast, any hour." },
  { icon: Flame, label: "Heating Systems", desc: "Boiler repairs, heating system installs, and full central heating solutions." },
  { icon: Wrench, label: "Kitchen & Bathroom", desc: "Sink repairs, toilet fixes, bathroom fits — done right the first time." },
  { icon: Zap, label: "Radiator Work", desc: "Radiator replacements, power flushing, and balancing for efficient heat." },
];

const stats = [
  { value: "104", label: "5-Star Reviews" },
  { value: "24/7", label: "Available" },
  { value: "15+", label: "Years Experience" },
  { value: "100%", label: "Fair Pricing" },
];

const HEADLINE_WORDS = ["YOUR", "EMERGENCY", "PLUMBER", "IN KILKENNY"];

function AnimatedWord({ word, delay, accent = false }: { word: string; delay: number; accent?: boolean }) {
  return (
    <span className="inline-block overflow-hidden leading-none">
      <motion.span
        className={`inline-block ${accent ? "text-primary" : ""}`}
        initial={{ y: "110%", opacity: 0 }}
        animate={{ y: "0%", opacity: 1 }}
        transition={{ duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] }}
      >
        {word}
      </motion.span>
    </span>
  );
}

function CounterStat({ value, label, suffix = "", delay }: { value: number; label: string; suffix?: string; delay: number }) {
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const t = setTimeout(() => setStarted(true), delay * 1000);
    return () => clearTimeout(t);
  }, [delay]);
  const count = useCounter(value, 1600, started);
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-sm p-5 flex flex-col gap-1 overflow-hidden group hover:border-primary/40 transition-all duration-300"
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      />
      <span className="relative text-primary font-black leading-none tabular-nums" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "2.6rem" }}>
        {count}{suffix}
      </span>
      <span className="relative text-muted-foreground text-sm">{label}</span>
    </motion.div>
  );
}

function Ripple({ x, y, id }: { x: number; y: number; id: number }) {
  return (
    <motion.div
      key={id}
      className="absolute rounded-full border border-primary/40 pointer-events-none"
      style={{ left: x, top: y, translateX: "-50%", translateY: "-50%" }}
      initial={{ width: 0, height: 0, opacity: 0.8 }}
      animate={{ width: 180, height: 180, opacity: 0 }}
      transition={{ duration: 1.4, ease: "easeOut" }}
    />
  );
}

function HeroSection({ scrollTo }: { scrollTo: (id: string) => void }) {
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([]);
  const [imgLoaded, setImgLoaded] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const rippleId = useRef(0);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (Math.random() > 0.06) return;
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;
    rippleId.current++;
    const id = rippleId.current;
    setRipples(r => [...r.slice(-8), { x: e.clientX - rect.left, y: e.clientY - rect.top, id }]);
  };

  return (
    <section
      id="hero"
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-screen flex items-center overflow-hidden cursor-crosshair"
    >
      {/* Background image with reveal */}
      <motion.div
        className="absolute inset-0 z-0"
        initial={{ scale: 1.08 }}
        animate={{ scale: imgLoaded ? 1 : 1.08 }}
        transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <img
          src="https://images.unsplash.com/photo-1676210134188-4c05dd172f89?w=1600&h=1000&fit=crop&auto=format"
          alt="Plumber working on pipes"
          onLoad={() => setImgLoaded(true)}
          className="w-full h-full object-cover"
          style={{ opacity: imgLoaded ? 0.28 : 0, transition: "opacity 1s ease" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0b1523] via-[#0b1523]/80 to-[#0b1523]/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b1523] via-transparent to-[#0b1523]/30" />
      </motion.div>

      {/* Animated pipe grid — horizontal flowing lines */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {[...Array(7)].map((_, i) => (
          <motion.div
            key={`h-${i}`}
            className="absolute h-px"
            style={{
              top: `${12 + i * 13}%`,
              left: 0, right: 0,
              background: "linear-gradient(90deg, transparent 0%, rgba(232,92,13,0.18) 40%, rgba(232,92,13,0.35) 50%, rgba(232,92,13,0.18) 60%, transparent 100%)",
            }}
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: [0, 1, 1, 0], opacity: [0, 0.6, 0.6, 0], x: ["-100%", "-100%", "100%", "100%"] }}
            transition={{ duration: 5 + i * 0.9, repeat: Infinity, delay: i * 0.7, ease: "easeInOut", times: [0, 0.1, 0.9, 1] }}
          />
        ))}
        {/* Vertical accent lines */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={`v-${i}`}
            className="absolute w-px"
            style={{
              left: `${15 + i * 18}%`,
              top: 0, bottom: 0,
              background: "linear-gradient(180deg, transparent 0%, rgba(232,92,13,0.12) 40%, rgba(232,92,13,0.22) 50%, rgba(232,92,13,0.12) 60%, transparent 100%)",
            }}
            animate={{ scaleY: [0.2, 1, 0.2], opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 6 + i * 1.2, repeat: Infinity, delay: i * 1.1, ease: "easeInOut" }}
          />
        ))}
        {/* Glowing dot nodes at intersections */}
        {[
          [15, 12], [33, 25], [51, 38], [69, 51], [15, 64], [33, 77],
        ].map(([lp, tp], i) => (
          <motion.div
            key={`dot-${i}`}
            className="absolute w-1.5 h-1.5 rounded-full bg-primary"
            style={{ left: `${lp}%`, top: `${tp}%` }}
            animate={{ opacity: [0, 1, 0], scale: [0.5, 1.5, 0.5] }}
            transition={{ duration: 3, repeat: Infinity, delay: i * 0.6, ease: "easeInOut" }}
          />
        ))}
      </div>

      {/* Mouse ripples */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <AnimatePresence>
          {ripples.map(r => <Ripple key={r.id} x={r.x} y={r.y} id={r.id} />)}
        </AnimatePresence>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-24 pb-16 grid md:grid-cols-2 gap-12 items-center w-full">
        <div>
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="inline-flex items-center gap-2 bg-primary/15 border border-primary/30 text-primary px-3 py-1.5 rounded-sm text-xs font-semibold uppercase tracking-widest mb-6"
          >
            <motion.div
              className="w-1.5 h-1.5 bg-primary rounded-full"
              animate={{ opacity: [1, 0.3, 1], scale: [1, 1.4, 1] }}
              transition={{ duration: 1.6, repeat: Infinity }}
            />
            Available 24 Hours · Kilkenny, Ireland
          </motion.div>

          {/* Headline — word-by-word reveal */}
          <h1
            className="text-foreground leading-none mb-6"
            style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "clamp(3rem, 8vw, 5.5rem)", fontWeight: 800, letterSpacing: "-0.01em" }}
          >
            <span className="block">
              <AnimatedWord word="YOUR" delay={0.25} />{" "}
              <AnimatedWord word="EMERGENCY" delay={0.38} />
            </span>
            <span className="block">
              <AnimatedWord word="PLUMBER" delay={0.52} accent />
            </span>
            <span className="block">
              <AnimatedWord word="IN" delay={0.66} />{" "}
              <AnimatedWord word="KILKENNY" delay={0.76} />
            </span>
          </h1>

          {/* Animated underline */}
          <motion.div
            className="h-0.5 bg-gradient-to-r from-primary via-orange-400 to-transparent mb-6"
            initial={{ scaleX: 0, originX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.9, delay: 1.0, ease: [0.22, 1, 0.36, 1] }}
            style={{ width: "60%" }}
          />

          {/* Body copy */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="text-muted-foreground text-lg leading-relaxed mb-8 max-w-md"
          >
            Richie is on call around the clock — leaks, heating, or blockages.
            Trusted by over 104 customers across Kilkenny with a perfect 5-star record.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.05, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col sm:flex-row gap-4 mb-8"
          >
            <motion.a
              href={`tel:${PHONE}`}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="relative group flex items-center justify-center gap-3 bg-primary text-white px-8 py-4 rounded-sm font-bold text-lg overflow-hidden shadow-lg shadow-primary/40"
              style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.04em" }}
            >
              {/* Shimmer sweep */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
                animate={{ x: ["-150%", "250%"] }}
                transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 1.5 }}
              />
              <motion.div
                animate={{ rotate: [0, -15, 15, 0] }}
                transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 2 }}
              >
                <Phone className="w-5 h-5" />
              </motion.div>
              CALL {PHONE_DISPLAY}
            </motion.a>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => scrollTo("services")}
              className="flex items-center justify-center gap-2 border border-border hover:border-primary/50 text-foreground px-8 py-4 rounded-sm font-semibold transition-colors duration-200 hover:bg-white/5"
            >
              Our Services
              <motion.span animate={{ x: [0, 4, 0] }} transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}>
                <ArrowRight className="w-4 h-4" />
              </motion.span>
            </motion.button>
          </motion.div>

          {/* Stars */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="flex items-center gap-4 pt-6 border-t border-border"
          >
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0, rotate: -30 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  transition={{ duration: 0.4, delay: 1.3 + i * 0.08, ease: [0.34, 1.56, 0.64, 1] }}
                >
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                </motion.div>
              ))}
            </div>
            <span className="text-muted-foreground text-sm">
              <span className="text-foreground font-semibold">5.0</span> · 104 verified Google reviews
            </span>
          </motion.div>
        </div>

        {/* Stats panel */}
        <div className="hidden md:grid grid-cols-2 gap-4">
          <CounterStat value={104} label="5-Star Reviews" delay={0.7} />
          <CounterStat value={24} suffix="/7" label="Hours Available" delay={0.85} />
          <CounterStat value={15} suffix="+" label="Years Experience" delay={1.0} />
          <CounterStat value={100} suffix="%" label="Fair Pricing" delay={1.15} />
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.button
        onClick={() => scrollTo("services")}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 text-muted-foreground hover:text-foreground flex flex-col items-center gap-1.5 text-xs tracking-widest uppercase"
      >
        <motion.span
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Scroll
        </motion.span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </motion.button>
    </section>
  );
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeReview, setActiveReview] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setActiveReview(i => (i + 1) % reviews.length), 5000);
    return () => clearInterval(t);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden" style={{ fontFamily: "'DM Sans', sans-serif" }}>

      {/* Nav */}
      <motion.nav
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-[#0b1523]/95 backdrop-blur-md border-b border-border shadow-xl shadow-black/30" : "bg-transparent"}`}
      >
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <button onClick={() => scrollTo("hero")} className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 bg-primary rounded-sm flex items-center justify-center">
              <Droplets className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight" style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.02em" }}>
              PLUMBING <span className="text-primary">IRELAND</span>
            </span>
          </button>

          <div className="hidden md:flex items-center gap-8">
            {["Services", "About", "Reviews", "Contact"].map(item => (
              <button
                key={item}
                onClick={() => scrollTo(item.toLowerCase())}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 tracking-wide"
              >
                {item}
              </button>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <a href={`tel:${PHONE}`} className="flex items-center gap-2 bg-primary hover:bg-orange-600 text-white px-4 py-2 rounded-sm text-sm font-semibold transition-all duration-200 hover:scale-105 active:scale-100">
              <Phone className="w-3.5 h-3.5" />
              {PHONE_DISPLAY}
            </a>
          </div>

          <button onClick={() => setMenuOpen(o => !o)} className="md:hidden p-2 text-muted-foreground hover:text-foreground">
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-[#0b1523] border-t border-border overflow-hidden"
            >
              <div className="px-6 py-4 flex flex-col gap-4">
                {["Services", "About", "Reviews", "Contact"].map(item => (
                  <button key={item} onClick={() => scrollTo(item.toLowerCase())} className="text-left text-muted-foreground hover:text-foreground py-1">
                    {item}
                  </button>
                ))}
                <a href={`tel:${PHONE}`} className="flex items-center gap-2 bg-primary text-white px-4 py-3 rounded-sm text-sm font-semibold mt-2 justify-center">
                  <Phone className="w-4 h-4" />
                  Call {PHONE_DISPLAY}
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Hero */}
      <HeroSection scrollTo={scrollTo} />

      {/* Trust bar */}
      <div className="bg-primary py-4 overflow-hidden">
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="flex gap-12 whitespace-nowrap"
        >
          {[...Array(2)].map((_, repeat) => (
            <div key={repeat} className="flex gap-12">
              {["24/7 Emergency Response", "5.0 Stars · 104 Reviews", "Kilkenny & Surrounds", "Fair & Transparent Pricing", "Fast Response Times", "Fully Insured"].map(item => (
                <span key={item} className="flex items-center gap-2 text-white font-semibold text-sm uppercase tracking-widest" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                  <span className="w-1 h-1 bg-white/60 rounded-full" />
                  {item}
                </span>
              ))}
            </div>
          ))}
        </motion.div>
      </div>

      {/* Services */}
      <section id="services" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <FadeUp>
            <div className="mb-14">
              <span className="text-primary text-xs font-semibold uppercase tracking-widest">What We Do</span>
              <h2 className="mt-2" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 800, lineHeight: 1 }}>
                EVERY PLUMBING JOB,<br />
                <span className="text-primary">DONE RIGHT.</span>
              </h2>
            </div>
          </FadeUp>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {services.map((svc, i) => (
              <FadeUp key={svc.label} delay={i * 0.1}>
                <div className="group bg-card border border-border rounded-sm p-6 h-full hover:border-primary/40 transition-all duration-300 hover:bg-secondary cursor-default">
                  <div className="w-10 h-10 bg-primary/15 rounded-sm flex items-center justify-center mb-4 group-hover:bg-primary/25 transition-colors">
                    <svc.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-bold text-foreground mb-2" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "1.25rem", letterSpacing: "0.02em" }}>
                    {svc.label}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{svc.desc}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* About / Why Richie */}
      <section id="about" className="py-24 px-6 bg-secondary/30">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <FadeUp>
            <div className="relative">
              <div className="aspect-[4/5] rounded-sm overflow-hidden bg-secondary">
                <img
                  src="https://images.unsplash.com/photo-1676210133055-eab6ef033ce3?w=700&h=875&fit=crop&auto=format"
                  alt="Richie, professional plumber in Kilkenny"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Floating badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="absolute -bottom-5 -right-5 bg-primary text-white p-5 rounded-sm shadow-xl shadow-primary/30"
              >
                <div className="flex mb-1">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-white text-white" />)}
                </div>
                <div className="font-black text-2xl leading-none" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>5.0</div>
                <div className="text-white/80 text-xs mt-0.5">104 Reviews</div>
              </motion.div>
            </div>
          </FadeUp>

          <div>
            <FadeUp delay={0.1}>
              <span className="text-primary text-xs font-semibold uppercase tracking-widest">About Richie</span>
              <h2 className="mt-2 mb-6" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 800, lineHeight: 1.05 }}>
                KILKENNY'S MOST<br />
                <span className="text-primary">TRUSTED PLUMBER</span>
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Based on Bleach Road, Dunmore, Richie has built a reputation across Kilkenny for showing up when it matters most — 6pm emergencies, weekend heating failures, and everything in between. No nonsense, no inflated quotes.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-8">
                With over 15 years of hands-on experience and a spotless 5-star record, Richie is the plumber Kilkenny families call back — and recommend to their neighbours.
              </p>
            </FadeUp>

            <div className="grid grid-cols-1 gap-3">
              {[
                { icon: Clock, text: "Open 24 hours — including weekends and bank holidays" },
                { icon: MapPin, text: "Serving Kilkenny and surrounding areas" },
                { icon: Shield, text: "Fully insured, transparent pricing, no call-out surprises" },
                { icon: Award, text: "5.0 rating across 104 Google reviews" },
              ].map(({ icon: Icon, text }, i) => (
                <FadeUp key={text} delay={0.15 + i * 0.08}>
                  <div className="flex items-start gap-3 p-3 rounded-sm hover:bg-secondary/50 transition-colors">
                    <div className="w-8 h-8 bg-primary/15 rounded-sm flex items-center justify-center shrink-0 mt-0.5">
                      <Icon className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-sm text-muted-foreground leading-relaxed">{text}</span>
                  </div>
                </FadeUp>
              ))}
            </div>

            <FadeUp delay={0.5}>
              <a href={`tel:${PHONE}`} className="mt-8 inline-flex items-center gap-3 bg-primary hover:bg-orange-600 text-white px-7 py-3.5 rounded-sm font-bold transition-all duration-200 hover:scale-105" style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.04em", fontSize: "1.1rem" }}>
                <Phone className="w-4 h-4" />
                CALL RICHIE NOW
              </a>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section id="reviews" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <FadeUp>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-14 gap-4">
              <div>
                <span className="text-primary text-xs font-semibold uppercase tracking-widest">Customer Reviews</span>
                <h2 className="mt-2" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 800, lineHeight: 1 }}>
                  WHAT KILKENNY<br />
                  <span className="text-primary">IS SAYING</span>
                </h2>
              </div>
              <div className="flex items-center gap-3 bg-card border border-border rounded-sm px-5 py-3">
                <div>
                  <div className="flex mb-1">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
                  </div>
                  <div className="text-xs text-muted-foreground">104 Google Reviews</div>
                </div>
                <div className="text-4xl font-black text-foreground ml-2" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>5.0</div>
              </div>
            </div>
          </FadeUp>

          {/* Auto-rotating featured review */}
          <div className="relative mb-6 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeReview}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="bg-card border border-border rounded-sm p-8 md:p-10"
              >
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />)}
                </div>
                <blockquote className="text-foreground text-xl leading-relaxed mb-6 italic" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  &ldquo;{reviews[activeReview].text}&rdquo;
                </blockquote>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-foreground">{reviews[activeReview].name}</div>
                    <div className="text-muted-foreground text-sm">{reviews[activeReview].date} · Google Maps</div>
                  </div>
                  <div className="flex gap-2">
                    {reviews.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveReview(i)}
                        className={`w-2 h-2 rounded-full transition-all duration-200 ${i === activeReview ? "bg-primary w-6" : "bg-border hover:bg-muted-foreground"}`}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Secondary reviews grid */}
          <div className="grid sm:grid-cols-3 gap-4">
            {reviews.map((r, i) => (
              <FadeUp key={r.name} delay={i * 0.1}>
                <div
                  className={`bg-card border rounded-sm p-5 cursor-pointer transition-all duration-200 hover:border-primary/40 ${i === activeReview ? "border-primary/40" : "border-border"}`}
                  onClick={() => setActiveReview(i)}
                >
                  <div className="flex mb-3">
                    {[...Array(r.rating)].map((_, j) => <Star key={j} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />)}
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed mb-3">&ldquo;{r.text}&rdquo;</p>
                  <div className="text-xs font-semibold text-foreground">{r.name}</div>
                  <div className="text-xs text-muted-foreground">{r.date}</div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* Emergency CTA band */}
      <section className="relative py-20 px-6 overflow-hidden bg-primary">
        <div className="absolute inset-0 opacity-10">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-px bg-white"
              style={{ left: `${10 + i * 12}%`, top: 0, bottom: 0 }}
              animate={{ scaleY: [0.4, 1, 0.4], opacity: [0.3, 0.8, 0.3] }}
              transition={{ duration: 3 + i * 0.4, repeat: Infinity, ease: "easeInOut", delay: i * 0.3 }}
            />
          ))}
        </div>
        <div className="relative max-w-4xl mx-auto text-center">
          <FadeUp>
            <div className="inline-flex items-center gap-2 bg-white/20 text-white px-3 py-1.5 rounded-sm text-xs font-semibold uppercase tracking-widest mb-5">
              <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
              Emergency Line — Always Open
            </div>
            <h2 className="text-white mb-4" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "clamp(2.5rem, 7vw, 5rem)", fontWeight: 900, lineHeight: 1 }}>
              GOT A LEAK RIGHT NOW?
            </h2>
            <p className="text-white/80 text-lg mb-8 max-w-lg mx-auto">
              Don't wait. Call Richie directly — he picks up, and he shows up.
            </p>
            <a
              href={`tel:${PHONE}`}
              className="group inline-flex items-center gap-3 bg-white text-primary hover:bg-white/90 px-10 py-5 rounded-sm font-black text-2xl transition-all duration-200 hover:scale-105 active:scale-100 shadow-2xl"
              style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.04em" }}
            >
              <Phone className="w-6 h-6 group-hover:animate-bounce" />
              {PHONE_DISPLAY}
            </a>
          </FadeUp>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-24 px-6 bg-secondary/30">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-start">
          <FadeUp>
            <span className="text-primary text-xs font-semibold uppercase tracking-widest">Get In Touch</span>
            <h2 className="mt-2 mb-6" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 800, lineHeight: 1.05 }}>
              CONTACT<br />
              <span className="text-primary">PLUMBING IRELAND</span>
            </h2>

            <div className="space-y-4 mb-8">
              {[
                { icon: Phone, label: "Phone", value: PHONE_DISPLAY, href: `tel:${PHONE}` },
                { icon: MapPin, label: "Address", value: "Bleach Road, Dunmore, Kilkenny, R95 YX43", href: "https://maps.google.com" },
                { icon: Clock, label: "Hours", value: "Open 24 Hours · 7 Days a Week", href: null },
              ].map(({ icon: Icon, label, value, href }) => (
                <div key={label} className="flex items-start gap-4 p-4 bg-card border border-border rounded-sm">
                  <div className="w-9 h-9 bg-primary/15 rounded-sm flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">{label}</div>
                    {href ? (
                      <a href={href} className="text-foreground font-medium hover:text-primary transition-colors">{value}</a>
                    ) : (
                      <div className="text-foreground font-medium">{value}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
              <span className="text-muted-foreground text-sm ml-1">Rated 5.0 on Google Maps</span>
            </div>
          </FadeUp>

          <FadeUp delay={0.15}>
            <form
              onSubmit={e => { e.preventDefault(); alert("Thanks! Richie will be in touch shortly. For emergencies call " + PHONE_DISPLAY); }}
              className="bg-card border border-border rounded-sm p-8 space-y-4"
            >
              <h3 className="font-bold text-lg mb-1" style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.04em", fontSize: "1.4rem" }}>
                SEND A MESSAGE
              </h3>
              <p className="text-muted-foreground text-sm mb-4">For emergencies, please call directly.</p>

              {[
                { id: "name", label: "Your Name", type: "text", placeholder: "John Murphy" },
                { id: "phone", label: "Phone Number", type: "tel", placeholder: "086 000 0000" },
                { id: "email", label: "Email Address", type: "email", placeholder: "john@example.com" },
              ].map(f => (
                <div key={f.id}>
                  <label htmlFor={f.id} className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">{f.label}</label>
                  <input
                    id={f.id}
                    type={f.type}
                    placeholder={f.placeholder}
                    className="w-full bg-secondary border border-border text-foreground placeholder:text-muted-foreground/50 px-3.5 py-2.5 rounded-sm text-sm focus:outline-none focus:border-primary/60 transition-colors"
                  />
                </div>
              ))}

              <div>
                <label htmlFor="message" className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">Message</label>
                <textarea
                  id="message"
                  rows={4}
                  placeholder="Describe the problem..."
                  className="w-full bg-secondary border border-border text-foreground placeholder:text-muted-foreground/50 px-3.5 py-2.5 rounded-sm text-sm focus:outline-none focus:border-primary/60 transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-primary hover:bg-orange-600 text-white py-3.5 rounded-sm font-bold transition-all duration-200 hover:scale-[1.02] active:scale-100"
                style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.06em", fontSize: "1.1rem" }}
              >
                SEND MESSAGE
              </button>
            </form>
          </FadeUp>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-primary rounded-sm flex items-center justify-center">
              <Droplets className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold tracking-tight" style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.02em" }}>
              PLUMBING <span className="text-primary">IRELAND</span>
            </span>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-4 text-sm text-muted-foreground">
            <span>Bleach Road, Dunmore, Kilkenny</span>
            <span className="hidden md:block text-border">·</span>
            <a href={`tel:${PHONE}`} className="hover:text-primary transition-colors">{PHONE_DISPLAY}</a>
            <span className="hidden md:block text-border">·</span>
            <span>Open 24 Hours</span>
          </div>

          <div className="flex items-center gap-1.5">
            {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />)}
            <span className="text-muted-foreground text-xs ml-1">5.0 · 104 reviews</span>
          </div>
        </div>

        <div className="max-w-6xl mx-auto mt-6 pt-6 border-t border-border text-center text-xs text-muted-foreground">
          © 2024 Plumbing Ireland · Kilkenny, Ireland · All rights reserved
        </div>
      </footer>
    </div>
  );
}
