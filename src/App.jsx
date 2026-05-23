import React, { useState } from "react";
import axios from "axios";
import { Link2, Copy, Check, QrCode, Zap, ShieldCheck, BarChart3, Menu, X, Globe, Lock, ArrowRight, CornerDownRight } from "lucide-react";

export default function App() {
  const [longUrl, setLongUrl] = useState("");
  // Initial array ko khali rakh rahe hain taake database entries yahan append hon
  const [shortenedLinks, setShortenedLinks] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [isShortening, setIsShortening] = useState(false);
  const [qrCodeModal, setQrCodeModal] = useState(null); 
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Base URL definition (.env fallback mechanism)
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5050";

  // Actual Axios Shorten Action
  const handleShorten = async (e) => {
    e.preventDefault();
    if (!longUrl.trim()) return;

    setIsShortening(true);
    setErrorMessage("");

    try {
      // Direct API invocation without fake delay automation
      const response = await axios.post(`${BACKEND_URL}/save`, { longUrl });

      if (response.data.ok) {
        const newLink = {
          id: Date.now().toString(), // local list rendering key
          original: longUrl,
          short: response.data.shortURL // live database shortened domain link
        };

        setShortenedLinks([newLink, ...shortenedLinks]);
        setShowResult(true);
        setLongUrl("");
      } else {
        setErrorMessage("Failed to shorten link. Try again.");
      }
    } catch (err) {
      console.error("API Connection Error:", err);
      setErrorMessage("Backend server unreachable.");
    } finally {
      setIsShortening(false);
    }
  };

  // Clipboard functionality
  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(id);
      setTimeout(() => {
        setCopiedId(null);
      }, 2000);
    });
  };

  return (
    <div className="font-sans min-h-screen bg-surface text-on-surface selection:bg-primary/20 selection:text-primary overflow-x-hidden antialiased flex flex-col">
      
      {/* TopNavBar */}
      <header className="bg-surface/90 backdrop-blur-md sticky top-0 z-50 border-b border-outline-variant transition-all duration-200">
        <nav className="flex justify-between items-center w-full h-20 px-6 max-w-[1248px] mx-auto">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white">
              <Link2 size={18} className="rotate-45" />
            </div>
            <span className="font-display text-2xl font-bold text-primary tracking-tight">ShortenIt</span>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-10">
            <a href="#" className="text-primary font-semibold border-b-2 border-primary pb-1 font-sans text-sm">Features</a>
            <a href="#" className="text-on-surface-variant font-medium text-sm hover:text-primary transition-colors duration-200">Solutions</a>
            <a href="#" className="text-on-surface-variant font-medium text-sm hover:text-primary transition-colors duration-200">Pricing</a>
            <a href="#" className="text-on-surface-variant font-medium text-sm hover:text-primary transition-colors duration-200">Enterprise</a>
          </div>

          {/* Actions */}
          <div className="hidden sm:flex items-center gap-6">
            <button className="text-on-surface font-semibold text-sm hover:text-primary hover:opacity-100 opacity-90 transition-all cursor-pointer">
              Log In
            </button>
            <button className="bg-primary-container text-on-primary font-semibold text-sm px-6 py-2.5 rounded-lg hover:bg-primary transition-all duration-250 cursor-pointer shadow-[0_2px_8px_rgba(79,70,229,0.15)] active:scale-97">
              Sign Up Free
            </button>
          </div>

          {/* Mobile Menu Icon */}
          <button 
            className="md:hidden p-2 text-on-surface hover:text-primary cursor-pointer"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-outline-variant bg-surface px-6 py-6 absolute w-full left-0 top-20 shadow-lg flex flex-col gap-4 animate-in fade-in slide-in-from-top-2 duration-200">
            <a href="#" className="text-primary font-bold text-base py-1">Features</a>
            <a href="#" className="text-on-surface-variant font-medium text-base py-1 hover:text-primary transition-colors">Solutions</a>
            <a href="#" className="text-on-surface-variant font-medium text-base py-1 hover:text-primary transition-colors">Pricing</a>
            <a href="#" className="text-on-surface-variant font-medium text-base py-1 hover:text-primary transition-colors">Enterprise</a>
            <div className="h-px bg-outline-variant my-2" />
            <button className="text-on-surface font-semibold text-base py-2 text-left">Log In</button>
            <button className="bg-primary-container text-on-primary font-semibold text-base py-3 rounded-lg w-full text-center hover:bg-primary transition-colors shadow">
              Sign Up Free
            </button>
          </div>
        )}
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-20 pb-12 px-6 text-center overflow-hidden">
          <div className="absolute inset-0 opacity-10 pointer-events-none" style={{
            backgroundImage: "radial-gradient(#4f46e5 0.5px, transparent 0.5px)",
            backgroundSize: "24px 24px"
          }}></div>

          <div className="max-w-[1248px] mx-auto relative z-10">
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold text-on-surface tracking-tight leading-[1.1] mb-6 max-w-3xl mx-auto">
              Shorten. Share. Track.
            </h1>
            <p className="font-sans text-lg sm:text-xl text-on-surface-variant font-normal leading-relaxed mb-10 max-w-2xl mx-auto">
              Transform long, complex URLs into clean, manageable links. Professional-grade link management for high-performance teams.
            </p>

            {/* URL Input Form */}
            <div className="max-w-3xl mx-auto mb-4">
              <form onSubmit={handleShorten} className="bg-surface-container-lowest p-2 rounded-xl border border-outline-variant/60 flex flex-col md:flex-row gap-2 shadow-[0_4px_20px_rgba(79,70,229,0.06)] focus-within:ring-2 focus-within:ring-primary/40 focus-within:border-primary transition-all">
                <input 
                  type="url"
                  required
                  value={longUrl}
                  onChange={(e) => setLongUrl(e.target.value)}
                  placeholder="Paste your long URL here..."
                  className="flex-1 w-full bg-transparent px-4 py-3 md:py-4 border-none text-base outline-none focus:outline-none placeholder:text-outline text-on-surface"
                />
                <button 
                  type="submit"
                  disabled={isShortening}
                  className="w-full md:w-auto px-10 py-3 md:py-4 bg-primary-container text-on-primary font-semibold text-base rounded-lg hover:bg-primary active:scale-97 transition-all cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap min-w-[180px]"
                >
                  {isShortening ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    "Shorten URL"
                  )}
                </button>
              </form>
            </div>

            {/* Client Side Error Indicator */}
            {errorMessage && (
              <p className="text-red-500 font-medium text-sm mb-6 animate-pulse">{errorMessage}</p>
            )}

            {/* Dynamic Results Card Mapping */}
            {showResult && shortenedLinks.length > 0 && (
              <div className="max-w-2xl mx-auto mb-6 space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {shortenedLinks.map((item) => (
                  <div 
                    key={item.id}
                    className="bg-surface-container-low border border-primary-container/20 hover:border-primary-container/40 rounded-xl p-4 md:p-5 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm group hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-center gap-4 w-full md:w-auto overflow-hidden">
                      <div className="w-10 h-10 shrink-0 bg-primary-fixed flex items-center justify-center rounded-lg text-primary">
                        <Link2 size={18} className="rotate-45" />
                      </div>
                      <div className="text-left overflow-hidden w-full">
                        <span className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider block">Shortened Link</span>
                        <div className="flex flex-col">
                          <span className="text-primary font-bold text-lg leading-tight block truncate sm:max-w-xs md:max-w-md">{item.short}</span>
                          <span className="text-xs text-on-surface-variant/70 truncate block max-w-[240px] md:max-w-[340px] mt-0.5">{item.original}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 w-full md:w-auto">
                      <button 
                        onClick={() => handleCopy(item.id, item.short)}
                        className={`flex-1 md:flex-none flex items-center justify-center gap-2 h-10 px-4 rounded-lg font-medium text-sm border transition-all cursor-pointer ${
                          copiedId === item.id 
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
                            : "bg-surface-container-highest text-on-surface-variant hover:text-primary border-outline-variant hover:border-primary/30"
                        }`}
                      >
                        {copiedId === item.id ? (
                          <>
                            <Check size={14} className="stroke-[3]" />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy size={14} />
                            <span>Copy</span>
                          </>
                        )}
                      </button>

                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Feature Sections & Content Structure */}
        <section className="py-24 px-6 bg-surface-container-low border-y border-outline-variant/40">
          <div className="max-w-[1248px] mx-auto text-center mb-16">
            <span className="text-primary font-bold text-xs uppercase tracking-widest block mb-2">Capabilities</span>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-on-surface mb-4">
              Designed for High-Volume Reliability
            </h2>
            <div className="h-1 w-12 bg-primary mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-[1248px] mx-auto">
            <div className="bg-tertiary-fixed rounded-2xl p-8 border border-outline-variant/30">
              <div className="w-14 h-14 bg-surface-container-lowest rounded-xl flex items-center justify-center mb-6 text-primary">
                <Zap size={24} className="fill-primary text-primary" />
              </div>
              <h3 className="font-display text-xl font-bold text-on-tertiary-fixed mb-3">Simple & Fast</h3>
              <p className="font-sans text-sm text-on-tertiary-fixed-variant leading-relaxed">
                Create and share custom URLs in milliseconds. Our global network ensures instant resolution.
              </p>
            </div>

            <div className="bg-primary-fixed rounded-2xl p-8 border border-outline-variant/30">
              <div className="w-14 h-14 bg-surface-container-lowest rounded-xl flex items-center justify-center mb-6 text-primary">
                <ShieldCheck size={24} className="fill-primary text-primary" />
              </div>
              <h3 className="font-display text-xl font-bold text-on-primary-fixed mb-3">Secure Links</h3>
              <p className="font-sans text-sm text-on-primary-fixed-variant leading-relaxed">
                Enterprise security with automated malware checks and strict parameter encryption limits.
              </p>
            </div>

            <div className="bg-secondary-fixed rounded-2xl p-8 border border-outline-variant/30">
              <div className="w-14 h-14 bg-surface-container-lowest rounded-xl flex items-center justify-center mb-6 text-primary">
                <BarChart3 size={24} className="fill-primary text-primary" />
              </div>
              <h3 className="font-display text-xl font-bold text-on-secondary-fixed mb-3">Analytics Ready</h3>
              <p className="font-sans text-sm text-on-secondary-fixed-variant leading-relaxed">
                Track clicks and monitor routing performance effortlessly with structured schema architecture.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-surface-container-lowest border-t border-outline-variant/60 py-10 px-6">
        <div className="flex flex-col md:flex-row justify-between items-center w-full max-w-[1248px] mx-auto gap-6">
          <div className="flex flex-col items-center md:items-start gap-1">
            <div className="flex items-center gap-1.5">
              <Link2 size={16} className="rotate-45 text-primary" />
              <span className="font-display text-md font-bold text-on-surface">ShortenIt</span>
            </div>
            <p className="font-sans text-xs text-on-surface-variant/80 mt-1">
              © {new Date().getFullYear()} ShortenIt Inc. Precision in every link.
            </p>
          </div>
        </div>
      </footer>

      {/* QR Code Modal Rendering */}
      {qrCodeModal && (
        <div className="fixed inset-0 bg-inverse-surface/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-surface p-6 rounded-2xl max-w-sm w-full border border-outline-variant shadow-2xl relative text-center">
            <button onClick={() => setQrCodeModal(null)} className="absolute top-4 right-4 text-on-surface-variant hover:text-primary p-1.5 rounded-full hover:bg-surface-container">
              <X size={18} />
            </button>
            <h3 className="font-display text-lg font-bold text-on-surface mb-2">Link QR Code</h3>
            <p className="font-sans text-xs text-on-surface-variant mb-6 truncate px-2">{qrCodeModal.short}</p>

            <div className="bg-white p-6 rounded-xl border border-outline-variant inline-block mb-6 shadow-inner mx-auto">
              <svg className="w-40 h-40 text-on-surface" viewBox="0 0 100 100">
                <rect width="100" height="100" fill="none" />
                <path d="M 0 0 h 30 v 30 h -30 z M 10 10 h 10 v 10 h -10 z" fill="currentColor" />
                <path d="M 70 0 h 30 v 30 h -30 z M 80 10 h 10 v 10 h -10 z" fill="currentColor" />
                <path d="M 0 70 h 30 v 30 h -30 z M 10 80 h 10 v 10 h -10 z" fill="currentColor" />
                <path d="M 40 5 h 5 v 5 h -5 z M 50 15 h 10 v 5 h -10 z M 40 25 h 5 v 5 h -5 z M 60 5 h 5 v 10 h -5 z M 55 25 h 5 v 5 h -5 z" fill="currentColor" />
                <path d="M 5 40 h 5 v 5 h -5 z M 15 45 h 10 v 5 h -10 z M 25 40 h 10 v 5 h -10 z M 10 55 h 5 v 10 h -5 z M 30 55 h 5 v 5 h -5 z" fill="currentColor" />
                <path d="M 45 45 h 10 v 10 h -10 z M 60 40 h 5 v 15 h -5 z M 55 60 h 10 v 5 h -10 z" fill="currentColor" />
                <path d="M 75 45 h 10 v 5 h -10 z M 80 55 h 15 v 10 h -15 z M 70 75 h 10 v 5 h -10 z M 90 70 h 5 v 5 h -5 z M 85 85 h 10 v 10 h -10 z M 45 75 h 15 v 15 h -15 z H 35 v -10 h 10 z" fill="currentColor" />
              </svg>
            </div>

            <div className="bg-surface-container-low rounded-lg p-3 text-left flex items-start gap-3 border border-outline-variant/50">
              <CornerDownRight size={16} className="text-primary mt-0.5 shrink-0" />
              <div>
                <span className="text-[10px] font-bold text-primary uppercase block">Redirection Target</span>
                <span className="text-xs text-on-surface-variant font-medium block truncate max-w-[240px]">{qrCodeModal.original}</span>
              </div>
            </div>

            <button onClick={() => setQrCodeModal(null)} className="mt-6 w-full py-2.5 bg-primary-container hover:bg-primary text-on-primary font-semibold rounded-lg text-sm transition-colors">
              Done
            </button>
          </div>
        </div>
      )}

    </div>
  );
}