import { useState } from 'react'
import { supabase } from './supabase.js'
import { pwStrength } from './constants.js'
import { Ico } from './Icons.jsx'

function AuthPanel() {
  const outfits = [
    { emoji:'👔', colour:'#1a1a2e', label:'Navy set' },
    { emoji:'🧥', colour:'#3a3a3a', label:'Charcoal' },
    { emoji:'🧥', colour:'#8b7355', label:'Tan blazer' },
    { emoji:'👕', colour:'#c0bdb8', label:'White smart' },
    { emoji:'👔', colour:'#888',    label:'Grey suit' },
    { emoji:'👔', colour:'#1a3a5c', label:'Blue Oxford' },
  ]
  return (
    <div className="auth-panel">
      <div className="auth-panel-bg"/>
      <div className="auth-panel-grid"/>
      <div className="auth-wardrobe">
        {outfits.map((o, i) => (
          <div key={i} className="auth-outfit" style={{ background: o.colour+'18', borderColor: o.colour+'22' }}>
            {o.emoji}
            <div className="auth-outfit-lbl">{o.label}</div>
          </div>
        ))}
      </div>
      <div className="auth-panel-copy">
        <div className="auth-logo-big">Répète</div>
        <div className="auth-tagline">Never wear the same outfit twice with the same client. Track every look, protect every impression.</div>
        <div className="auth-stats">
          <div><div className="auth-stat-v">21d</div><div className="auth-stat-l">Repeat window</div></div>
          <div><div className="auth-stat-v">3</div><div className="auth-stat-l">Plan tiers</div></div>
          <div><div className="auth-stat-v">0</div><div className="auth-stat-l">Awkward moments</div></div>
        </div>
      </div>
    </div>
  )
}

// ── SIGN IN ───────────────────────────────────────────────────────────────────
export function SignIn({ onDone, onGoUp }) {
  const [email, setEmail]     = useState('')
  const [pw, setPw]           = useState('')
  const [showPw, setShowPw]   = useState(false)
  const [err, setErr]         = useState('')
  const [loading, setLoading] = useState(false)

  async function go() {
    setErr('')
    if (!email.trim()) { setErr('Enter your email.'); return }
    if (!pw)           { setErr('Enter your password.'); return }
    setLoading(true)
    const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password: pw })
    if (error) { setErr(error.message); setLoading(false); return }

    // Fetch profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single()

    onDone({ ...data.user, profile })
    setLoading(false)
  }

  return (
    <div className="auth-shell">
      <AuthPanel/>
      <div className="auth-form-panel">
        <div className="auth-box">
          <div className="auth-heading">Welcome back</div>
          <div className="auth-sub">No account? <a onClick={onGoUp}>Sign up free</a></div>

          {err && <div className="auth-err-box"><Ico.Alert/>{err}</div>}

          <div className="field">
            <label className="field-label">Email</label>
            <input className="field-input" type="email" placeholder="you@company.com"
              value={email} onChange={e => { setEmail(e.target.value); setErr('') }}
              onKeyDown={e => e.key === 'Enter' && go()}/>
          </div>

          <div className="field">
            <label className="field-label">Password</label>
            <div className="pw-wrap">
              <input className="field-input" type={showPw ? 'text' : 'password'} placeholder="Your password"
                value={pw} onChange={e => { setPw(e.target.value); setErr('') }}
                onKeyDown={e => e.key === 'Enter' && go()}/>
              <button className="pw-toggle" onClick={() => setShowPw(p => !p)}>
                {showPw ? <Ico.EyeOff/> : <Ico.Eye/>}
              </button>
            </div>
          </div>

          <button className="auth-btn" onClick={go} disabled={loading}>
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
          <div className="terms">By continuing you agree to our <a href="#">Terms</a> & <a href="#">Privacy Policy</a>.</div>
        </div>
      </div>
    </div>
  )
}

