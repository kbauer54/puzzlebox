import { useState } from 'react';
import type { User } from '../types';

interface NavProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  user: User | null;
  onLogin: (user: User) => void;
  onLogout: () => void;
  activeModal: 'signin' | 'register' | null;
  setModal: (modal: 'signin' | 'register' | null) => void;
}

export default function Nav({ currentPage, onNavigate, user, onLogin, onLogout, activeModal, setModal }: NavProps) {
  const [form, setForm]   = useState({ name: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');

  const openSignIn   = () => { setError(''); setForm({ name: '', email: '', password: '', confirm: '' }); setModal('signin'); };
  const openRegister = () => { setError(''); setForm({ name: '', email: '', password: '', confirm: '' }); setModal('register'); };
  const closeModal   = () => { setModal(null); setError(''); };

  const handleSignIn = () => {
    if (!form.email || !form.password) { setError('Please fill in all fields.'); return; }
    onLogin({ uid: String(Date.now()), name: form.email.split('@')[0], coins: 200, isBanned: false, role: 'registered' });
  };

  const handleRegister = () => {
    if (!form.name || !form.email || !form.password || !form.confirm) { setError('Please fill in all fields.'); return; }
    if (form.password !== form.confirm) { setError('Passwords do not match.'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    onLogin({ uid: String(Date.now()), name: form.name, coins: 200, isBanned: false, role: 'registered' });
  };

  const navLinks = [
    { id: 'home',        label: 'Home'        },
    { id: 'archive',     label: 'Archive'     },
    { id: 'leaderboard', label: 'Leaderboard' },
    { id: 'trivia',      label: 'Trivia'      },
    
  ];

  return (
    <>
      <nav style={s.nav}>
        <span style={s.logo} onClick={() => onNavigate('home')}>PuzzleBox</span>
        <div style={s.navLinks}>
          {navLinks.map(link => (
            <button key={link.id}
              style={{ ...s.navLink, color: currentPage === link.id ? 'var(--yellow)' : 'var(--text-dim)' }}
              onClick={() => onNavigate(link.id)}>
              {link.label}
            </button>
          ))}
          
          {user ? (
            // using "registered" user as test
            user.role === "registered" ? (
              <button
                key={"managerpanel"}
                style={{
                  ...s.navLink,
                  color: "var(--text-dim)",
                }}
                onClick={() => onNavigate("managerpanel")}
              >
                {"Manager-Panel"}
              </button>
            ) : null
          ) : null}

          {user ? (
            <>
              <span style={s.coinBadge}>⬡ {user.coins}</span>
              <span style={s.userName}>{user.name}</span>
              <button style={s.btnGhost} onClick={onLogout}>Sign Out</button>
            </>
          ) : (
            <>
              <button style={s.btnGhost}   onClick={openSignIn}>Sign In</button>
              <button style={s.btnPrimary} onClick={openRegister}>Register Free</button>
            </>
          )}
        </div>
      </nav>

      {activeModal === 'signin' && (
        <div style={s.overlay} onClick={closeModal}>
          <div style={s.modal} onClick={e => e.stopPropagation()} className="pop-in">
            <div style={s.modalIcon}>🔐</div>
            <h2 style={s.modalTitle}>Sign In</h2>
            {error && <p style={s.errorText}>{error}</p>}
            <label style={s.inputLabel}>Email address</label>
            <input style={s.input} type="email" placeholder="you@example.com"
              value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
            <label style={s.inputLabel}>Password</label>
            <input style={s.input} type="password" placeholder="••••••••"
              value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
              onKeyDown={e => e.key === 'Enter' && handleSignIn()} />
            <div style={s.modalFooter}>
              <button style={s.btnGhost} onClick={closeModal}>Cancel</button>
              <button style={s.btnPrimary} onClick={handleSignIn}>Sign In →</button>
            </div>
            <div style={s.divider} />
            <p style={s.switchText}>
              No account?{' '}
              <span style={s.switchLink} onClick={openRegister}>Register free →</span>
            </p>
          </div>
        </div>
      )}

      {activeModal === 'register' && (
        <div style={s.overlay} onClick={closeModal}>
          <div style={s.modal} onClick={e => e.stopPropagation()} className="pop-in">
            <h2 style={s.modalTitle}>Create Account</h2>
            <p style={{ fontSize: 13, color: 'var(--text-dim)', marginBottom: 16 }}>
              Free forever. No credit card required.
            </p>
            {error && <p style={s.errorText}>{error}</p>}
            {([
              ['Display name',     'name',    'text',     'YourName'],
              ['Email address',    'email',   'email',    'you@example.com'],
              ['Password',         'password','password', '••••••••'],
              ['Confirm password', 'confirm', 'password', '••••••••'],
            ] as [string, keyof typeof form, string, string][]).map(([label, key, type, placeholder]) => (
              <div key={key}>
                <label style={s.inputLabel}>{label}</label>
                <input style={s.input} type={type} placeholder={placeholder}
                  value={form[key]} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                  onKeyDown={e => e.key === 'Enter' && handleRegister()} />
              </div>
            ))}
            <div style={s.modalFooter}>
              <button style={s.btnGhost} onClick={closeModal}>Cancel</button>
              <button style={s.btnPrimary} onClick={handleRegister}>Register →</button>
            </div>
            <div style={s.divider} />
            <p style={s.switchText}>
              Have an account?{' '}
              <span style={s.switchLink} onClick={openSignIn}>Sign in →</span>
            </p>
          </div>
        </div>
      )}
    </>
  );
}

const s: Record<string, React.CSSProperties> = {
  nav: { background: '#0a0a0a', borderBottom: '1px solid var(--border)', height: 52, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 28px', position: 'sticky', top: 0, zIndex: 50 },
  logo: { fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: 'var(--yellow)', cursor: 'pointer', letterSpacing: '0.5px' },
  navLinks: { display: 'flex', alignItems: 'center', gap: 20 },
  navLink: { background: 'none', border: 'none', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'Inter, sans-serif', padding: 0 },
  btnPrimary: { background: 'var(--yellow)', color: '#111', border: 'none', borderRadius: 5, padding: '7px 14px', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'Inter, sans-serif' },
  btnGhost: { background: 'transparent', color: 'var(--text-dim)', border: '1px solid var(--border)', borderRadius: 5, padding: '6px 13px', fontSize: 12, fontWeight: 500, cursor: 'pointer', fontFamily: 'Inter, sans-serif' },
  coinBadge: { background: 'var(--yellow-glow)', border: '1px solid var(--yellow-dim)', color: 'var(--yellow)', borderRadius: 20, padding: '4px 10px', fontSize: 12, fontWeight: 600 },
  userName: { fontSize: 13, color: 'var(--text-dim)' },
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.78)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, backdropFilter: 'blur(4px)' },
  modal: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '28px 24px', width: '100%', maxWidth: 380, margin: '0 16px' },
  modalIcon: { width: 38, height: 38, borderRadius: '50%', border: '2px solid var(--yellow)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, margin: '0 auto 14px' },
  modalTitle: { fontSize: 20, fontWeight: 700, color: 'var(--text)', marginBottom: 20, textAlign: 'center' },
  inputLabel: { display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 6, marginTop: 12 },
  input: { width: '100%', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 6, padding: '9px 12px', fontSize: 14, color: 'var(--text)', fontFamily: 'Inter, sans-serif', outline: 'none' },
  modalFooter: { display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 20 },
  divider: { height: 1, background: 'var(--border)', margin: '16px 0 12px' },
  switchText: { fontSize: 12, color: 'var(--text-muted)', textAlign: 'center' },
  switchLink: { color: 'var(--yellow)', cursor: 'pointer' },
  errorText: { fontSize: 12, color: 'var(--red)', marginBottom: 8, padding: '8px 12px', background: 'rgba(239,68,68,0.08)', borderRadius: 5, border: '1px solid rgba(239,68,68,0.2)' },
};
