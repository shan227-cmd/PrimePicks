import { useState, useEffect, useRef } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from "react-router-dom";

// ============================================================
// SLIP EDGE — Complete Multi-Page React App
// ============================================================
// Backend integration points marked with: // [BACKEND]
// Stripe integration points marked with: // [STRIPE]
// Auth integration points marked with: // [AUTH]
// ============================================================

// ─── MOCK DATA ───────────────────────────────────────────────

const MOCK_PICKS = [
  { id: 1, sport: "NBA", pick: "BOS -4.5", type: "Premium", confidence: 88, odds: "-115", result: "Win", units: "+1.91", date: "May 7" },
  { id: 2, sport: "MLB", pick: "LAD -1.5", type: "Premium", confidence: 82, odds: "-130", result: "Win", units: "+1.84", date: "May 7" },
  { id: 3, sport: "UFC", pick: "Over 2.5 Rounds", type: "EV Play", confidence: 74, odds: "+105", result: "Win", units: "+2.25", date: "May 6" },
  { id: 4, sport: "NBA", pick: "DEN ML", type: "Premium", confidence: 79, odds: "-118", result: "Win", units: "+0.85", date: "May 6" },
  { id: 5, sport: "MLB", pick: "NYM +1.5", type: "EV Play", confidence: 71, odds: "+110", result: "Loss", units: "-1.00", date: "May 5" },
  { id: 6, sport: "NBA", pick: "OKC/DAL Over 221.5", type: "EV Play", confidence: 68, odds: "-108", result: "Win", units: "+0.93", date: "May 5" },
  { id: 7, sport: "MLB", pick: "NYY -1.5 1H", type: "Live", confidence: 85, odds: "+120", result: "Win", units: "+1.20", date: "May 4" },
  { id: 8, sport: "UFC", pick: "Pereira KO/TKO", type: "EV Play", confidence: 62, odds: "+180", result: "Loss", units: "-1.00", date: "May 4" },
  { id: 9, sport: "NBA", pick: "MIA +6.5", type: "Premium", confidence: 77, odds: "-110", result: "Win", units: "+0.91", date: "May 3" },
  { id: 10, sport: "UFC", pick: "Du Plessis Sub", type: "EV Play", confidence: 65, odds: "+200", result: "Win", units: "+2.00", date: "May 3" },
];

const MOCK_REVIEWS = [
  { id: 1, name: "Marcus T.", stars: 5, date: "May 3, 2025", plan: "Monthly All-Access", sport: "NBA", text: "Three weeks in and already profitable. The breakdowns actually explain the reasoning — n[...]" },
  { id: 2, name: "Jordan K.", stars: 5, date: "Apr 28, 2025", plan: "Premium Weekly", sport: "MLB", text: "I was skeptical but the free picks got me hooked. Upgraded to weekly and hit 7 of my first 9.[...]" },
  { id: 3, name: "Aiden R.", stars: 4, date: "Apr 22, 2025", plan: "Monthly All-Access", sport: "UFC", text: "The live betting alerts are insane. Got a +220 in game signal on a UFC fight that hit. Dis[...]" },
  { id: 4, name: "Priya M.", stars: 5, date: "Apr 18, 2025", plan: "Premium Weekly", sport: "NBA/MLB", text: "Switched from two other services and the quality difference is night and day. Actual analy[...]" },
  { id: 5, name: "Devon S.", stars: 5, date: "Apr 10, 2025", plan: "Monthly All-Access", sport: "MLB", text: "Started with the daily pass to test it. Went 3-1 on day one. Bought the monthly the same n[...]" },
  { id: 6, name: "Lena W.", stars: 4, date: "Apr 5, 2025", plan: "Live Betting VIP", sport: "NBA", text: "The live signals are fast and well timed. I've hit some crazy in game lines I never would have[...]" },
];

const MOCK_TICKETS = [
  { id: "SE-1038", subject: "Can't access Discord", status: "Resolved", priority: "Medium", date: "May 5" },
  { id: "SE-1039", subject: "Billing charge question", status: "Pending", priority: "High", date: "May 6" },
  { id: "SE-1040", subject: "Picks not showing after purchase", status: "Open", priority: "High", date: "May 7" },
];