// ── SIGN UP ───────────────────────────────────────────────────────────────────
export function SignUp({ onDone, onGoIn }) {
  const [fn, setFn]           = useState('')
  const [ln, setLn]           = useState('')
  const [role, setRole]       = useState('')
  const [email, setEmail]     = useState('')
  const [pw, setPw]           = useState('')
  const [conf, setConf]       = useState('')
  const [showPw, setShowPw]   = useState(false)
  const [err, setErr]         = useState('')
  const [loading, setLoading] = useState(false)
  const str = pwStrength(pw)

  async function go() {
    setErr('')
    if (!fn.trim())                          { setErr('Enter your first name.'); return }
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) { setErr('Enter a valid email.'); return }
    if (pw.length < 6)                       { setErr('Password must be 6+ characters.'); return }
    if (pw !== conf)                         { setErr("Passwords don't match."); return }

    setLoading(true)
    const name = `${fn.trim()} ${ln.trim()}`.trim()

    // 1. Create auth user — trigger will auto-create profile row
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password: pw,
      options: {
        data: { name, job_role: role.trim() || 'Professional' }
      }
    })

    if (error) { setErr(error.message); setLoading(false); return }

    // 2. Fetch or wait for profile (trigger may take a moment)
    let profile = null
    for (let i = 0; i < 5; i++) {
      const { data: p } = await supabase.from('profiles').select('*').eq('id', data.user.id).single()
      if (p) { profile = p; break }
      await new Promise(r => setTimeout(r, 400))
    }

    // 3. Seed default wardrobe + contacts for new user
    await seedNewUser(data.user.id)

    onDone({ ...data.user, profile })
    setLoading(false)
  }

  async function seedNewUser(userId) {
    const { SEED_WARDROBE, SEED_CONTACTS } = await import('./constants.js')
    await supabase.from('wardrobe').insert(SEED_WARDROBE.map(o => ({ ...o, user_id: userId })))
    await supabase.from('contacts').insert(SEED_CONTACTS.map(c => ({ ...c, user_id: userId })))
  }

  return (
    <div className="auth-shell">
      <AuthPanel/>
      <div className="auth-form-panel">
        <div className="auth-box">
          <div className="auth-heading">Create account</div>
          <div className="auth-sub">Already have one? <a onClick={onGoIn}>Sign in</a></div>

          {err && <div className="auth-err-box"><Ico.Alert/>{err}</div>}

          <div className="field-row">
            <div className="field">
              <label className="field-label">First name</label>
              <input className="field-input" placeholder="Arjun" value={fn} onChange={e => setFn(e.target.value)} onKeyDown={e => e.key === 'Enter' && go()}/>
            </div>
            <div className="field">
              <label className="field-label">Last name</label>
              <input className="field-input" placeholder="Reddy" value={ln} onChange={e => setLn(e.target.value)} onKeyDown={e => e.key === 'Enter' && go()}/>
            </div>
          </div>

          <div className="field">
            <label className="field-label">Job title</label>
            <input className="field-input" placeholder="e.g. Sales Director" value={role} onChange={e => setRole(e.target.value)} onKeyDown={e => e.key === 'Enter' && go()}/>
          </div>

          <div className="field">
            <label className="field-label">Work email</label>
            <input className="field-input" type="email" placeholder="you@company.com"
              value={email} onChange={e => { setEmail(e.target.value); setErr('') }} onKeyDown={e => e.key === 'Enter' && go()}/>
          </div>

          <div className="field">
            <label className="field-label">Password</label>
            <div className="pw-wrap">
              <input className="field-input" type={showPw ? 'text' : 'password'} placeholder="Min. 6 characters"
                value={pw} onChange={e => { setPw(e.target.value); setErr('') }} onKeyDown={e => e.key === 'Enter' && go()}/>
              <button className="pw-toggle" onClick={() => setShowPw(p => !p)}>
                {showPw ? <Ico.EyeOff/> : <Ico.Eye/>}
              </button>
            </div>
            {pw && (
              <>
                <div className="pw-bar"><div className="pw-fill" style={{ width: `${str.score * 25}%`, background: str.color }}/></div>
                <div style={{ fontSize: '10px', color: str.color, marginTop: 2 }}>{str.label}</div>
              </>
            )}
          </div>

          <div className="field">
            <label className="field-label">Confirm password</label>
            <input className={`field-input ${conf && conf !== pw ? 'err' : ''}`} type="password" placeholder="Repeat password"
              value={conf} onChange={e => { setConf(e.target.value); setErr('') }} onKeyDown={e => e.key === 'Enter' && go()}/>
            {conf && conf === pw && pw && <div style={{ fontSize:'10px', color:'#3a9e5f', marginTop:2 }}>✓ Passwords match</div>}
          </div>

          <button className="auth-btn" onClick={go} disabled={loading}>
            {loading ? 'Creating account…' : 'Create account — it\'s free'}
          </button>
          <div className="terms">By signing up you agree to our <a href="#">Terms</a> & <a href="#">Privacy Policy</a>.</div>
        </div>
      </div>
    </div>
  )
}
