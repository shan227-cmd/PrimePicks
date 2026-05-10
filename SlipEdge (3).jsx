
// ============================================================
// SLIP EDGE — Complete Multi-Page React App
// ============================================================
// Backend integration points marked with: // [BACKEND]
// Stripe integration points marked with: // [STRIPE]
// Auth integration points marked with: // [AUTH]
// ============================================================

import { useState, useEffect, useRef } from "react";

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
  { id: 1, name: "Marcus T.", stars: 5, date: "May 3, 2025", plan: "Monthly All-Access", sport: "NBA", text: "Three weeks in and already profitable. The breakdowns actually explain the reasoning — not just a pick with no context. Worth every dollar." },
  { id: 2, name: "Jordan K.", stars: 5, date: "Apr 28, 2025", plan: "Premium Weekly", sport: "MLB", text: "I was skeptical but the free picks got me hooked. Upgraded to weekly and hit 7 of my first 9. The EV plays are where the real edge is." },
  { id: 3, name: "Aiden R.", stars: 4, date: "Apr 22, 2025", plan: "Monthly All-Access", sport: "UFC", text: "The live betting alerts are insane. Got a +220 in game signal on a UFC fight that hit. Discord community is active and knowledgeable too." },
  { id: 4, name: "Priya M.", stars: 5, date: "Apr 18, 2025", plan: "Premium Weekly", sport: "NBA/MLB", text: "Switched from two other services and the quality difference is night and day. Actual analytics, not gut feelings dressed up as picks." },
  { id: 5, name: "Devon S.", stars: 5, date: "Apr 10, 2025", plan: "Monthly All-Access", sport: "MLB", text: "Started with the daily pass to test it. Went 3-1 on day one. Bought the monthly the same night. Highly recommend trying the daily pass first." },
  { id: 6, name: "Lena W.", stars: 4, date: "Apr 5, 2025", plan: "Live Betting VIP", sport: "NBA", text: "The live signals are fast and well timed. I've hit some crazy in game lines I never would have caught myself. Support is responsive too." },
];

const MOCK_TICKETS = [
  { id: "SE-1038", subject: "Can't access Discord", status: "Resolved", priority: "Medium", date: "May 5" },
  { id: "SE-1039", subject: "Billing charge question", status: "Pending", priority: "High", date: "May 6" },
  { id: "SE-1040", subject: "Picks not showing after purchase", status: "Open", priority: "High", date: "May 7" },
];

