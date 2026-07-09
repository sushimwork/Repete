import { useState } from 'react'
import { supabase } from './supabase.js'
import { PLANS } from './constants.js'
import { Ico } from './Icons.jsx'

export function PlanSelect({ user, onSelect }) {
  const [chosen, setChosen]   = useState('starter')
  const [loading, setLoading] = useState(false)

  async function confirm() {
    setLoading(true)
    // Save plan to profiles table
    await supabase
      .from('profiles')
      .update({ plan: chosen })
      .eq('id', user.id)
    onSelect(chosen)
    setLoading(false)
  }

  return (
    <div className="plan-shell">
      <div className="auth-logo-big" style={{ marginBottom: 8, textAlign: 'center' }}>Répète</div>
      <div className="plan-heading">Choose your plan</div>
      <div className="plan-sub">Pick the plan that fits how you work. You can change anytime.</div>

      <div className="plan-grid">
        {Object.values(PLANS).map(p => (
          <div key={p.id}
            className={`plan-card ${p.id === 'professional' ? 'popular' : ''} ${chosen === p.id ? 'selected' : ''}`}
            onClick={() => setChosen(p.id)}>

            {p.id === 'professional' && (
              <div style={{ position:'absolute', top:-1, left:'50%', transform:'translateX(-50%)' }}>
                <span className="popular-pill">Most popular</span>
              </div>
            )}

            <div className="plan-badge-row" style={{ marginTop: p.id === 'professional' ? 14 : 0 }}>
              <span className="plan-badge-emoji">{p.badge}</span>
              {chosen === p.id && (
                <span style={{ fontSize:'11px', background:'#0e0e0e', color:'#b8975a', padding:'3px 10px', borderRadius:'20px', fontWeight:500 }}>
                  Selected
                </span>
              )}
            </div>

            <div className="plan-name">{p.name}</div>
            <div className="plan-price">
              {p.price === 'Free'
                ? <span style={{ fontSize: 22 }}>Free</span>
                : <>{p.price}<span style={{ fontSize:13, color:'#aaa', fontWeight:400 }}>/month</span></>
              }
            </div>
            <div className="plan-desc">
              {p.id === 'starter'      && 'Perfect for getting started. Track your wardrobe with essential features.'}
              {p.id === 'professional' && 'For active professionals who meet clients every day.'}
              {p.id === 'executive'    && 'No limits. Complete wardrobe intelligence for senior leaders.'}
            </div>

            <div className="plan-divider"/>
            <div className="plan-features">
              <div style={{ fontSize:'10px', fontWeight:600, color:'#aaa', textTransform:'uppercase', letterSpacing:'.08em', marginBottom:4 }}>
                What's included
              </div>
              {p.features.map((f, i) => (
                <div key={i} className="plan-feat"><Ico.Check/>{f}</div>
              ))}
              {p.missing.map((f, i) => (
                <div key={i} className="plan-feat plan-miss"><Ico.Lock/>{f}</div>
              ))}
            </div>

            <button
              className="plan-select-btn"
              style={chosen === p.id
                ? { background:'#0e0e0e', color:'#b8975a' }
                : { background:'#f5f3ef', color:'#555' }}
              onClick={e => { e.stopPropagation(); setChosen(p.id) }}>
              {chosen === p.id ? '✓ Selected' : 'Select plan'}
            </button>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 24, textAlign: 'center' }}>
        <button className="auth-btn" style={{ maxWidth: 320, display: 'inline-block' }}
          onClick={confirm} disabled={loading}>
          {loading ? 'Activating…' : `Continue with ${PLANS[chosen].name}`}
        </button>
      </div>

      <div className="plan-highlights">
        <div className="plan-hl"><Ico.Check/>No credit card for Starter</div>
        <div className="plan-hl"><Ico.Check/>Change plan anytime</div>
        <div className="plan-hl"><Ico.Check/>Data never deleted on downgrade</div>
      </div>
    </div>
  )
}

// ── UPGRADE MODAL ─────────────────────────────────────────────────────────────
export function UpgradeModal({ user, currentPlan, onUpgrade, onClose }) {
  const [loading, setLoading] = useState(false)

  async function pick(planId) {
    if (planId === currentPlan) { onClose(); return }
    setLoading(true)
    await supabase.from('profiles').update({ plan: planId }).eq('id', user.id)
    onUpgrade(planId)
    setLoading(false)
    onClose()
  }

  return (
    <div className="modal-bg open" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="upgrade-modal">
        <div className="upgrade-header">
          <div className="upgrade-logo">Répète</div>
          <div className="upgrade-title">Change your plan</div>
        </div>
        <div className="upgrade-plans">
          {Object.values(PLANS).map(p => (
            <div key={p.id} className={`up-plan ${p.id === currentPlan ? 'current' : ''}`}>
              <div className="up-plan-emoji">{p.badge}</div>
              <div className="up-plan-name">{p.name}</div>
              <div className="up-plan-price">{p.price}</div>
              <div className="up-plan-limits">
                {p.logsPerDay === Infinity ? 'Unlimited' : p.logsPerDay} logs/day<br/>
                {p.historyDays} days history<br/>
                {p.maxOutfits === Infinity ? 'Unlimited' : p.maxOutfits} outfits
              </div>
              <button className="up-plan-btn" disabled={loading}
                style={p.id === currentPlan
                  ? { background:'#f0ede8', color:'#aaa', cursor:'default' }
                  : { background:'#0e0e0e', color:'#b8975a' }}
                onClick={() => pick(p.id)}>
                {p.id === currentPlan ? 'Current plan' : loading ? '…' : 'Switch'}
              </button>
            </div>
          ))}
        </div>
        <div style={{ padding:'0 24px 20px', textAlign:'center', fontSize:'11px', color:'#aaa' }}>
          Changes take effect immediately.
        </div>
      </div>
    </div>
  )
}