const PLANS = [
  { id: "free", name: "Free Picks", price: "$0", period: "Forever", color: "#6b7280", features: ["Daily free picks", "Community access", "Results tracking", "Limited pick access"], cta: "Get Free Pick[...]" },
  { id: "daily", name: "Daily Picks Pass", price: "$4.99", period: "Today Only", color: "#22c55e", features: ["Premium Picks of the Day", "Risky EV / Lotto Plays", "Quick Pick Breakdowns", "Same-Day A[...]" },
  { id: "weekend", name: "Weekend Pass", price: "$14.99", period: "3 Days", color: "#22c55e", features: ["Weekend premium picks", "Lottos and parlays", "Full premium Discord access", "Results access"] },
  { id: "biweekly", name: "Bi-Weekly Pass", price: "$16.99", period: "2 Weeks", color: "#22c55e", features: ["All premium picks", "Risky EV plays", "Pick breakdowns", "Results access", "Upgrade anytim[...]" },
  { id: "weekly", name: "Premium Edge Weekly", price: "$9.99", period: "Week", color: "#22c55e", features: ["All premium picks", "Live betting alerts", "VIP Discord", "Results and analytics", "Pick br[...]" },
  { id: "monthly", name: "Monthly All-Access", price: "$35.00", period: "Month", color: "#22c55e", features: ["All premium picks", "Live betting alerts", "VIP Discord", "Advanced analytics", "Full res[...]" },
  { id: "live", name: "Live Betting VIP", price: "$49.99", period: "Month", color: "#fbbf24", features: ["Live betting alerts", "In-game signals", "VIP Discord", "Priority support", "Fastest pick upda[...]" },
];

// ─── STYLES ──────────────────────────────────────────────────

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --black: #080b0f;
    --charcoal: #0e1317;
    --card: #111820;
    --border: #1e2a35;
    --green: #22c55e;
    --green-dim: #16a34a;
    --green-glow: rgba(34,197,94,0.18);
    --gold: #fbbf24;
    --white: #f8fafc;
    --gray: #94a3b8;
    --red: #ef4444;
  }

  html { scroll-behavior: smooth; }

  body {
    font-family: 'DM Sans', sans-serif;
    background: var(--black);
    color: var(--white);
    min-height: 100vh;
    overflow-x: hidden;
  }

  .bebas { font-family: 'Bebas Neue', sans-serif; }

  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: var(--black); }
  ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }

  .glow-green { box-shadow: 0 0 24px var(--green-glow), 0 0 4px rgba(34,197,94,0.3); }
  .glow-text { text-shadow: 0 0 20px rgba(34,197,94,0.5); }

  .card {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 24px;
  }

  .btn-green {
    background: var(--green);
    color: #000;
    font-weight: 700;
    padding: 12px 28px;
    border-radius: 10px;
    border: none;
    cursor: pointer;
    font-size: 15px;
    transition: all 0.2s;
    letter-spacing: 0.3px;
    font-family: 'DM Sans', sans-serif;
  }
  .btn-green:hover { background: #16a34a; transform: translateY(-1px); box-shadow: 0 6px 20px rgba(34,197,94,0.3); }

  .btn-outline {
    background: transparent;
    color: var(--white);
    font-weight: 600;
    padding: 12px 28px;
    border-radius: 10px;
    border: 1px solid var(--border);
    cursor: pointer;
    font-size: 15px;
    transition: all 0.2s;
    font-family: 'DM Sans', sans-serif;
  }
  .btn-outline:hover { border-color: var(--green); color: var(--green); }

  .tag {
    display: inline-block;
    padding: 3px 10px;
    border-radius: 999px;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.5px;
    text-transform: uppercase;
  }

  input, textarea, select {
    background: #0e1317;
    border: 1px solid var(--border);
    color: var(--white);
    border-radius: 10px;
    padding: 12px 16px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    width: 100%;
    outline: none;
    transition: border-color 0.2s;
  }
  input:focus, textarea:focus, select:focus { border-color: var(--green); }
  input::placeholder, textarea::placeholder { color: #475569; }
  select option { background: #0e1317; }

  label { font-size: 13px; color: var(--gray); margin-bottom: 6px; display: block; font-weight: 500; }

  .locked-overlay {
    position: absolute;
    inset: 0;
    background: rgba(8,11,15,0.7);
    backdrop-filter: blur(4px);
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;
  }

  @keyframes pulse-green {
    0%, 100% { box-shadow: 0 0 10px rgba(34,197,94,0.2); }
    50% { box-shadow: 0 0 24px rgba(34,197,94,0.4); }
  }
  .pulse { animation: pulse-green 3s ease-in-out infinite; }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(12px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .fade-in { animation: fadeIn 0.4s ease forwards; }

  @keyframes slideUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .slide-up { animation: slideUp 0.5s ease forwards; }

  @keyframes chartGrow {
    from { transform: scaleY(0); }
    to { transform: scaleY(1); }
  }

  .nav-link {
    color: var(--gray);
    text-decoration: none;
    font-size: 14px;
    font-weight: 500;
    transition: color 0.2s;
    cursor: pointer;
    background: none;
    border: none;
    font-family: 'DM Sans', sans-serif;
  }
  .nav-link:hover { color: var(--white); }
  .nav-link.active { color: var(--green); }

  .section { padding: 80px 0; }
  .section-sm { padding: 48px 0; }
  .container { max-width: 1200px; margin: 0 auto; padding: 0 24px; }

  .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
  .grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
  .grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }

  @media (max-width: 900px) {
    .grid-3 { grid-template-columns: 1fr 1fr; }
    .grid-4 { grid-template-columns: 1fr 1fr; }
    .grid-2 { grid-template-columns: 1fr; }
  }
  @media (max-width: 600px) {
    .grid-3, .grid-4 { grid-template-columns: 1fr; }
    .section { padding: 56px 0; }
    .container { padding: 0 16px; }
  }

  .chart-bar {
    border-radius: 4px 4px 0 0;
    transform-origin: bottom;
    transition: transform 0.6s ease;
  }

  .modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.8);
    backdrop-filter: blur(8px);
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
  }

  .modal {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 20px;
    padding: 32px;
    max-width: 460px;
    width: 100%;
    max-height: 90vh;
    overflow-y: auto;
    animation: slideUp 0.3s ease;
  }

  .sport-badge {
    padding: 3px 10px;
    border-radius: 6px;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.5px;
  }

  table { width: 100%; border-collapse: collapse; }
  th { color: var(--gray); font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; padding: 12px 16px; text-align: left; border-bottom: 1px solid var(--border); }
  td { padding: 14px 16px; font-size: 14px; border-bottom: 1px solid var(--border); }
  tr:last-child td { border-bottom: none; }
  tr:hover td { background: rgba(255,255,255,0.02); }

  .star { color: var(--gold); }
  .divider { border: none; border-top: 1px solid var(--border); margin: 32px 0; }

  .mobile-menu {
    position: fixed;
    top: 64px;
    left: 0;
    right: 0;
    background: var(--charcoal);
    border-bottom: 1px solid var(--border);
    z-index: 999;
    padding: 16px 24px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .chat-bubble {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 12px 12px 12px 2px;
    padding: 10px 14px;
    font-size: 14px;
    max-width: 80%;
    margin-bottom: 8px;
  }
  .chat-bubble.user {
    background: var(--green-dim);
    border-radius: 12px 12px 2px 12px;
    align-self: flex-end;
  }

  .support-panel {
    position: fixed;
    bottom: 88px;
    right: 24px;
    width: 340px;
    max-height: 520px;
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 20px;
    z-index: 9999;
    overflow: hidden;
    animation: slideUp 0.25s ease;
    box-shadow: 0 20px 60px rgba(0,0,0,0.6);
  }

  @media (max-width: 400px) {
    .support-panel { width: calc(100vw - 32px); right: 16px; }
  }
`;

// ─── SPORT BADGE COLOR ────────────────────────────────────────

const sportColor = (s) => {
  const map = { NBA: "#f97316", MLB: "#3b82f6", UFC: "#ec4899", Live: "#22c55e" };
  return map[s] || "#6b7280";
};

// ─── NAVBAR ──────────────────────────────────────────────────

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const links = [
    ["Home", "/"], 
    ["Daily Picks", "/daily"], 
    ["Plans", "/plans"],
    ["Results", "/results"], 
    ["Reviews", "/reviews"], 
    ["Free Picks", "/free"],
    ["Support", "/support"],
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <style>{css}</style>
      <nav style={{ position: "sticky", top: 0, zIndex: 900, background: "rgba(8,11,15,0.95)", backdropFilter: "blur(16px)", borderBottom: "1px solid #1e2a35", height: 64 }}>
        <div className="container" style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <button onClick={() => navigate("/")} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 32, height: 32, background: "var(--green)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "#000", fontFamily: "'Bebas Neue', sans-serif", fontSize: 16, lineHeight: 1 }}>SE</span>
            </div>
            <span className="bebas" style={{ fontSize: 22, letterSpacing: 1, color: "var(--white)" }}>Slip Edge</span>
          </button>

          <div style={{ display: "flex", gap: 4, alignItems: "center" }} className="desktop-nav">
            {links.map(([label, path]) => (
              <button key={path} className={`nav-link${isActive(path) ? " active" : ""}`} onClick={() => navigate(path)} style={{ padding: "6px 12px" }}>{label}</button>
            ))}
            <button className="nav-link" onClick={() => navigate("/login")} style={{ padding: "6px 12px" }}>Login</button>
            <button className="btn-green" onClick={() => navigate("/plans")} style={{ padding: "8px 20px", fontSize: 14, marginLeft: 8 }}>Get Picks</button>
          </div>

          <button onClick={() => setOpen(!open)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--white)", display: "none", padding: 8 }} className="mobile-ham">
            <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              {open ? <path d="M6 18L18 6M6 6l12 12"/> : <><line x1="3" y1="7" x2="21" y2="7"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="17" x2="21" y2="17"/></>}
            </svg>
          </button>
        </div>
      </nav>
      {open && (
        <div className="mobile-menu">
          {links.map(([label, path]) => (
            <button key={path} className={`nav-link${isActive(path) ? " active" : ""}`} onClick={() => { navigate(path); setOpen(false); }} style={{ textAlign: "left", padding: "8px 0" }}>{label}</button>
          ))}
          <button className="nav-link" onClick={() => { navigate("/login"); setOpen(false); }} style={{ textAlign: "left", padding: "8px 0" }}>Login</button>
          <button className="btn-green" onClick={() => { navigate("/plans"); setOpen(false); }} style={{ width: "100%" }}>Get Picks</button>
        </div>
      )}
      <style>{`
        @media (max-width: 900px) {
          .desktop-nav { display: none !important; }
          .mobile-ham { display: flex !important; }
        }
      `}</style>
    </>
  );
}

// ─── FOOTER ──────────────────────────────────────────────────

function Footer() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  return (
    <footer style={{ background: "var(--charcoal)", borderTop: "1px solid var(--border)", paddingTop: 64, paddingBottom: 32, marginTop: 80 }}>
      <div className="container">
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 48, marginBottom: 48 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <div style={{ width: 36, height: 36, background: "var(--green)", borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ color: "#000", fontFamily: "'Bebas Neue', sans-serif", fontSize: 18 }}>SE</span>
              </div>
              <span className="bebas" style={{ fontSize: 24, letterSpacing: 1 }}>Slip Edge</span>
            </div>
            <p style={{ color: "var(--gray)", fontSize: 14, lineHeight: 1.7, maxWidth: 280, marginBottom: 24 }}>
              Data-driven picks. Real edges. Start winning smarter.
            </p>
            <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
              <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Your email address" style={{ maxWidth: 220 }} />
              <button className="btn-green" style={{ whiteSpace: "nowrap", padding: "12px 16px" }}>Subscribe</button>
            </div>
            <p style={{ color: "#475569", fontSize: 12 }}>Weekly free picks and news.</p>
          </div>

          <div>
            <p style={{ fontWeight: 700, marginBottom: 16, fontSize: 13, textTransform: "uppercase", letterSpacing: 0.5, color: "var(--gray)" }}>Quick Links</p>
            {[["Home","/"],["Daily Picks","/daily"],["Plans","/plans"],["Results","/results"],["Reviews","/reviews"],["Free Picks","/free"],["Support","/support"]].map(([l,id]) => (
              <button key={id} onClick={() => navigate(id)} style={{ display: "block", background: "none", border: "none", color: "#94a3b8", fontSize: 14, padding: "5px 0", cursor: "pointer", textAlign: "left" }}
                onMouseEnter={e => e.target.style.color="#f8fafc"} onMouseLeave={e => e.target.style.color="#94a3b8"}>{l}</button>
            ))}
          </div>

          <div>
            <p style={{ fontWeight: 700, marginBottom: 16, fontSize: 13, textTransform: "uppercase", letterSpacing: 0.5, color: "var(--gray)" }}>Legal</p>
            {["Terms of Service","Privacy Policy","Refund Policy","Responsible Gaming"].map(l => (
              <button key={l} style={{ display: "block", background: "none", border: "none", color: "#94a3b8", fontSize: 14, padding: "5px 0", cursor: "pointer", textAlign: "left" }}>{l}</button>
            ))}
          </div>

          <div>
            <p style={{ fontWeight: 700, marginBottom: 16, fontSize: 13, textTransform: "uppercase", letterSpacing: 0.5, color: "var(--gray)" }}>Community</p>
            {[["TikTok","🎵"],["Twitter / X","𝕏"],["Discord","💬"],["Telegram","✈️"],["Instagram","📸"],["YouTube","▶"]].map(([l,icon]) => (
              <button key={l} style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", color: "#94a3b8", fontSize: 14, padding: "5px 0", cursor: "pointer" }}
                onMouseEnter={e => e.target.style.color="#22c55e"} onMouseLeave={e => e.target.style.color="#94a3b8"}>
                <span>{icon}</span>{l}
              </button>
            ))}
          </div>
        </div>

        <hr className="divider" style={{ margin: "0 0 24px" }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <p style={{ color: "#475569", fontSize: 12 }}>© 2026 Slip Edge. All rights reserved.</p>
          <p style={{ color: "#475569", fontSize: 12, maxWidth: 600, textAlign: "right", lineHeight: 1.6 }}>
            Slip Edge provides sports analysis and informational content only. No pick is guaranteed. Bet responsibly. 18+ only.
          </p>
        </div>
      </div>
      <style>{`
        @media (max-width: 900px) {
          footer > div > div:first-child > div { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 600px) {
          footer > div > div:first-child > div { grid-template-columns: 1fr !important; }
          footer > div > div:last-child { flex-direction: column; }
          footer > div > div:last-child p:last-child { text-align: left; }
        }
      `}</style>
    </footer>
  );
}

// ─── CHECKOUT MODAL ───────────────────────────────────────────

function CheckoutModal({ plan, onClose }) {
  const [step, setStep] = useState(1);
  const [method, setMethod] = useState("card");
  const [email, setEmail] = useState("");
  const [card, setCard] = useState("");

  const createCheckoutSession = async (planId, email) => {
    console.log("[STRIPE] createCheckoutSession called", { planId, email });
    setStep(2);
  };

  if (step === 2) return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal fade-in" onClick={e => e.stopPropagation()} style={{ textAlign: "center" }}>
        <div style={{ width: 64, height: 64, background: "rgba(34,197,94,0.15)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
          <span style={{ fontSize: 32 }}>✓</span>
        </div>
        <h2 className="bebas" style={{ fontSize: 32, letterSpacing: 1, marginBottom: 8 }}>You're In!</h2>
        <p style={{ color: "var(--gray)", marginBottom: 24 }}>Your access to <strong style={{ color: "var(--white)" }}>{plan.name}</strong> is now active.</p>
        <div className="card" style={{ textAlign: "left", marginBottom: 24 }}>
          <p style={{ fontSize: 13, color: "var(--gray)", marginBottom: 4 }}>Plan</p>
          <p style={{ fontWeight: 600, marginBottom: 12 }}>{plan.name}</p>
          <p style={{ fontSize: 13, color: "var(--gray)", marginBottom: 4 }}>Amount</p>
          <p style={{ fontWeight: 600, color: "var(--green)" }}>{plan.price}</p>
        </div>
        <button className="btn-green" style={{ width: "100%" }} onClick={onClose}>Go to My Picks</button>
      </div>
    </div>
  );

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h2 style={{ fontWeight: 700, fontSize: 20 }}>Checkout</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "var(--gray)", cursor: "pointer", fontSize: 20 }}>×</button>
        </div>

        <div style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: 12, padding: "14px 16px", marginBottom: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontWeight: 600 }}>{plan.name}</span>
            <span style={{ fontWeight: 700, color: "var(--green)" }}>{plan.price}</span>
          </div>
          {plan.period && <p style={{ fontSize: 12, color: "var(--gray)", marginTop: 4 }}>{plan.period}</p>}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 20, position: "relative" }}>
          <div style={{ position: "absolute", top: 20, left: "18%", right: "18%", height: 1, background: "rgba(34,197,94,0.2)", zIndex: 0 }} />
          {[["💳","Subscribe"],["📲","Get Picks"],["🎯","Tail & Win"]].map(([icon, label], i) => (
            <div key={label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, zIndex: 1 }}>
              <div style={{ width: 42, height: 42, borderRadius: "50%", background: "var(--charcoal)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                {icon}
                <div style={{ position: "absolute", top: -5, right: -5, width: 16, height: 16, borderRadius: "50%", background: "var(--green)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontSize: 8, fontWeight: 800, color: "#000" }}>{i + 1}</span>
                </div>
              </div>
              <p style={{ fontSize: 11, color: "var(--gray)", fontWeight: 600, textAlign: "center" }}>{label}</p>
            </div>
          ))}
        </div>

        <div style={{ marginBottom: 16 }}>
          <label>Email Address</label>
          <input value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" type="email" />
        </div>

        <div style={{ marginBottom: 20 }}>
          <label>Payment Method</label>
          <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
            {["card","apple","google","crypto"].map(m => (
              <button key={m} onClick={() => setMethod(m)} style={{ flex: 1, padding: "10px 8px", borderRadius: 8, border: `1px solid ${method===m?"var(--green)":"var(--border)"}`, background: method===m?"rgba(34,197,94,0.1)":"transparent", color: "var(--white)", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
                {m==="card"?"💳 Card":m==="apple"?"🍎 Apple":m==="google"?"G Pay":"₿ Crypto"}
              </button>
            ))}
          </div>
          {method === "card" && (
            <input value={card} onChange={e => setCard(e.target.value)} placeholder="Card number" />
          )}
          {method !== "card" && (
            <div style={{ textAlign: "center", padding: 16, color: "var(--gray)", fontSize: 14, background: "#080b0f", borderRadius: 10, border: "1px solid var(--border)" }}>
              Click below to continue with {method === "apple" ? "Apple Pay" : method === "google" ? "Google Pay" : "Crypto"}
            </div>
          )}
        </div>

        <button className="btn-green" style={{ width: "100%", padding: 16, fontSize: 16 }}
          onClick={() => createCheckoutSession(plan.id, email)}>
          Pay {plan.price} and Get Access
        </button>

        <p style={{ textAlign: "center", fontSize: 12, color: "#475569", marginTop: 14 }}>
          🔒 Secure checkout · Bet responsibly · 18+ only
        </p>
      </div>
    </div>
  );
}

// ─── FLOATING SUPPORT BUTTON ──────────────────────────────────

function FloatingSupportButton() {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState("menu");
  const [messages, setMessages] = useState([{ from: "bot", text: "Hey! How can we help you today?" }]);
  const [input, setInput] = useState("");
  const [ticketSubmitted, setTicketSubmitted] = useState(false);
  const [ticket, setTicket] = useState({ name: "", email: "", type: "General", orderId: "", message: "", priority: "Medium" });

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, { from: "user", text: input }]);
    setInput("");
    setTimeout(() => {
      setMessages(prev => [...prev, { from: "bot", text: "Thanks! Our team will reply shortly. Average response time is under 2 hours." }]);
    }, 800);
  };

  const submitTicket = () => {
    console.log("[BACKEND] submitTicket", ticket);
    setTicketSubmitted(true);
  };

  return (
    <>
      {open && (
        <div className="support-panel">
          <div style={{ background: "var(--charcoal)", padding: "16px 20px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <p style={{ fontWeight: 700, fontSize: 15 }}>Slip Edge Support</p>
              <p style={{ fontSize: 12, color: "var(--green)" }}>● Team available</p>
            </div>
            <button onClick={() => setOpen(false)} style={{ background: "none", border: "none", color: "var(--gray)", cursor: "pointer", fontSize: 20 }}>×</button>
          </div>

          <div style={{ padding: 16, overflowY: "auto", maxHeight: 400 }}>
            {view === "menu" && (
              <div className="fade-in">
                <p style={{ color: "var(--gray)", fontSize: 13, marginBottom: 16 }}>What do you need help with?</p>
                {[["💬","Live Chat","chat"],["🎟️","Open a Ticket","ticket"],["💳","Billing Help","ticket"],["🏆","Pick Access Issue","ticket"],["💬","Discord Access","ticket"]].map(([icon, label, target]) => (
                  <button key={label} onClick={() => setView(target)} style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", background: "#0e1317", border: "1px solid var(--border)", borderRadius: 10, color: "var(--white)", cursor: "pointer", marginBottom: 8 }}
                    onMouseEnter={e => e.currentTarget.style.borderColor="#22c55e"} onMouseLeave={e => e.currentTarget.style.borderColor="var(--border)"}>
                    <span>{icon}</span><span>{label}</span>
                    <span style={{ marginLeft: "auto", color: "var(--gray)" }}>›</span>
                  </button>
                ))}
              </div>
            )}

            {view === "chat" && (
              <div className="fade-in">
                <button onClick={() => setView("menu")} style={{ background: "none", border: "none", color: "var(--green)", cursor: "pointer", fontSize: 13, marginBottom: 12, padding: 0, fontFamily: "'DM Sans', sans-serif" }}>← Back</button>
                <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 12, minHeight: 120 }}>
                  {messages.map((m, i) => (
                    <div key={i} style={{ alignSelf: m.from === "user" ? "flex-end" : "flex-start" }}>
                      <div className={`chat-bubble${m.from === "user" ? " user" : ""}`}>{m.text}</div>
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <input value={input} onChange={e => setInput(e.target.value)} placeholder="Type a message…" onKeyDown={e => e.key === "Enter" && sendMessage()} />
                  <button className="btn-green" onClick={sendMessage} style={{ padding: "0 16px", flexShrink: 0 }}>↑</button>
                </div>
              </div>
            )}

            {view === "ticket" && !ticketSubmitted && (
              <div className="fade-in">
                <button onClick={() => setView("menu")} style={{ background: "none", border: "none", color: "var(--green)", cursor: "pointer", fontSize: 13, marginBottom: 12, padding: 0, fontFamily: "'DM Sans', sans-serif" }}>← Back</button>
                {[["name","Name","text"],["email","Email","email"],["orderId","Order ID (optional)","text"]].map(([k,l,t]) => (
                  <div key={k} style={{ marginBottom: 10 }}>
                    <label>{l}</label>
                    <input type={t} value={ticket[k]} onChange={e => setTicket(p => ({...p,[k]:e.target.value}))} />
                  </div>
                ))}
                <div style={{ marginBottom: 10 }}>
                  <label>Issue Type</label>
                  <select value={ticket.type} onChange={e => setTicket(p => ({...p,type:e.target.value}))}>
                    {["General","Billing","Pick Access","Discord Access","Technical"].map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div style={{ marginBottom: 14 }}>
                  <label>Message</label>
                  <textarea rows={3} value={ticket.message} onChange={e => setTicket(p => ({...p,message:e.target.value}))} />
                </div>
                <button className="btn-green" style={{ width: "100%" }} onClick={submitTicket}>Create Ticket</button>
              </div>
            )}

            {view === "ticket" && ticketSubmitted && (
              <div className="fade-in" style={{ textAlign: "center", padding: "20px 0" }}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>✓</div>
                <p style={{ fontWeight: 700, marginBottom: 8 }}>Ticket #SE-1042 created</p>
                <p style={{ color: "var(--gray)", fontSize: 13, marginBottom: 16 }}>We'll get back to you within 24 hours.</p>
                <button className="btn-outline" onClick={() => { setView("menu"); setTicketSubmitted(false); }} style={{ fontSize: 13 }}>Back to Menu</button>
              </div>
            )}
          </div>
        </div>
      )}

      <button onClick={() => setOpen(!open)} style={{ position: "fixed", bottom: 24, right: 24, width: 56, height: 56, borderRadius: "50%", background: "var(--white)", border: "none", cursor: "pointer", transition: "transform 0.2s", boxShadow: "0 4px 12px rgba(0,0,0,0.2)" }}
        onMouseEnter={e => e.currentTarget.style.transform="scale(1.05)"} onMouseLeave={e => e.currentTarget.style.transform="scale(1)"}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#111820" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
      </button>
    </>
  );
}

// ─── HERO DASHBOARD VISUAL ────────────────────────────────────

function HeroDashboard() {
  return (
    <div style={{ position: "relative", flex: 1, minWidth: 320, maxWidth: 520 }}>
      <div style={{ background: "rgba(17,24,32,0.9)", border: "1px solid #1e2a35", borderRadius: 20, padding: 24, backdropFilter: "blur(20px)", boxShadow: "0 0 60px rgba(34,197,94,0.1)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <span style={{ fontSize: 13, color: "var(--gray)", fontWeight: 600 }}>Slip Edge · Pick Tracker</span>
          <span style={{ background: "rgba(34,197,94,0.15)", color: "var(--green)", fontSize: 11, padding: "3px 8px", borderRadius: 6, fontWeight: 700 }}>LIVE</span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 20 }}>
          {[
            ["Picks This Month", "34", "NBA · MLB · UFC"],
            ["Pick Breakdowns", "Every Pick", "Full reasoning included"],
            ["New Picks", "Daily", "Posted every morning"],
          ].map(([l,v,sub]) => (
            <div key={l} style={{ background: "#080b0f", borderRadius: 12, padding: "12px 14px", border: "1px solid #1e2a35" }}>
              <p style={{ fontSize: 11, color: "var(--gray)", marginBottom: 4 }}>{l}</p>
              <p style={{ fontWeight: 700, fontSize: 15, color: "var(--green)", lineHeight: 1.2 }}>{v}</p>
              <p style={{ fontSize: 10, color: "#475569", marginTop: 2 }}>{sub}</p>
            </div>
          ))}
        </div>

        <div style={{ background: "#080b0f", borderRadius: 12, padding: 14, border: "1px solid #1e2a35" }}>
          <p style={{ fontSize: 11, color: "var(--gray)", marginBottom: 12 }}>Profit Line  Last 30 Days</p>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 4, height: 56 }}>
            {[30,42,36,50,44,58,52,65,70,62,76,84].map((h, i) => (
              <div key={i} style={{ flex: 1, height: `${h}%`, background: `rgba(34,197,94,${0.25 + i * 0.055})`, borderRadius: "3px 3px 0 0", transition: "all 0.3s" }} />
            ))}
          </div>
          <p style={{ fontSize: 10, color: "#334155", marginTop: 8, textAlign: "right" }}>Illustrative only · Join Discord for full track record</p>
        </div>
      </div>

      <div style={{ position: "absolute", top: -16, right: -16, background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.3)", borderRadius: 12, padding: "10px 16px", backdropFilter: "blur(20px)" }}>
        <p style={{ fontSize: 11, color: "var(--gray)" }}>Picks This Week</p>
        <p className="bebas" style={{ fontSize: 26, color: "var(--green)", letterSpacing: 1 }}>8 Plays</p>
      </div>
    </div>
  );
}

// ─── PAGES COMPONENTS ──────────────────────────────────────────

function HomePage({ setCheckout }) {
  return (
    <div>
      <section style={{ padding: "80px 0 64px", background: "linear-gradient(135deg, #080b0f 0%, #0d1a10 50%, #080b0f 100%)" }}>
        <div className="container" style={{ display: "flex", gap: 64, alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 300 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.25)", borderRadius: 999, padding: "6px 14px", marginBottom: 24 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--green)", display: "inline-block" }}></span>
              <span style={{ color: "var(--green)", fontSize: 12, fontWeight: 700, letterSpacing: 0.5 }}>LIVE PICKS AVAILABLE TODAY  NBA · MLB · UFC</span>
            </div>
            <h1 className="bebas" style={{ fontSize: "clamp(52px, 8vw, 80px)", lineHeight: 1, letterSpacing: 2, marginBottom: 16 }}>
              Start Winning<br />
              <span style={{ color: "var(--green)" }} className="glow-text">Smarter.</span>
            </h1>
            <p style={{ color: "var(--gray)", fontSize: "clamp(15px, 2vw, 18px)", lineHeight: 1.7, marginBottom: 12, maxWidth: 480 }}>
              Daily expert picks, data-driven edges, and real-time insights across NBA, MLB, and UFC.
            </p>
            <p style={{ color: "#64748b", fontSize: 15, marginBottom: 36 }}>Stop guessing. Start making sharper plays.</p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 36 }}>
              <a href="/plans" className="btn-green" style={{ fontSize: 16, padding: "14px 32px", textDecoration: "none", display: "inline-block" }}>View Plans</a>
              <a href="/free" className="btn-outline" style={{ fontSize: 16, padding: "14px 32px", textDecoration: "none", display: "inline-block" }}>Get Free Picks</a>
            </div>
            <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
              <span style={{ color: "#475569", fontSize: 12, fontWeight: 600 }}>SECURE PAYMENTS:</span>
              {[["💳 Visa","Visa"],["💳 MC","MC"],["🍎 Apple Pay","Apple Pay"],["G Pay","G Pay"],["₿ Crypto","Crypto"]].map(([label, key]) => (
                <span key={key} style={{ background: "#111820", border: "1px solid #1e2a35", padding: "4px 10px", borderRadius: 6, fontSize: 11, fontWeight: 700, color: "var(--gray)" }}>{label}</span>
              ))}
            </div>
          </div>
          <HeroDashboard />
        </div>
      </section>

      <section style={{ background: "var(--charcoal)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", padding: "20px 0" }}>
        <div className="container" style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 20 }}>
          {[["4.8/5","Average Rating"],["Verified","Results"],["Active","Discord"],["Secure","Payments"]].map(([v,l]) => (
            <div key={l} style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 8, height: 8, background: "var(--green)", borderRadius: "50%" }} />
              <span><strong style={{ color: "var(--white)" }}>{v}</strong> <span style={{ color: "var(--gray)", fontSize: 14 }}>{l}</span></span>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="container">
          <p style={{ color: "var(--green)", fontSize: 12, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", marginBottom: 12 }}>What We Offer</p>
          <h2 className="bebas" style={{ fontSize: "clamp(36px,5vw,56px)", letterSpacing: 1, marginBottom: 48 }}>The Full Edge Package</h2>
          <div className="grid-3">
            {[
              ["🎯","Daily Picks","Expert curated premium picks every day across NBA, MLB, and UFC."],
              ["💎","Premium Picks","Deep dive analysis picks with full reasoning and confidence levels."],
              ["🆓","Free Picks","Start free with our daily community picks. No card required."],
              ["🎲","Risky EV Parlays","High upside, positive expected value plays for the bold."],
              ["⚡","Live Betting","Real time in game signals as lines move during NBA and MLB action."],
              ["👑","VIP Community","Members only Discord with analysts, alerts, and live discussion."],
            ].map(([icon,title,desc]) => (
              <div key={title} className="card" style={{ transition: "border-color 0.2s, transform 0.2s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor="#22c55e"; e.currentTarget.style.transform="translateY(-3px)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor="var(--border)"; e.currentTarget.style.transform="none"; }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>{icon}</div>
                <h3 style={{ fontWeight: 700, marginBottom: 8 }}>{title}</h3>
                <p style={{ color: "var(--gray)", fontSize: 14, lineHeight: 1.6 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ background: "var(--charcoal)" }}>
        <div className="container">
          <p style={{ color: "var(--green)", fontSize: 12, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", marginBottom: 12 }}>Pricing</p>
          <h2 className="bebas" style={{ fontSize: "clamp(36px,5vw,56px)", letterSpacing: 1, marginBottom: 48 }}>Pick Your Plan</h2>
          <div className="grid-3">
            {PLANS.slice(1,4).map(plan => (
              <div key={plan.id} className={`card${plan.popular?" glow-green pulse":""}`} style={{ border: plan.popular ? "1px solid var(--green)" : "1px solid var(--border)", position: "relative", transition: "transform 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.transform="translateY(-4px)"} onMouseLeave={e => e.currentTarget.style.transform="none"}>
                {plan.popular && <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", background: "var(--green)", color: "#000", fontSize: 11, fontWeight: 800, padding: "4px 12px", borderRadius: 20 }}>MOST POPULAR</div>}
                <p style={{ color: "var(--gray)", fontSize: 13, marginBottom: 8 }}>{plan.name}</p>
                <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 20 }}>
                  <span className="bebas" style={{ fontSize: 40, letterSpacing: 1, color: plan.popular ? "var(--green)" : "var(--white)" }}>{plan.price}</span>
                  <span style={{ color: "var(--gray)", fontSize: 14 }}>/ {plan.period}</span>
                </div>
                <button className={plan.popular ? "btn-green" : "btn-outline"} style={{ width: "100%", marginBottom: 16 }} onClick={() => setCheckout(plan)}>
                  Get Started
                </button>
                {plan.note && <p style={{ fontSize: 12, color: "#475569", textAlign: "center", marginBottom: 12 }}>{plan.note}</p>}
                {plan.features.slice(0,3).map(f => (
                  <p key={f} style={{ fontSize: 13, color: "var(--gray)", padding: "4px 0", display: "flex", gap: 8 }}><span style={{ color: "var(--green)" }}>✓</span>{f}</p>
                ))}
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: 32 }}>
            <a href="/plans" className="btn-outline" style={{ fontSize: 15, textDecoration: "none", display: "inline-block" }}>View All Plans →</a>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="card" style={{ background: "linear-gradient(135deg, #111820, #0e1a10)", border: "1px solid rgba(34,197,94,0.2)", display: "flex", alignItems: "center", gap: 32, flexWrap: "wrap" }}>
            <div style={{ fontSize: 52 }}>💬</div>
            <div style={{ flex: 1, minWidth: 220 }}>
              <p style={{ color: "var(--green)", fontSize: 12, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", marginBottom: 8 }}>Full Track Record</p>
              <h3 style={{ fontWeight: 700, fontSize: 22, marginBottom: 8 }}>See Every Pick We've Ever Made</h3>
              <p style={{ color: "var(--gray)", fontSize: 15, lineHeight: 1.6 }}>Join our Discord for the complete history of our NBA, MLB, and UFC picks. Every win, every loss, fully transparent.</p>
            </div>
            <button className="btn-green" style={{ fontSize: 15, padding: "14px 32px", whiteSpace: "nowrap" }}>Join Our Discord</button>
          </div>
        </div>
      </section>

      <section style={{ background: "var(--charcoal)", padding: "80px 0", borderTop: "1px solid var(--border)" }}>
        <div className="container" style={{ maxWidth: 900, textAlign: "center" }}>
          <p style={{ color: "var(--green)", fontSize: 12, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", marginBottom: 12 }}>Simple Process</p>
          <h2 className="bebas" style={{ fontSize: "clamp(36px,5vw,56px)", letterSpacing: 2, marginBottom: 16 }}>How It Works</h2>
          <p style={{ color: "var(--gray)", fontSize: 16, marginBottom: 64, maxWidth: 560, margin: "0 auto 64px" }}>
            Get your edge in three steps. No complexity, no guesswork.
          </p>

          <div style={{ position: "relative", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 40 }}>
            <div style={{ position: "absolute", top: 36, left: "16%", right: "16%", height: 1, background: "linear-gradient(90deg, transparent, var(--green), transparent)", opacity: 0.3, zIndex: 0 }} />

            {[
              {
                step: "01",
                icon: "💳",
                title: "Subscribe to a Plan",
                desc: "Pick the plan that fits you. Daily, weekly, or monthly. Cancel any time, no questions asked.",
              },
              {
                step: "02",
                icon: "📲",
                title: "Receive Picks Instantly",
                desc: "Plays are sent directly to you via our VIP Discord the moment we post them. Never miss a play.",
              },
              {
                step: "03",
                icon: "🎯",
                title: "Tail Our Picks",
                desc: "Place your bets at your preferred sportsbook and let the edge do the work. We win together.",
              },
            ].map((item, i) => (
              <div key={i} style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{
                  width: 80, height: 80, borderRadius: "50%",
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 32, marginBottom: 24,
                  boxShadow: "0 0 24px rgba(34,197,94,0.08)",
                  transition: "border-color 0.2s, box-shadow 0.2s",
                  position: "relative",
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor="#22c55e"; e.currentTarget.style.boxShadow="0 0 32px rgba(34,197,94,0.2)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor="var(--border)"; e.currentTarget.style.boxShadow="0 0 24px rgba(34,197,94,0.08)"; }}
                >
                  {item.icon}
                  <div style={{ position: "absolute", top: -6, right: -6, width: 22, height: 22, borderRadius: "50%", background: "var(--green)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ fontSize: 10, fontWeight: 800, color: "#000" }}>{i + 1}</span>
                  </div>
                </div>
                <h3 className="bebas" style={{ fontSize: 22, letterSpacing: 1, marginBottom: 10, color: "var(--white)" }}>{item.title}</h3>
                <p style={{ color: "var(--gray)", fontSize: 14, lineHeight: 1.7, maxWidth: 220 }}>{item.desc}</p>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 56 }}>
            <a href="/plans" className="btn-green" style={{ fontSize: 16, padding: "14px 40px", textDecoration: "none", display: "inline-block" }}>Choose Your Plan</a>
          </div>
        </div>
      </section>

      <section style={{ background: "linear-gradient(135deg, #0d1a10, #080b0f)", padding: "80px 0", textAlign: "center" }}>
        <div className="container" style={{ maxWidth: 600 }}>
          <h2 className="bebas" style={{ fontSize: "clamp(40px,6vw,64px)", letterSpacing: 2, marginBottom: 16 }}>Ready to Get <span style={{ color: "var(--green)" }}>Your Edge?</span></h2>
          <p style={{ color: "var(--gray)", marginBottom: 36, fontSize: 16 }}>Join our community and start making sharper plays with data-driven insights.</p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <a href="/daily" className="btn-green" style={{ fontSize: 16, padding: "15px 36px", textDecoration: "none", display: "inline-block" }}>Get Today's Picks</a>
            <button className="btn-outline" style={{ fontSize: 16, padding: "15px 36px" }}>Join Discord</button>
          </div>
        </div>
      </section>
    </div>
  );
}

// Daily, Plans, Results, Reviews, Free, Support, Login pages (simplified versions)
function DailyPicksPage({ setCheckout }) {
  return <div className="container" style={{ padding: "60px 0", textAlign: "center" }}><h1 className="bebas" style={{ fontSize: 48 }}>Daily Picks</h1><p style={{ color: "var(--gray)", marginTop: 16 }}>Coming soon...</p></div>;
}

function PlansPage({ setCheckout }) {
  return <div className="container" style={{ padding: "60px 0", textAlign: "center" }}><h1 className="bebas" style={{ fontSize: 48 }}>Plans</h1><div className="grid-3" style={{ marginTop: 32 }}>{PLANS.map(plan => <div key={plan.id} className="card"><h3 style={{ fontWeight: 700, marginBottom: 8 }}>{plan.name}</h3><p className="bebas" style={{ fontSize: 32, color: "var(--green)", marginBottom: 16 }}>{plan.price}</p><button className="btn-green" style={{ width: "100%" }} onClick={() => setCheckout(plan)}>Get Started</button></div>)}</div></div>;
}

function ResultsPage() {
  return <div className="container" style={{ padding: "60px 0", textAlign: "center" }}><h1 className="bebas" style={{ fontSize: 48 }}>Results</h1><p style={{ color: "var(--gray)", marginTop: 16 }}>Coming soon...</p></div>;
}

function ReviewsPage() {
  return <div className="container" style={{ padding: "60px 0", textAlign: "center" }}><h1 className="bebas" style={{ fontSize: 48 }}>Reviews</h1><div className="grid-3" style={{ marginTop: 32 }}>{MOCK_REVIEWS.slice(0, 3).map(r => <div key={r.id} className="card"><p style={{ fontWeight: 700, marginBottom: 8 }}>{r.name}</p><p style={{ color: "var(--gold)" }}>{"★".repeat(r.stars)}</p><p style={{ color: "var(--gray)", fontSize: 14, lineHeight: 1.6, marginTop: 8 }}>{r.text}</p></div>)}</div></div>;
}

function FreePicksPage({ setCheckout }) {
  return <div className="container" style={{ padding: "60px 0", textAlign: "center" }}><h1 className="bebas" style={{ fontSize: 48 }}>Free Picks</h1><p style={{ color: "var(--gray)", marginTop: 16 }}>Coming soon...</p></div>;
}

function SupportPage() {
  return <div className="container" style={{ padding: "60px 0", textAlign: "center" }}><h1 className="bebas" style={{ fontSize: 48 }}>Support</h1><p style={{ color: "var(--gray)", marginTop: 16 }}>Coming soon...</p></div>;
}

function LoginPage() {
  return <div className="container" style={{ padding: "60px 0", textAlign: "center" }}><h1 className="bebas" style={{ fontSize: 48 }}>Login</h1><p style={{ color: "var(--gray)", marginTop: 16 }}>Coming soon...</p></div>;
}

// ─── ROOT APP ─────────────────────────────────────────────────

export default function SlipEdge() {
  const [checkout, setCheckout] = useState(null);

  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage setCheckout={setCheckout} />} />
          <Route path="/daily" element={<DailyPicksPage setCheckout={setCheckout} />} />
          <Route path="/plans" element={<PlansPage setCheckout={setCheckout} />} />
          <Route path="/results" element={<ResultsPage />} />
          <Route path="/reviews" element={<ReviewsPage />} />
          <Route path="/free" element={<FreePicksPage setCheckout={setCheckout} />} />
          <Route path="/support" element={<SupportPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<HomePage setCheckout={setCheckout} />} />
        </Routes>
        <Footer />
        <FloatingSupportButton />
        {checkout && <CheckoutModal plan={checkout} onClose={() => setCheckout(null)} />}
      </div>
    </Router>
  );
}