const PLANS = [
  { id: "free", name: "Free Picks", price: "$0", period: "Forever", color: "#6b7280", features: ["Daily free picks", "Community access", "Results tracking", "Limited pick access"], cta: "Get Free Picks", popular: false },
  { id: "daily", name: "Daily Picks Pass", price: "$4.99", period: "Today Only", color: "#22c55e", features: ["Premium Picks of the Day", "Risky EV / Lotto Plays", "Quick Pick Breakdowns", "Same-Day Access", "Upgrade Anytime"], cta: "Unlock Today's Picks", popular: false, note: "One-time · Lasts 24 hours" },
  { id: "weekend", name: "Weekend Pass", price: "$14.99", period: "3 Days", color: "#22c55e", features: ["Weekend premium picks", "Lottos and parlays", "Full premium Discord access", "Results access"], cta: "Choose Plan", popular: false },
  { id: "biweekly", name: "Bi-Weekly Pass", price: "$16.99", period: "2 Weeks", color: "#22c55e", features: ["All premium picks", "Risky EV plays", "Pick breakdowns", "Results access", "Upgrade anytime"], cta: "Choose Plan", popular: false },
  { id: "weekly", name: "Premium Edge Weekly", price: "$9.99", period: "Week", color: "#22c55e", features: ["All premium picks", "Live betting alerts", "VIP Discord", "Results and analytics", "Pick breakdowns"], cta: "Choose Plan", popular: true },
  { id: "monthly", name: "Monthly All-Access", price: "$35.00", period: "Month", color: "#22c55e", features: ["All premium picks", "Live betting alerts", "VIP Discord", "Advanced analytics", "Full results dashboard"], cta: "Choose Plan", popular: false },
  { id: "live", name: "Live Betting VIP", price: "$49.99", period: "Month", color: "#fbbf24", features: ["Live betting alerts", "In-game signals", "VIP Discord", "Priority support", "Fastest pick updates"], cta: "Choose Plan", popular: false },
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

  /* Profit chart bars */
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

function Navbar({ page, setPage }) {
  const [open, setOpen] = useState(false);
  const links = [
    ["Home", "home"], ["Daily Picks", "daily"], ["Plans", "plans"],
    ["Results", "results"], ["Reviews", "reviews"], ["Free Picks", "free"],
    ["Support", "support"],
  ];
  return (
    <>
      <style>{css}</style>
      <nav style={{ position: "sticky", top: 0, zIndex: 900, background: "rgba(8,11,15,0.95)", backdropFilter: "blur(16px)", borderBottom: "1px solid #1e2a35", height: 64 }}>
        <div className="container" style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <button onClick={() => setPage("home")} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 32, height: 32, background: "var(--green)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "#000", fontFamily: "'Bebas Neue', sans-serif", fontSize: 16, lineHeight: 1 }}>SE</span>
            </div>
            <span className="bebas" style={{ fontSize: 22, letterSpacing: 1, color: "var(--white)" }}>Slip Edge</span>
          </button>

          <div style={{ display: "flex", gap: 4, alignItems: "center" }} className="desktop-nav">
            {links.map(([label, id]) => (
              <button key={id} className={`nav-link${page === id ? " active" : ""}`} onClick={() => setPage(id)} style={{ padding: "6px 12px" }}>{label}</button>
            ))}
            <button className="nav-link" onClick={() => setPage("login")} style={{ padding: "6px 12px" }}>Login</button>
            <button className="btn-green" onClick={() => setPage("plans")} style={{ padding: "8px 20px", fontSize: 14, marginLeft: 8 }}>Get Picks</button>
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
          {links.map(([label, id]) => (
            <button key={id} className={`nav-link${page === id ? " active" : ""}`} onClick={() => { setPage(id); setOpen(false); }} style={{ textAlign: "left", padding: "8px 0" }}>{label}</button>
          ))}
          <button className="nav-link" onClick={() => { setPage("login"); setOpen(false); }} style={{ textAlign: "left", padding: "8px 0" }}>Login</button>
          <button className="btn-green" onClick={() => { setPage("plans"); setOpen(false); }} style={{ width: "100%" }}>Get Picks</button>
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

function Footer({ setPage }) {
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
            {[["Home","home"],["Daily Picks","daily"],["Plans","plans"],["Results","results"],["Reviews","reviews"],["Free Picks","free"],["Support","support"]].map(([l,id]) => (
              <button key={id} onClick={() => setPage(id)} style={{ display: "block", background: "none", border: "none", color: "#94a3b8", fontSize: 14, padding: "5px 0", cursor: "pointer", textAlign: "left", transition: "color 0.2s" }}
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
  const [step, setStep] = useState(1); // 1=form, 2=success
  const [method, setMethod] = useState("card");
  const [email, setEmail] = useState("");
  const [card, setCard] = useState("");

  // [STRIPE] Replace this function with Stripe Checkout Session creation
  const createCheckoutSession = async (planId, email) => {
    console.log("[STRIPE] createCheckoutSession called", { planId, email });
    // const session = await stripe.checkout.sessions.create({ ... });
    // window.location.href = session.url;
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

        {/* Plan summary */}
        <div style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: 12, padding: "14px 16px", marginBottom: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontWeight: 600 }}>{plan.name}</span>
            <span style={{ fontWeight: 700, color: "var(--green)" }}>{plan.price}</span>
          </div>
          {plan.period && <p style={{ fontSize: 12, color: "var(--gray)", marginTop: 4 }}>{plan.period}</p>}
        </div>

        {/* How it works mini-steps */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 20, position: "relative" }}>
          <div style={{ position: "absolute", top: 20, left: "18%", right: "18%", height: 1, background: "rgba(34,197,94,0.2)", zIndex: 0 }} />
          {[["💳","Subscribe"],["📲","Get Picks"],["🎯","Tail & Win"]].map(([icon, label], i) => (
            <div key={label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, zIndex: 1 }}>
              <div style={{ width: 42, height: 42, borderRadius: "50%", background: "var(--charcoal)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, position: "relative" }}>
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
              <button key={m} onClick={() => setMethod(m)} style={{ flex: 1, padding: "10px 8px", borderRadius: 8, border: `1px solid ${method===m?"var(--green)":"var(--border)"}`, background: method===m?"rgba(34,197,94,0.08)":"transparent", color: "var(--white)", cursor: "pointer", fontSize: 12, fontWeight: 600, fontFamily: "DM Sans, sans-serif" }}>
                {m==="card"?"💳 Card":m==="apple"?"🍎 Apple":m==="google"?"G Pay":"₿ Crypto"}
              </button>
            ))}
          </div>
          {method === "card" && (
            <input value={card} onChange={e => setCard(e.target.value)} placeholder="Card number" />
          )}
          {method !== "card" && (
            <div style={{ textAlign: "center", padding: 16, color: "var(--gray)", fontSize: 14, background: "#080b0f", borderRadius: 10, border: "1px solid var(--border)" }}>
              {/* [BACKEND] Integrate {method} payment provider */}
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
  const [view, setView] = useState("menu"); // menu | chat | ticket
  const [messages, setMessages] = useState([{ from: "bot", text: "Hey! How can we help you today?" }]);
  const [input, setInput] = useState("");
  const [ticketSubmitted, setTicketSubmitted] = useState(false);
  const [ticket, setTicket] = useState({ name: "", email: "", type: "General", orderId: "", message: "", priority: "Medium" });

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, { from: "user", text: input }]);
    setInput("");
    // [BACKEND] Send message to live chat backend
    setTimeout(() => {
      setMessages(prev => [...prev, { from: "bot", text: "Thanks! Our team will reply shortly. Average response time is under 2 hours." }]);
    }, 800);
  };

  const submitTicket = () => {
    // [BACKEND] POST ticket to support API
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
                {[["💬","Live Chat","chat"],["🎟️","Open a Ticket","ticket"],["💳","Billing Help","ticket"],["🏆","Pick Access Issue","ticket"],["💬","Discord Access","ticket"]].map(([icon,label,target]) => (
                  <button key={label} onClick={() => setView(target)} style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", background: "#0e1317", border: "1px solid var(--border)", borderRadius: 10, color: "var(--white)", cursor: "pointer", marginBottom: 8, fontSize: 14, fontFamily: "DM Sans, sans-serif", transition: "border-color 0.2s" }}
                    onMouseEnter={e => e.currentTarget.style.borderColor="#22c55e"} onMouseLeave={e => e.currentTarget.style.borderColor="var(--border)"}>
                    <span>{icon}</span><span>{label}</span>
                    <span style={{ marginLeft: "auto", color: "var(--gray)" }}>›</span>
                  </button>
                ))}
              </div>
            )}

            {view === "chat" && (
              <div className="fade-in">
                <button onClick={() => setView("menu")} style={{ background: "none", border: "none", color: "var(--green)", cursor: "pointer", fontSize: 13, marginBottom: 12, padding: 0, fontFamily: "DM Sans, sans-serif" }}>← Back</button>
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
                <button onClick={() => setView("menu")} style={{ background: "none", border: "none", color: "var(--green)", cursor: "pointer", fontSize: 13, marginBottom: 12, padding: 0, fontFamily: "DM Sans, sans-serif" }}>← Back</button>
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

      <button onClick={() => setOpen(!open)} style={{ position: "fixed", bottom: 24, right: 24, width: 56, height: 56, borderRadius: "50%", background: "var(--white)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9998, boxShadow: "0 4px 20px rgba(0,0,0,0.4)", transition: "transform 0.2s" }}
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
      {/* Main card */}
      <div style={{ background: "rgba(17,24,32,0.9)", border: "1px solid #1e2a35", borderRadius: 20, padding: 24, backdropFilter: "blur(20px)", boxShadow: "0 0 60px rgba(34,197,94,0.1)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <span style={{ fontSize: 13, color: "var(--gray)", fontWeight: 600 }}>Slip Edge · Pick Tracker</span>
          <span style={{ background: "rgba(34,197,94,0.15)", color: "var(--green)", fontSize: 11, padding: "3px 8px", borderRadius: 6, fontWeight: 700 }}>LIVE</span>
        </div>

        {/* Stats row */}
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

        {/* Profit chart — only visual shown */}
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

      {/* Floating badge — neutral stat */}
      <div style={{ position: "absolute", top: -16, right: -16, background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.3)", borderRadius: 12, padding: "10px 16px", backdropFilter: "blur(10px)" }}>
        <p style={{ fontSize: 11, color: "var(--gray)" }}>Picks This Week</p>
        <p className="bebas" style={{ fontSize: 26, color: "var(--green)", letterSpacing: 1 }}>8 Plays</p>
      </div>
    </div>
  );
}

// ─── PAGE: HOME ───────────────────────────────────────────────

function HomePage({ setPage, setCheckout }) {
  return (
    <div>
      {/* Hero */}
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
              <button className="btn-green" style={{ fontSize: 16, padding: "14px 32px" }} onClick={() => setPage("plans")}>View Plans</button>
              <button className="btn-outline" style={{ fontSize: 16, padding: "14px 32px" }} onClick={() => setPage("free")}>Get Free Picks</button>
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

      {/* Trust Bar */}
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

      {/* What We Offer */}
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

      {/* Pricing Preview */}
      <section className="section" style={{ background: "var(--charcoal)" }}>
        <div className="container">
          <p style={{ color: "var(--green)", fontSize: 12, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", marginBottom: 12 }}>Pricing</p>
          <h2 className="bebas" style={{ fontSize: "clamp(36px,5vw,56px)", letterSpacing: 1, marginBottom: 48 }}>Pick Your Plan</h2>
          <div className="grid-3">
            {PLANS.slice(1,4).map(plan => (
              <div key={plan.id} className={`card${plan.popular?" glow-green pulse":""}`} style={{ border: plan.popular ? "1px solid var(--green)" : "1px solid var(--border)", position: "relative", transition: "transform 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.transform="translateY(-4px)"} onMouseLeave={e => e.currentTarget.style.transform="none"}>
                {plan.popular && <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", background: "var(--green)", color: "#000", fontSize: 11, fontWeight: 800, padding: "4px 14px", borderRadius: 999, whiteSpace: "nowrap" }}>MOST POPULAR</div>}
                <p style={{ color: "var(--gray)", fontSize: 13, marginBottom: 8 }}>{plan.name}</p>
                <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 20 }}>
                  <span className="bebas" style={{ fontSize: 40, letterSpacing: 1, color: plan.popular ? "var(--green)" : "var(--white)" }}>{plan.price}</span>
                  <span style={{ color: "var(--gray)", fontSize: 14 }}>/ {plan.period}</span>
                </div>
                <button className={plan.popular ? "btn-green" : "btn-outline"} style={{ width: "100%", marginBottom: 16 }} onClick={() => setCheckout(plan)}>
                  {plan.cta}
                </button>
                {plan.note && <p style={{ fontSize: 12, color: "#475569", textAlign: "center", marginBottom: 12 }}>{plan.note}</p>}
                {plan.features.slice(0,3).map(f => (
                  <p key={f} style={{ fontSize: 13, color: "var(--gray)", padding: "4px 0", display: "flex", gap: 8 }}><span style={{ color: "var(--green)" }}>✓</span>{f}</p>
                ))}
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: 32 }}>
            <button className="btn-outline" onClick={() => setPage("plans")} style={{ fontSize: 15 }}>View All Plans →</button>
          </div>
        </div>
      </section>

      {/* Discord Track Record CTA */}
      <section className="section">
        <div className="container">
          <div className="card" style={{ background: "linear-gradient(135deg, #111820, #0e1a10)", border: "1px solid rgba(34,197,94,0.2)", display: "flex", alignItems: "center", gap: 32, flexWrap: "wrap", padding: "36px 40px" }}>
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

      {/* How It Works */}
      <section style={{ background: "var(--charcoal)", padding: "80px 0", borderTop: "1px solid var(--border)" }}>
        <div className="container" style={{ maxWidth: 900, textAlign: "center" }}>
          <p style={{ color: "var(--green)", fontSize: 12, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", marginBottom: 12 }}>Simple Process</p>
          <h2 className="bebas" style={{ fontSize: "clamp(36px,5vw,56px)", letterSpacing: 2, marginBottom: 16 }}>How It Works</h2>
          <p style={{ color: "var(--gray)", fontSize: 16, marginBottom: 64, maxWidth: 560, margin: "0 auto 64px" }}>
            Get your edge in three steps. No complexity, no guesswork.
          </p>

          {/* Steps */}
          <div style={{ position: "relative", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 40 }}>
            {/* Connector line */}
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
                {/* Icon circle */}
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
                  {/* Step number badge */}
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
            <button className="btn-green" style={{ fontSize: 16, padding: "14px 40px" }} onClick={() => setPage("plans")}>Choose Your Plan</button>
          </div>
        </div>
      </section>

      {/* Home CTA */}
      <section style={{ background: "linear-gradient(135deg, #0d1a10, #080b0f)", padding: "80px 0", textAlign: "center" }}>
        <div className="container" style={{ maxWidth: 600 }}>
          <h2 className="bebas" style={{ fontSize: "clamp(40px,6vw,64px)", letterSpacing: 2, marginBottom: 16 }}>Ready to Get <span style={{ color: "var(--green)" }}>Your Edge?</span></h2>
          <p style={{ color: "var(--gray)", marginBottom: 36, fontSize: 16 }}>Join our community and start making sharper plays with data-driven insights.</p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <button className="btn-green" style={{ fontSize: 16, padding: "15px 36px" }} onClick={() => setPage("daily")}>Get Today's Picks</button>
            <button className="btn-outline" style={{ fontSize: 16, padding: "15px 36px" }}>Join Discord</button>
          </div>
        </div>
      </section>
    </div>
  );
}

// ─── PAGE: DAILY PICKS ────────────────────────────────────────

function DailyPicksPage({ setCheckout }) {
  const [purchased, setPurchased] = useState(false);
  const plan = PLANS.find(p => p.id === "daily");
  const expiry = "8h 42m";

  return (
    <div>
      <section style={{ padding: "64px 0 40px", background: "linear-gradient(180deg, #0d1a10 0%, #080b0f 100%)" }}>
        <div className="container" style={{ maxWidth: 740, textAlign: "center" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.25)", borderRadius: 999, padding: "6px 14px", marginBottom: 24 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--green)", display: "inline-block", animation: "pulse-green 2s infinite" }}></span>
            <span style={{ color: "var(--green)", fontSize: 12, fontWeight: 700 }}>TODAY'S PICKS ARE LIVE</span>
          </div>
          <h1 className="bebas" style={{ fontSize: "clamp(48px,7vw,72px)", letterSpacing: 2, marginBottom: 16 }}>Today's Edge for <span style={{ color: "var(--green)" }}>$4.99.</span></h1>
          <p style={{ color: "var(--gray)", fontSize: 17, lineHeight: 1.7, marginBottom: 32, maxWidth: 520, margin: "0 auto 32px" }}>
            Unlock today's premium picks and risky EV plays without buying a full membership.
          </p>
          {!purchased ? (
            <button className="btn-green glow-green" style={{ fontSize: 17, padding: "15px 40px" }} onClick={() => setCheckout(plan)}>Unlock Today's Picks for $4.99</button>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: 12, justifyContent: "center", background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.3)", borderRadius: 12, padding: "14px 24px", display: "inline-flex" }}>
              <span style={{ color: "var(--green)", fontSize: 20 }}>✓</span>
              <span style={{ fontWeight: 600 }}>Access Active</span>
              <span style={{ color: "var(--gray)", fontSize: 14 }}>Expires in {expiry}</span>
            </div>
          )}
          <p style={{ color: "#475569", fontSize: 13, marginTop: 16 }}>One-time payment · No subscription · Access lasts 24 hours</p>
        </div>
      </section>

      {/* What's Included */}
      <section className="section-sm">
        <div className="container" style={{ maxWidth: 800 }}>
          <h2 className="bebas" style={{ fontSize: 36, letterSpacing: 1, marginBottom: 24, textAlign: "center" }}>What's Included</h2>
          <div className="grid-2">
            {[["Today's Premium Picks","Expert analyzed picks across available sports with full confidence ratings."],["Today's Risky EV Plays","High upside positive expected value plays for bigger potential returns."],["Quick Pick Breakdowns","Short reasoning behind each pick so you understand the edge."],["Upgrade Anytime","Move to a weekly or monthly plan and get your $4.99 credited."]].map(([t,d]) => (
              <div key={t} className="card" style={{ display: "flex", gap: 14 }}>
                <span style={{ color: "var(--green)", fontSize: 20, flexShrink: 0 }}>✓</span>
                <div>
                  <p style={{ fontWeight: 700, marginBottom: 4 }}>{t}</p>
                  <p style={{ color: "var(--gray)", fontSize: 14, lineHeight: 1.6 }}>{d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pick Cards */}
      <section className="section-sm">
        <div className="container" style={{ maxWidth: 900 }}>
          <h2 className="bebas" style={{ fontSize: 36, letterSpacing: 1, marginBottom: 24 }}>Today's Picks</h2>
          <div className="grid-2">
            {[
              { sport: "NBA", type: "Premium Pick", confidence: 88 },
              { sport: "MLB", type: "Risky EV Play", confidence: 74 },
              { sport: "UFC", type: "Prop Pick", confidence: 68 },
              { sport: "MLB", type: "Premium Pick", confidence: 81 },
            ].map((pick, i) => (
              <div key={i} className="card" style={{ position: "relative", overflow: "hidden", minHeight: 160 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                  <span className="sport-badge" style={{ background: sportColor(pick.sport), color: "#fff" }}>{pick.sport}</span>
                  <span className="tag" style={{ background: "rgba(34,197,94,0.1)", color: "var(--green)" }}>{pick.type}</span>
                </div>
                <p style={{ fontWeight: 700, fontSize: 20, marginBottom: 8 }}>Locked</p>
                <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                  <div style={{ flex: 1, background: "#080b0f", borderRadius: 6, padding: 8 }}>
                    <p style={{ fontSize: 10, color: "var(--gray)", marginBottom: 2 }}>CONFIDENCE</p>
                    <div style={{ height: 4, background: "#1e2a35", borderRadius: 2 }}>
                      <div style={{ width: `${pick.confidence}%`, height: "100%", background: "var(--green)", borderRadius: 2 }} />
                    </div>
                  </div>
                </div>
                {!purchased && (
                  <div className="locked-overlay">
                    <div style={{ textAlign: "center" }}>
                      <span style={{ fontSize: 28 }}>🔒</span>
                      <p style={{ fontSize: 13, color: "var(--gray)", marginTop: 8 }}>Unlock for $4.99</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Checkout card + upsell */}
      <section className="section-sm">
        <div className="container" style={{ maxWidth: 900 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20 }}>
            {[
              { name: "Daily Picks Pass", price: "$4.99", period: "Today only", note: "No subscription", plan: PLANS[1] },
              { name: "Bi-Weekly Pass", price: "$16.99", period: "/ 2 weeks", note: "All picks + access", plan: PLANS[3] },
              { name: "Monthly All-Access", price: "$35.00", period: "/ month", note: "Full access", plan: PLANS[5] },
            ].map((opt, i) => (
              <div key={opt.name} className="card" style={{ border: i === 0 ? "1px solid var(--green)" : "1px solid var(--border)", textAlign: "center" }}>
                {i === 0 && <p style={{ fontSize: 11, color: "var(--green)", fontWeight: 700, marginBottom: 8 }}>CURRENT PLAN</p>}
                <p style={{ fontWeight: 700, marginBottom: 8 }}>{opt.name}</p>
                <p className="bebas" style={{ fontSize: 32, letterSpacing: 1, color: i === 0 ? "var(--green)" : "var(--white)", marginBottom: 4 }}>{opt.price}</p>
                <p style={{ color: "var(--gray)", fontSize: 13, marginBottom: 16 }}>{opt.period} · {opt.note}</p>
                <button className={i === 0 ? "btn-green" : "btn-outline"} style={{ width: "100%", fontSize: 13 }} onClick={() => setCheckout(opt.plan)}>
                  {i === 0 ? "Buy Today's Picks" : "Upgrade"}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

// ─── PAGE: PLANS ──────────────────────────────────────────────

function PlansPage({ setCheckout }) {
  return (
    <div>
      <section style={{ padding: "64px 0 40px", textAlign: "center" }}>
        <div className="container" style={{ maxWidth: 640 }}>
          <p style={{ color: "var(--green)", fontSize: 12, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", marginBottom: 12 }}>Pricing</p>
          <h1 className="bebas" style={{ fontSize: "clamp(48px,7vw,72px)", letterSpacing: 2, marginBottom: 16 }}>Choose Your Edge</h1>
          <p style={{ color: "var(--gray)", fontSize: 16, lineHeight: 1.7 }}>Start free or go all-in. Every plan gives you access to our data-driven picks framework.</p>
        </div>
      </section>

      <section className="section-sm">
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
            {PLANS.map(plan => (
              <div key={plan.id} className={`card${plan.popular?" glow-green pulse":""}`} style={{ border: plan.popular ? "1px solid var(--green)" : plan.id === "live" ? "1px solid rgba(251,191,36,0.4)" : "1px solid var(--border)", position: "relative", transition: "transform 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.transform="translateY(-4px)"} onMouseLeave={e => e.currentTarget.style.transform="none"}>
                {plan.popular && <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", background: "var(--green)", color: "#000", fontSize: 11, fontWeight: 800, padding: "4px 14px", borderRadius: 999, whiteSpace: "nowrap" }}>MOST POPULAR</div>}
                {plan.id === "live" && <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", background: "var(--gold)", color: "#000", fontSize: 11, fontWeight: 800, padding: "4px 14px", borderRadius: 999, whiteSpace: "nowrap" }}>VIP TIER</div>}
                <p style={{ color: "var(--gray)", fontSize: 13, marginBottom: 8, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>{plan.name}</p>
                <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 6 }}>
                  <span className="bebas" style={{ fontSize: 44, letterSpacing: 1, color: plan.popular ? "var(--green)" : plan.id === "live" ? "var(--gold)" : "var(--white)" }}>{plan.price}</span>
                  <span style={{ color: "var(--gray)", fontSize: 13 }}>/ {plan.period}</span>
                </div>
                {plan.note && <p style={{ fontSize: 12, color: "#475569", marginBottom: 16 }}>{plan.note}</p>}
                <button className={plan.popular ? "btn-green" : plan.id === "live" ? "btn-green" : "btn-outline"} style={{ width: "100%", marginBottom: 20, background: plan.id === "live" && !plan.popular ? "var(--gold)" : undefined, color: plan.id === "live" && !plan.popular ? "#000" : undefined }} onClick={() => setCheckout(plan)}>
                  {plan.cta}
                </button>
                <div style={{ borderTop: "1px solid var(--border)", paddingTop: 16 }}>
                  {plan.features.map(f => (
                    <p key={f} style={{ fontSize: 14, color: "var(--gray)", padding: "5px 0", display: "flex", gap: 10 }}>
                      <span style={{ color: plan.id === "free" ? "var(--gray)" : plan.id === "live" ? "var(--gold)" : "var(--green)" }}>✓</span>{f}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: "40px 0" }}>
        <div className="container" style={{ maxWidth: 700, textAlign: "center" }}>
          <div className="card">
            <p style={{ fontSize: 13, color: "#475569", lineHeight: 1.7 }}>
              <strong style={{ color: "var(--white)" }}>Disclaimer:</strong> Slip Edge provides sports analysis and informational content only. No pick is guaranteed to win. Past performance does not guarantee future results. Bet responsibly. 18+ only. Please gamble responsibly and within your means.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

// ─── PAGE: RESULTS ────────────────────────────────────────────

function ResultsPage() {
  const [filter, setFilter] = useState("All");
  const sports = ["All", "NBA", "MLB", "UFC"];
  const filtered = filter === "All" ? MOCK_PICKS : MOCK_PICKS.filter(p => p.sport === filter || p.type === filter);
  const wins = MOCK_PICKS.filter(p => p.result === "Win").length;
  const winRate = ((wins / MOCK_PICKS.length) * 100).toFixed(1);
  const totalUnits = MOCK_PICKS.reduce((sum, p) => sum + parseFloat(p.units), 0).toFixed(2);

  const chartData = [5, 8, 6, 12, 10, 15, 13, 18, 16, 22, 20, 28, 26, 32, 30, 38, 36, 42];

  return (
    <div>
      <section style={{ padding: "64px 0 40px" }}>
        <div className="container">
          <p style={{ color: "var(--green)", fontSize: 12, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", marginBottom: 12 }}>Track Record</p>
          <h1 className="bebas" style={{ fontSize: "clamp(48px,7vw,72px)", letterSpacing: 2, marginBottom: 16 }}>Our Results</h1>
          <p style={{ color: "var(--gray)", fontSize: 16 }}>Transparent performance data. No cherrypicking, no hidden losses.</p>
        </div>
      </section>

      {/* Stats */}
      <section className="section-sm">
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, marginBottom: 32 }}>
            {[
              ["Total Picks Posted", `${MOCK_PICKS.length}`, "Sample, growing daily"],
              ["Sports Covered", "NBA · MLB · UFC", "Year-round coverage"],
              ["Avg. Odds Per Pick", "+112", "Across all pick types"],
            ].map(([l,v,sub]) => (
              <div key={l} className="card" style={{ textAlign: "center" }}>
                <p style={{ color: "var(--gray)", fontSize: 13, marginBottom: 8 }}>{l}</p>
                <p className="bebas" style={{ fontSize: v.length > 8 ? 28 : 48, letterSpacing: 1, color: "var(--green)", lineHeight: 1.1 }}>{v}</p>
                <p style={{ color: "#475569", fontSize: 13, marginTop: 6 }}>{sub}</p>
              </div>
            ))}
          </div>

          {/* Profit Chart */}
          <div className="card" style={{ marginBottom: 32 }}>
            <p style={{ fontWeight: 700, marginBottom: 20 }}>Profit Over Time  Last 30 Days</p>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 120, paddingBottom: 8 }}>
              {chartData.map((v, i) => (
                <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                  <div style={{ flex: 1, width: "100%", background: `rgba(34,197,94,${0.2 + (i / chartData.length) * 0.6})`, borderRadius: "4px 4px 0 0", minHeight: `${(v / 42) * 100}%`, transition: "all 0.5s ease" }} />
                </div>
              ))}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 8, borderTop: "1px solid var(--border)", marginTop: 4 }}>
              <span style={{ fontSize: 12, color: "#475569" }}>Apr 8</span>
              <span style={{ fontSize: 12, color: "#475569" }}>May 8</span>
            </div>
          </div>

          {/* Filter */}
          <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
            {sports.map(s => (
              <button key={s} onClick={() => setFilter(s)} style={{ padding: "7px 16px", borderRadius: 8, border: `1px solid ${filter===s?"var(--green)":"var(--border)"}`, background: filter===s?"rgba(34,197,94,0.1)":"transparent", color: filter===s?"var(--green)":"var(--gray)", cursor: "pointer", fontSize: 13, fontWeight: 600, fontFamily: "DM Sans, sans-serif" }}>
                {s}
              </button>
            ))}
          </div>

          <div className="card" style={{ overflowX: "auto" }}>
            <table>
              <thead><tr><th>Date</th><th>Sport</th><th>Pick</th><th>Odds</th><th>Type</th><th>Result</th><th>Units</th></tr></thead>
              <tbody>
                {filtered.map(p => (
                  <tr key={p.id}>
                    <td style={{ color: "var(--gray)", fontSize: 13 }}>{p.date}</td>
                    <td><span className="sport-badge" style={{ background: sportColor(p.sport), color: "#fff" }}>{p.sport}</span></td>
                    <td style={{ fontWeight: 500 }}>{p.pick}</td>
                    <td style={{ color: "var(--gray)" }}>{p.odds}</td>
                    <td><span className="tag" style={{ background: "rgba(255,255,255,0.06)", color: "var(--gray)" }}>{p.type}</span></td>
                    <td><span style={{ color: p.result === "Win" ? "var(--green)" : p.result === "Push" ? "var(--gold)" : "var(--red)", fontWeight: 700 }}>{p.result}</span></td>
                    <td style={{ color: p.units.startsWith("+") ? "var(--green)" : "var(--red)", fontWeight: 700 }}>{p.units}u</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Discord full track record CTA */}
          <div className="card" style={{ marginTop: 24, background: "linear-gradient(135deg, #111820, #0e1a10)", border: "1px solid rgba(34,197,94,0.2)", display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap", padding: "28px 32px" }}>
            <div style={{ fontSize: 40 }}>💬</div>
            <div style={{ flex: 1, minWidth: 200 }}>
              <p style={{ fontWeight: 700, fontSize: 17, marginBottom: 4 }}>Want the Full Track Record?</p>
              <p style={{ color: "var(--gray)", fontSize: 14, lineHeight: 1.6 }}>Join our Discord for the complete history of every NBA, MLB, and UFC pick. Every result, fully transparent, nothing hidden.</p>
            </div>
            <button className="btn-green" style={{ whiteSpace: "nowrap" }}>Join Our Discord</button>
          </div>

          <div className="card" style={{ marginTop: 16, background: "rgba(251,191,36,0.05)", border: "1px solid rgba(251,191,36,0.2)" }}>
            <p style={{ color: "var(--gold)", fontSize: 13 }}>⚠ Past results do not guarantee future performance. Sports betting involves risk. Bet responsibly.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

// ─── PAGE: REVIEWS ────────────────────────────────────────────

function ReviewsPage() {
  // Replace placeholder reviews with real customer reviews before launch.
  const stars = (n) => "★".repeat(n) + "☆".repeat(5 - n);

  return (
    <div>
      <section style={{ padding: "64px 0 40px", textAlign: "center" }}>
        <div className="container" style={{ maxWidth: 600 }}>
          <p style={{ color: "var(--green)", fontSize: 12, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", marginBottom: 12 }}>Social Proof</p>
          <h1 className="bebas" style={{ fontSize: "clamp(48px,7vw,72px)", letterSpacing: 2, marginBottom: 16 }}>What Members Say</h1>
          <div style={{ display: "flex", justifyContent: "center", gap: 32, flexWrap: "wrap", marginTop: 32 }}>
            {[["4.8/5","Average Rating"],["1,800+","Verified Reviews"],["98%","Would Recommend"]].map(([v,l]) => (
              <div key={l} style={{ textAlign: "center" }}>
                <p className="bebas" style={{ fontSize: 40, letterSpacing: 1, color: "var(--green)" }}>{v}</p>
                <p style={{ color: "var(--gray)", fontSize: 13 }}>{l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-sm">
        <div className="container">
          <div className="grid-3">
            {MOCK_REVIEWS.map(r => (
              <div key={r.id} className="card" style={{ transition: "transform 0.2s, border-color 0.2s" }}
                onMouseEnter={e => { e.currentTarget.style.transform="translateY(-3px)"; e.currentTarget.style.borderColor="#22c55e"; }}
                onMouseLeave={e => { e.currentTarget.style.transform="none"; e.currentTarget.style.borderColor="var(--border)"; }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 12 }}>
                  <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    <div style={{ width: 38, height: 38, borderRadius: "50%", background: `hsl(${r.id * 60}, 50%, 25%)`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 14 }}>{r.name[0]}</div>
                    <div>
                      <p style={{ fontWeight: 600, fontSize: 14 }}>{r.name}</p>
                      <span className="tag" style={{ background: "rgba(34,197,94,0.08)", color: "var(--green)", fontSize: 10 }}>✓ Verified</span>
                    </div>
                  </div>
                  <p style={{ color: "#475569", fontSize: 12 }}>{r.date}</p>
                </div>
                <p style={{ color: "var(--gold)", letterSpacing: 2, marginBottom: 10 }}>{stars(r.stars)}</p>
                <p style={{ color: "var(--gray)", fontSize: 14, lineHeight: 1.7, marginBottom: 12 }}>{r.text}</p>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <span className="tag" style={{ background: "rgba(255,255,255,0.05)", color: "var(--gray)" }}>{r.plan}</span>
                  <span className="tag" style={{ background: `${sportColor(r.sport.split("/")[0])}22`, color: sportColor(r.sport.split("/")[0]) }}>{r.sport}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

// ─── PAGE: FREE PICKS ─────────────────────────────────────────

function FreePicksPage({ setPage, setCheckout }) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <div>
      <section style={{ padding: "64px 0 40px", textAlign: "center" }}>
        <div className="container" style={{ maxWidth: 600 }}>
          <p style={{ color: "var(--green)", fontSize: 12, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", marginBottom: 12 }}>Free Access</p>
          <h1 className="bebas" style={{ fontSize: "clamp(48px,7vw,72px)", letterSpacing: 2, marginBottom: 16 }}>Start Free.</h1>
          <p style={{ color: "var(--gray)", fontSize: 16, lineHeight: 1.7 }}>Start free. Upgrade when you want the full edge.</p>
        </div>
      </section>

      {/* Free Picks Preview */}
      <section className="section-sm">
        <div className="container" style={{ maxWidth: 800 }}>
          <h2 className="bebas" style={{ fontSize: 36, letterSpacing: 1, marginBottom: 24 }}>Today's Free Picks</h2>
          <div className="grid-2" style={{ marginBottom: 40 }}>
            {[
              { sport: "NBA", pick: "Celtics ML", type: "Free Pick", locked: false },
              { sport: "MLB", pick: "Dodgers -1.5", type: "Free Pick", locked: false },
              { sport: "UFC", pick: "Fighter A KO", type: "Premium 🔒", locked: true },
              { sport: "NBA", pick: "Heat +6.5", type: "Premium 🔒", locked: true },
            ].map((p, i) => (
              <div key={i} className="card" style={{ position: "relative", overflow: "hidden" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                  <span className="sport-badge" style={{ background: sportColor(p.sport), color: "#fff" }}>{p.sport}</span>
                  <span className="tag" style={{ background: p.locked ? "rgba(239,68,68,0.1)" : "rgba(34,197,94,0.1)", color: p.locked ? "var(--red)" : "var(--green)" }}>{p.type}</span>
                </div>
                <p style={{ fontWeight: 700, fontSize: 20 }}>{p.locked ? "Locked" : p.pick}</p>
                {p.locked && (
                  <div className="locked-overlay">
                    <div style={{ textAlign: "center" }}>
                      <span style={{ fontSize: 24 }}>🔒</span>
                      <p style={{ fontSize: 12, color: "var(--gray)", marginTop: 6 }}>Premium only</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Email Signup */}
          <div className="card" style={{ border: "1px solid rgba(34,197,94,0.25)", textAlign: "center", marginBottom: 32 }}>
            <h3 style={{ fontWeight: 700, fontSize: 22, marginBottom: 8 }}>Get Free Picks by Email</h3>
            <p style={{ color: "var(--gray)", marginBottom: 24, fontSize: 14 }}>Daily free picks delivered to your inbox. No spam. Unsubscribe anytime.</p>
            {!submitted ? (
              <div style={{ display: "flex", gap: 10, maxWidth: 420, margin: "0 auto" }}>
                <input value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" type="email" />
                <button className="btn-green" style={{ whiteSpace: "nowrap" }} onClick={() => { if(email) setSubmitted(true); }}>
                  {/* [BACKEND] Subscribe email to mailing list */}
                  Get Picks
                </button>
              </div>
            ) : (
              <p style={{ color: "var(--green)", fontWeight: 600 }}>✓ You're subscribed! Check your inbox.</p>
            )}
          </div>

          {/* Discord CTA */}
          <div className="card" style={{ background: "linear-gradient(135deg, #111820, #0e1a10)", border: "1px solid rgba(34,197,94,0.2)", display: "flex", alignItems: "center", gap: 24, marginBottom: 32, flexWrap: "wrap" }}>
            <div style={{ fontSize: 48 }}>💬</div>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontWeight: 700, marginBottom: 6 }}>Join Our Discord Community</h3>
              <p style={{ color: "var(--gray)", fontSize: 14 }}>Free picks, discussions, and community picks. All in our active Discord server.</p>
            </div>
            <button className="btn-green">Join Discord Free</button>
          </div>

          {/* Free vs Premium */}
          <h2 className="bebas" style={{ fontSize: 32, letterSpacing: 1, marginBottom: 20 }}>Free vs Premium</h2>
          <div className="card" style={{ overflowX: "auto" }}>
            <table>
              <thead><tr><th>Feature</th><th style={{ color: "var(--gray)" }}>Free</th><th style={{ color: "var(--green)" }}>Premium</th></tr></thead>
              <tbody>
                {[["Daily Free Picks","✓","✓"],["Premium Pick Breakdowns"," ","✓"],["Risky EV Plays"," ","✓"],["Live Betting Alerts"," ","✓"],["VIP Discord"," ","✓"],["Advanced Analytics"," ","✓"],["Priority Support"," ","✓"]].map(([f,fr,pr]) => (
                  <tr key={f}>
                    <td>{f}</td>
                    <td style={{ color: fr==="✓"?"var(--green)":"#475569", fontWeight: 700 }}>{fr}</td>
                    <td style={{ color: "var(--green)", fontWeight: 700 }}>{pr}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ textAlign: "center", marginTop: 32 }}>
            <button className="btn-green" style={{ fontSize: 16, padding: "14px 40px" }} onClick={() => setPage("plans")}>Upgrade to Premium →</button>
          </div>
        </div>
      </section>
    </div>
  );
}

// ─── PAGE: SUPPORT ────────────────────────────────────────────

function SupportPage() {
  const [ticket, setTicket] = useState({ name: "", email: "", type: "General", orderId: "", message: "", priority: "Medium" });
  const [submitted, setSubmitted] = useState(false);
  const [activeTickets] = useState(MOCK_TICKETS);

  const submitTicket = () => {
    // [BACKEND] POST ticket to support system (Zendesk, Freshdesk, custom API)
    console.log("[BACKEND] createTicket", ticket);
    setSubmitted(true);
  };

  return (
    <div>
      <section style={{ padding: "64px 0 40px", textAlign: "center" }}>
        <div className="container" style={{ maxWidth: 600 }}>
          <h1 className="bebas" style={{ fontSize: "clamp(48px,7vw,72px)", letterSpacing: 2, marginBottom: 12 }}>How Can We Help?</h1>
          <p style={{ color: "var(--gray)", fontSize: 16 }}>Chat with our team or open a ticket and we'll get back to you.</p>
        </div>
      </section>

      {/* Categories */}
      <section className="section-sm">
        <div className="container">
          <div className="grid-3" style={{ marginBottom: 48 }}>
            {[["💳","Billing","Payment issues, refunds, and subscription management."],["🏆","Pick Access","Can't see your picks after purchase? We'll fix it fast."],["💬","Discord Access","Trouble joining our VIP Discord? Get your invite link."],["⚙️","Technical","App bugs, loading issues, and general technical help."],["❓","General","Questions about plans, picks methodology, or anything else."],["🚨","Priority","Urgent issues handled by senior support staff."]].map(([icon,title,desc]) => (
              <div key={title} className="card" style={{ cursor: "pointer", transition: "all 0.2s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor="#22c55e"; e.currentTarget.style.transform="translateY(-2px)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor="var(--border)"; e.currentTarget.style.transform="none"; }}>
                <div style={{ fontSize: 32, marginBottom: 10 }}>{icon}</div>
                <h3 style={{ fontWeight: 700, marginBottom: 6 }}>{title}</h3>
                <p style={{ color: "var(--gray)", fontSize: 14, lineHeight: 1.6 }}>{desc}</p>
              </div>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
            {/* Ticket Form */}
            <div>
              <h2 className="bebas" style={{ fontSize: 32, letterSpacing: 1, marginBottom: 24 }}>Open a Ticket</h2>
              {!submitted ? (
                <div className="card">
                  {[["name","Full Name","text"],["email","Email","email"],["orderId","Order ID (optional)","text"]].map(([k,l,t]) => (
                    <div key={k} style={{ marginBottom: 14 }}>
                      <label>{l}</label>
                      <input type={t} value={ticket[k]} onChange={e => setTicket(p => ({...p,[k]:e.target.value}))} />
                    </div>
                  ))}
                  <div style={{ marginBottom: 14 }}>
                    <label>Issue Type</label>
                    <select value={ticket.type} onChange={e => setTicket(p => ({...p,type:e.target.value}))}>
                      {["General","Billing","Pick Access","Discord Access","Technical","Other"].map(t => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                  <div style={{ marginBottom: 14 }}>
                    <label>Priority</label>
                    <select value={ticket.priority} onChange={e => setTicket(p => ({...p,priority:e.target.value}))}>
                      {["Low","Medium","High","Urgent"].map(t => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                  <div style={{ marginBottom: 20 }}>
                    <label>Message</label>
                    <textarea rows={4} value={ticket.message} onChange={e => setTicket(p => ({...p,message:e.target.value}))} placeholder="Describe your issue in detail..." />
                  </div>
                  <button className="btn-green" style={{ width: "100%" }} onClick={submitTicket}>Create Ticket</button>
                </div>
              ) : (
                <div className="card" style={{ textAlign: "center", border: "1px solid rgba(34,197,94,0.3)" }}>
                  <div style={{ width: 56, height: 56, background: "rgba(34,197,94,0.1)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                    <span style={{ fontSize: 24, color: "var(--green)" }}>✓</span>
                  </div>
                  <h3 style={{ fontWeight: 700, marginBottom: 8 }}>Ticket #SE-1042 Created</h3>
                  <p style={{ color: "var(--gray)", fontSize: 14, marginBottom: 20 }}>We'll get back to you within 24 hours at the email you provided.</p>
                  <button className="btn-outline" onClick={() => setSubmitted(false)}>Submit Another</button>
                </div>
              )}
            </div>

            {/* Ticket Dashboard */}
            <div>
              <h2 className="bebas" style={{ fontSize: 32, letterSpacing: 1, marginBottom: 24 }}>Ticket Status</h2>
              <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
                {[["Open","1","var(--red)"],["Pending","1","var(--gold)"],["Resolved","1","var(--green)"]].map(([s,n,c]) => (
                  <div key={s} style={{ flex: 1, background: "var(--card)", border: "1px solid var(--border)", borderRadius: 10, padding: "12px 14px", textAlign: "center" }}>
                    <p style={{ color: c, fontWeight: 800, fontSize: 22 }}>{n}</p>
                    <p style={{ color: "var(--gray)", fontSize: 12 }}>{s}</p>
                  </div>
                ))}
              </div>
              {activeTickets.map(t => (
                <div key={t.id} className="card" style={{ marginBottom: 12, padding: 16 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <p style={{ fontWeight: 600, fontSize: 14 }}>{t.id}</p>
                    <span className="tag" style={{ background: t.status === "Resolved" ? "rgba(34,197,94,0.1)" : t.status === "Pending" ? "rgba(251,191,36,0.1)" : "rgba(239,68,68,0.1)", color: t.status === "Resolved" ? "var(--green)" : t.status === "Pending" ? "var(--gold)" : "var(--red)" }}>{t.status}</span>
                  </div>
                  <p style={{ color: "var(--gray)", fontSize: 14, marginBottom: 6 }}>{t.subject}</p>
                  <div style={{ display: "flex", gap: 8 }}>
                    <span className="tag" style={{ background: "rgba(255,255,255,0.05)", color: "#475569" }}>Priority: {t.priority}</span>
                    <span className="tag" style={{ background: "rgba(255,255,255,0.05)", color: "#475569" }}>{t.date}</span>
                  </div>
                </div>
              ))}

              {/* Support Team Role Panel */}
              <div className="card" style={{ marginTop: 20 }}>
                <p style={{ fontWeight: 700, marginBottom: 12 }}>Support Team</p>
                {[["👑","Admin","All tickets & system access"],["🎧","Support","General & technical tickets"],["💳","Billing","Payment & refund tickets"],["📊","Analysts","Pick access & sports queries"]].map(([icon,role,access]) => (
                  <div key={role} style={{ display: "flex", gap: 10, alignItems: "center", padding: "8px 0", borderBottom: "1px solid var(--border)" }}>
                    <span>{icon}</span>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: 600, fontSize: 13 }}>{role}</p>
                      <p style={{ color: "var(--gray)", fontSize: 12 }}>{access}</p>
                    </div>
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--green)", display: "inline-block" }} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// ─── PAGE: LOGIN / DASHBOARD ──────────────────────────────────

function LoginPage({ setPage }) {
  const [tab, setTab] = useState("login"); // login | signup | dashboard
  const [userPlan, setUserPlan] = useState("weekly"); // free|daily|weekly|monthly|live
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  const planLabels = { free: "Free", daily: "Daily Pass", biweekly: "Bi-Weekly Pass", weekly: "Premium Weekly", monthly: "Monthly All-Access", live: "Live Betting VIP" };
  const planColor = { free: "#6b7280", daily: "#22c55e", biweekly: "#22c55e", weekly: "#22c55e", monthly: "#22c55e", live: "#fbbf24" };

  const hasAccess = (required) => {
    const order = ["free","daily","weekend","weekly","monthly","live"];
    return order.indexOf(userPlan) >= order.indexOf(required);
  };

  // [AUTH] Replace with real auth provider (Supabase, Firebase, NextAuth, etc.)
  const handleLogin = () => {
    console.log("[AUTH] handleLogin", { email });
    setTab("dashboard");
  };

  if (tab === "dashboard") return (
    <div>
      <section style={{ padding: "40px 0 24px" }}>
        <div className="container">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32, flexWrap: "wrap", gap: 16 }}>
            <div>
              <h1 className="bebas" style={{ fontSize: 40, letterSpacing: 1 }}>Member Dashboard</h1>
              <p style={{ color: "var(--gray)" }}>Welcome back. Your picks are ready.</p>
            </div>
            <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
              <div style={{ background: "var(--card)", border: `1px solid ${planColor[userPlan]}`, borderRadius: 10, padding: "10px 16px" }}>
                <p style={{ fontSize: 11, color: "var(--gray)" }}>Current Plan</p>
                <p style={{ fontWeight: 700, color: planColor[userPlan] }}>{planLabels[userPlan]}</p>
              </div>
              <button className="btn-outline" style={{ fontSize: 13 }} onClick={() => setTab("login")}>← Log Out</button>
            </div>
          </div>

          {/* Plan switcher for demo */}
          <div className="card" style={{ marginBottom: 28, background: "rgba(34,197,94,0.04)", border: "1px solid rgba(34,197,94,0.15)" }}>
            <p style={{ fontSize: 12, color: "var(--gray)", marginBottom: 10, fontWeight: 600 }}>DEMO: Switch User Plan</p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {Object.entries(planLabels).map(([k,v]) => (
                <button key={k} onClick={() => setUserPlan(k)} style={{ padding: "6px 14px", borderRadius: 8, border: `1px solid ${userPlan===k?planColor[k]:"var(--border)"}`, background: userPlan===k?"rgba(34,197,94,0.1)":"transparent", color: userPlan===k?planColor[k]:"var(--gray)", cursor: "pointer", fontSize: 13, fontFamily: "DM Sans, sans-serif" }}>
                  {v}
                </button>
              ))}
            </div>
          </div>

          <div className="grid-2" style={{ marginBottom: 28 }}>
            {/* Subscription Card */}
            <div className="card" style={{ border: `1px solid ${planColor[userPlan]}22` }}>
              <p style={{ color: "var(--gray)", fontSize: 13, marginBottom: 12, fontWeight: 600, textTransform: "uppercase" }}>Subscription</p>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                <div>
                  <p style={{ fontWeight: 700, fontSize: 20, marginBottom: 4 }}>{planLabels[userPlan]}</p>
                  <p style={{ color: "var(--gray)", fontSize: 14 }}>Renews: Jun 8, 2025</p>
                </div>
                <span className="tag" style={{ background: "rgba(34,197,94,0.1)", color: "var(--green)" }}>Active</span>
              </div>
              <hr style={{ border: "none", borderTop: "1px solid var(--border)", margin: "16px 0" }} />
              <div style={{ display: "flex", gap: 10 }}>
                <button className="btn-outline" style={{ flex: 1, fontSize: 13 }}>Billing Portal</button>
                <button className="btn-green" style={{ flex: 1, fontSize: 13 }} onClick={() => setPage("plans")}>Upgrade</button>
              </div>
            </div>

            {/* Recent Wins */}
            <div className="card">
              <p style={{ color: "var(--gray)", fontSize: 13, marginBottom: 12, fontWeight: 600, textTransform: "uppercase" }}>Recent Wins</p>
              {MOCK_PICKS.filter(p => p.result === "Win").slice(0,4).map(p => (
                <div key={p.id} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid var(--border)" }}>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <span className="sport-badge" style={{ background: sportColor(p.sport), color: "#fff" }}>{p.sport}</span>
                    <span style={{ fontSize: 13 }}>{p.pick}</span>
                  </div>
                  <span style={{ color: "var(--green)", fontWeight: 700, fontSize: 13 }}>{p.units}u</span>
                </div>
              ))}
            </div>
          </div>

          {/* Today's Picks */}
          <h2 className="bebas" style={{ fontSize: 32, letterSpacing: 1, marginBottom: 20 }}>Today's Picks</h2>
          <div className="grid-2">
            {[
              { sport: "NBA", pick: "BOS -4.5", type: "Premium", confidence: 88, required: "daily" },
              { sport: "MLB", pick: "LAD -1.5", type: "Premium", confidence: 82, required: "daily" },
              { sport: "UFC", pick: "Over 2.5 Rounds", type: "EV Play", confidence: 74, required: "daily" },
              { sport: "UFC", pick: "Ankalaev Sub Finish", type: "Live Signal", confidence: 79, required: "live" },
            ].map((p, i) => (
              <div key={i} className="card" style={{ position: "relative", overflow: "hidden" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                  <span className="sport-badge" style={{ background: sportColor(p.sport), color: "#fff" }}>{p.sport}</span>
                  <span className="tag" style={{ background: "rgba(34,197,94,0.1)", color: "var(--green)" }}>{p.type}</span>
                </div>
                {hasAccess(p.required) ? (
                  <>
                    <p style={{ fontWeight: 700, fontSize: 22, marginBottom: 8 }}>{p.pick}</p>
                    <div style={{ height: 4, background: "#1e2a35", borderRadius: 2, marginBottom: 4 }}>
                      <div style={{ width: `${p.confidence}%`, height: "100%", background: "var(--green)", borderRadius: 2 }} />
                    </div>
                    <p style={{ fontSize: 12, color: "var(--gray)" }}>Confidence: {p.confidence}%</p>
                  </>
                ) : (
                  <>
                    <p style={{ fontWeight: 700, fontSize: 22, marginBottom: 8 }}>Locked</p>
                    <div className="locked-overlay">
                      <div style={{ textAlign: "center" }}>
                        <span style={{ fontSize: 22 }}>🔒</span>
                        <p style={{ fontSize: 12, color: "var(--gray)", marginTop: 6 }}>Upgrade to unlock</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: 16, marginTop: 32, flexWrap: "wrap" }}>
            <button className="btn-outline" style={{ fontSize: 14 }} onClick={() => setPage("support")}>Support Tickets</button>
            <button className="btn-outline" style={{ fontSize: 14 }}>Account Settings</button>
            <button className="btn-outline" style={{ fontSize: 14 }}>Billing Portal</button>
          </div>
        </div>
      </section>
    </div>
  );

  return (
    <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", padding: "60px 0" }}>
      <div className="container" style={{ maxWidth: 440 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ width: 48, height: 48, background: "var(--green)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            <span style={{ color: "#000", fontFamily: "'Bebas Neue', sans-serif", fontSize: 22 }}>SE</span>
          </div>
          <h1 className="bebas" style={{ fontSize: 40, letterSpacing: 1, marginBottom: 6 }}>Slip Edge</h1>
          <p style={{ color: "var(--gray)" }}>Access your picks and member dashboard</p>
        </div>

        <div style={{ display: "flex", gap: 0, marginBottom: 28, background: "var(--card)", borderRadius: 10, padding: 4, border: "1px solid var(--border)" }}>
          {["login","signup"].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ flex: 1, padding: "10px 0", borderRadius: 7, border: "none", background: tab===t?"#1e2a35":"transparent", color: tab===t?"var(--white)":"var(--gray)", cursor: "pointer", fontWeight: 600, fontSize: 14, fontFamily: "DM Sans, sans-serif", transition: "all 0.2s" }}>
              {t === "login" ? "Log In" : "Sign Up"}
            </button>
          ))}
        </div>

        <div className="card">
          <div style={{ marginBottom: 14 }}>
            <label>Email Address</label>
            <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="you@example.com" />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label>Password</label>
            <input value={pass} onChange={e => setPass(e.target.value)} type="password" placeholder="••••••••" />
          </div>

          {tab === "signup" && (
            <div style={{ marginBottom: 20 }}>
              <label>Confirm Password</label>
              <input type="password" placeholder="••••••••" />
            </div>
          )}

          {tab === "login" && (
            <p style={{ textAlign: "right", marginBottom: 20 }}>
              <button style={{ background: "none", border: "none", color: "var(--green)", cursor: "pointer", fontSize: 13 }}>Forgot password?</button>
            </p>
          )}

          <button className="btn-green" style={{ width: "100%", padding: 14, fontSize: 16, marginBottom: 16 }} onClick={handleLogin}>
            {/* [AUTH] Authenticate with real provider */}
            {tab === "login" ? "Log In" : "Create Account"}
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <hr style={{ flex: 1, border: "none", borderTop: "1px solid var(--border)" }} />
            <span style={{ color: "#475569", fontSize: 12 }}>or</span>
            <hr style={{ flex: 1, border: "none", borderTop: "1px solid var(--border)" }} />
          </div>

          <button className="btn-outline" style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            <span>G</span> Continue with Google
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── ROOT APP ─────────────────────────────────────────────────

export default function SlipEdge() {
  const [page, setPage] = useState("home");
  const [checkout, setCheckout] = useState(null);

  const pages = { home: HomePage, daily: DailyPicksPage, plans: PlansPage, results: ResultsPage, reviews: ReviewsPage, free: FreePicksPage, support: SupportPage, login: LoginPage };
  const PageComponent = pages[page] || HomePage;

  return (
    <div>
      <Navbar page={page} setPage={setPage} />

      <PageComponent setPage={setPage} setCheckout={setCheckout} />

      <Footer setPage={setPage} />

      <FloatingSupportButton />

      {checkout && <CheckoutModal plan={checkout} onClose={() => setCheckout(null)} />}
    </div>
  );
}
