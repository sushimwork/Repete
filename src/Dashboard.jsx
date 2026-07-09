import { useState, useEffect, useCallback } from 'react'
import { supabase } from './supabase.js'
import { PLANS, EMOJIS, COLOURS, AV_COLS, todayStr, fmtDate, daysDiff, mkInitials } from './constants.js'
import { Ico } from './Icons.jsx'
import { UpgradeModal } from './PlanSelect.jsx'

export function Dashboard({ user, profile, onLogout, onPlanChange }) {
  const plan = PLANS[profile?.plan || 'starter']

  const [page, setPage]         = useState('today')
  const [wardrobe, setWardrobe] = useState([])
  const [contacts, setContacts] = useState([])
  const [logs, setLogs]         = useState([])
  const [loading, setLoading]   = useState(true)
  const [toast, setToast]       = useState('')
  const [toastOn, setToastOn]   = useState(false)
  const [showUpgrade, setShowUpgrade] = useState(false)

  // Modals
  const [logModal, setLogModal]       = useState(false)
  const [addOutfit, setAddOutfit]     = useState(false)
  const [addContact, setAddContact]   = useState(false)

  // Log form
  const [logOutfitId, setLogOutfitId] = useState(null)
  const [logContactIds, setLogCIds]   = useState([])
  const [logDate, setLogDate]         = useState(todayStr())
  const [logNote, setLogNote]         = useState('')

  // Add outfit form
  const [nName, setNName]   = useState('')
  const [nStyle, setNStyle] = useState('Formal')
  const [nEmoji, setNEmoji] = useState('👔')
  const [nCol, setNCol]     = useState('#1a1a2e')

  // Add contact form
  const [cName, setCName] = useState('')
  const [cCo, setCCo]     = useState('')
  const [cRole, setCRole] = useState('')

  // ── LOAD DATA ─────────────────────────────────────────────────────────────
  useEffect(() => { fetchAll() }, [])

  async function fetchAll() {
    setLoading(true)
    const [{ data: w }, { data: c }, { data: l }] = await Promise.all([
      supabase.from('wardrobe').select('*').eq('user_id', user.id).order('created_at'),
      supabase.from('contacts').select('*').eq('user_id', user.id).order('created_at'),
      supabase.from('logs').select('*').eq('user_id', user.id).order('log_date', { ascending: false }),
    ])
    setWardrobe(w || [])
    setContacts(c || [])
    setLogs(l || [])
    setLoading(false)
  }

  const showToast = useCallback(msg => {
    setToast(msg); setToastOn(true)
    setTimeout(() => setToastOn(false), 2500)
  }, [])

  // ── PLAN ENFORCEMENT ──────────────────────────────────────────────────────
  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - plan.historyDays)
  const visibleLogs     = logs.filter(l => new Date(l.log_date) >= cutoff)
  const todayLogs       = logs.filter(l => l.log_date === todayStr())
  const logsUsedToday   = todayLogs.length
  const logsRemaining   = plan.logsPerDay === Infinity ? Infinity : Math.max(0, plan.logsPerDay - logsUsedToday)
  const atLogLimit      = logsRemaining === 0
  const limitPct        = plan.logsPerDay === Infinity ? 0 : Math.min(100, (logsUsedToday / plan.logsPerDay) * 100)
  const limitColor      = limitPct >= 100 ? '#e05252' : limitPct >= 66 ? '#f0a500' : '#3a9e5f'
  const atWardrobeLimit = plan.maxOutfits !== Infinity && wardrobe.length >= plan.maxOutfits
  const atContactLimit  = plan.maxContacts !== Infinity && contacts.length >= plan.maxContacts

  // ── HELPERS ───────────────────────────────────────────────────────────────
  const getOutfit  = id => wardrobe.find(o => o.id === id)
  const getContact = id => contacts.find(c => c.id === id)

  function lastOutfitFor(cid) {
    const ls = logs.filter(l => l.contact_ids?.includes(cid))
                   .sort((a, b) => new Date(b.log_date) - new Date(a.log_date))
    return ls[0] || null
  }

  function repeatWarn(outfitId, cid) {
    const ls = logs.filter(l => l.outfit_id === outfitId && l.contact_ids?.includes(cid))
                   .sort((a, b) => new Date(b.log_date) - new Date(a.log_date))
    if (!ls.length) return null
    return { days: daysDiff(new Date(), new Date(ls[0].log_date)), date: ls[0].log_date }
  }

  // Today's meetings (from first 3 contacts)
  const todayMeetings = contacts.slice(0, 3).map((c, i) => ({
    time: ['10:00', '14:00', '16:30'][i],
    contactId: c.id,
    title: ['Q3 Review', 'Deal Discussion', 'Strategy Sync'][i],
  }))

  const safeOutfits = wardrobe.filter(o =>
    todayMeetings.every(m => { const w = repeatWarn(o.id, m.contactId); return !w || w.days > 21 })
  )

  const todayAlerts = todayMeetings.map(m => {
    const l = lastOutfitFor(m.contactId)
    if (!l) return null
    const d = daysDiff(new Date(), new Date(l.log_date))
    return d <= 21 ? { contact: getContact(m.contactId), outfit: getOutfit(l.outfit_id), days: d } : null
  }).filter(Boolean)

  const logWarnings = logOutfitId ? logContactIds.map(cid => {
    const w = repeatWarn(logOutfitId, cid)
    return (w && w.days <= 30) ? { contact: getContact(cid), ...w } : null
  }).filter(Boolean) : []

  // ── LOG OUTFIT ────────────────────────────────────────────────────────────
  async function submitLog() {
    if (!logOutfitId) { showToast('Select an outfit'); return }
    if (atLogLimit)   { showToast('Daily limit reached — upgrade for more'); return }

    const { data, error } = await supabase.from('logs').insert({
      user_id:     user.id,
      log_date:    logDate,
      outfit_id:   logOutfitId,
      contact_ids: logContactIds,
      note:        logNote,
    }).select().single()

    if (error) { showToast('Error saving log'); return }

    // Increment uses on wardrobe item
    const outfit = getOutfit(logOutfitId)
    if (outfit) {
      await supabase.from('wardrobe').update({ uses: outfit.uses + 1 }).eq('id', logOutfitId)
      setWardrobe(prev => prev.map(o => o.id === logOutfitId ? { ...o, uses: o.uses + 1 } : o))
    }

    setLogs(prev => [data, ...prev])
    setLogModal(false)
    resetLog()
    showToast('✓ Outfit logged')
  }

  function resetLog() { setLogOutfitId(null); setLogCIds([]); setLogDate(todayStr()); setLogNote('') }
  function toggleLC(id) { setLogCIds(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]) }

  // ── ADD OUTFIT ────────────────────────────────────────────────────────────
  async function doAddOutfit() {
    if (!nName.trim())    { showToast('Enter a name'); return }
    if (atWardrobeLimit)  { showToast('Wardrobe limit reached — upgrade'); return }

    const { data, error } = await supabase.from('wardrobe').insert({
      user_id: user.id, name: nName.trim(), emoji: nEmoji, colour: nCol, style: nStyle, uses: 0,
    }).select().single()

    if (error) { showToast('Error adding outfit'); return }
    setWardrobe(prev => [...prev, data])
    setAddOutfit(false); setNName('')
    showToast(`✓ Added ${data.name}`)
  }

  // ── DELETE OUTFIT ─────────────────────────────────────────────────────────
  async function delOutfit(id) {
    await supabase.from('wardrobe').delete().eq('id', id)
    setWardrobe(prev => prev.filter(o => o.id !== id))
    setLogs(prev => prev.filter(l => l.outfit_id !== id))
    showToast('Outfit removed')
  }

  // ── ADD CONTACT ───────────────────────────────────────────────────────────
  async function doAddContact() {
    if (!cName.trim())   { showToast('Enter a name'); return }
    if (atContactLimit)  { showToast('Contact limit reached — upgrade'); return }

    const { data, error } = await supabase.from('contacts').insert({
      user_id:  user.id,
      name:     cName.trim(),
      company:  cCo.trim(),
      job_role: cRole.trim(),
      colour:   AV_COLS[contacts.length % AV_COLS.length],
      initials: mkInitials(cName),
    }).select().single()

    if (error) { showToast('Error adding contact'); return }
    setContacts(prev => [...prev, data])
    setAddContact(false); setCName(''); setCCo(''); setCRole('')
    showToast(`✓ Added ${data.name}`)
  }

  // ── DELETE CONTACT ────────────────────────────────────────────────────────
  async function delContact(id) {
    await supabase.from('contacts').delete().eq('id', id)
    setContacts(prev => prev.filter(c => c.id !== id))
    showToast('Contact removed')
  }

  // ── DELETE LOG ────────────────────────────────────────────────────────────
  async function delLog(id) {
    const log = logs.find(l => l.id === id)
    await supabase.from('logs').delete().eq('id', id)
    if (log) {
      const outfit = getOutfit(log.outfit_id)
      if (outfit) {
        const newUses = Math.max(0, outfit.uses - 1)
        await supabase.from('wardrobe').update({ uses: newUses }).eq('id', log.outfit_id)
        setWardrobe(prev => prev.map(o => o.id === log.outfit_id ? { ...o, uses: newUses } : o))
      }
    }
    setLogs(prev => prev.filter(l => l.id !== id))
    showToast('Entry deleted')
  }

  // ── LOGOUT ────────────────────────────────────────────────────────────────
  async function handleLogout() {
    await supabase.auth.signOut()
    onLogout()
  }

  const sortedLogs = [...visibleLogs].sort((a, b) => new Date(b.log_date) - new Date(a.log_date))

  if (loading) return (
    <div className="loading-screen">
      <div className="loading-logo">Répète</div>
      <div className="loading-sub">Loading your wardrobe…</div>
    </div>
  )

  return (
    <>
      <div className="app-shell">
        {/* ── SIDEBAR ── */}
        <aside className="sb">
          <div className="sb-logo">Répète<span>Professional wardrobe</span></div>
          <nav className="sb-nav">
            {[
              ['today',    'Today',    <Ico.Today/>],
              ['wardrobe', 'Wardrobe', <Ico.Wardrobe/>],
              ['contacts', 'Contacts', <Ico.Contacts/>],
              ['history',  'History',  <Ico.History/>],
            ].map(([id, lbl, ic]) => (
              <div key={id} className={`sb-ni ${page === id ? 'act' : ''}`} onClick={() => setPage(id)}>
                {ic}{lbl}
              </div>
            ))}
          </nav>

          {/* Plan chip */}
          <div className="sb-plan-chip">
            <div className="sb-plan-name">{plan.badge} {plan.name}</div>
            <div className="sb-plan-sub">
              {plan.logsPerDay === Infinity ? 'Unlimited' : plan.logsPerDay} logs/day · {plan.historyDays}d history
            </div>
            {plan.id !== 'executive' && (
              <button className="sb-plan-upgrade" onClick={() => setShowUpgrade(true)}>↑ Upgrade plan</button>
            )}
          </div>

          <div className="sb-footer">
            <div className="sb-user">
              <div className="sb-av">{mkInitials(profile?.name || user.email)}</div>
              <div className="sb-uname">
                {profile?.name || user.email}<br/>
                <span style={{ fontSize: '10px' }}>{profile?.job_role}</span>
              </div>
            </div>
            <button className="sb-logout" onClick={handleLogout}><Ico.Logout/>Sign out</button>
          </div>
        </aside>

        {/* ── MAIN ── */}
        <main className="app-main">

          {/* TODAY */}
          <div className={`pg ${page === 'today' ? 'act' : ''}`}>
            <div className="ph">
              <div>
                <div className="pt">Good morning, {(profile?.name || '').split(' ')[0]}</div>
                <div className="ps">{new Date().toLocaleDateString('en-IN', { weekday:'long', day:'numeric', month:'long', year:'numeric' })}</div>
              </div>
            </div>

            <div className="stat-row">
              <div className="stat-card"><div className="stat-val">{visibleLogs.length}</div><div className="stat-lbl">Logs ({plan.historyDays}d)</div></div>
              <div className="stat-card"><div className="stat-val">{contacts.length}</div><div className="stat-lbl">Contacts</div></div>
              <div className="stat-card"><div className="stat-val">{todayAlerts.length}</div><div className="stat-lbl">Alerts today</div></div>
              <div className="stat-card"><div className="stat-val">{wardrobe.length}</div><div className="stat-lbl">Outfits</div></div>
            </div>

            {/* Daily limit bar */}
            {plan.logsPerDay !== Infinity && (
              <div className="card" style={{ marginBottom: 16 }}>
                <div className="card-b" style={{ padding: '14px 20px' }}>
                  <div className="limit-bar-label">
                    <span style={{ fontWeight: 500 }}>Daily outfit logs</span>
                    <span style={{ color: limitColor }}>{logsUsedToday}/{plan.logsPerDay} used today</span>
                  </div>
                  <div className="limit-bar">
                    <div className="limit-bar-fill" style={{ width: `${limitPct}%`, background: limitColor }}/>
                  </div>
                  {atLogLimit
                    ? <div style={{ fontSize:'11px', color:'#e05252', marginTop:6, display:'flex', alignItems:'center', gap:6 }}>
                        <Ico.Lock/> Limit reached —&nbsp;
                        <span style={{ color:'#b8975a', cursor:'pointer', fontWeight:500 }} onClick={() => setShowUpgrade(true)}>
                          upgrade for more logs
                        </span>
                      </div>
                    : <div style={{ fontSize:'11px', color:'#aaa', marginTop:5 }}>
                        {logsRemaining} log{logsRemaining !== 1 ? 's' : ''} remaining today
                      </div>
                  }
                </div>
              </div>
            )}

            <div className="two">
              <div className="card">
                <div className="card-h">
                  <span className="card-t">Today's meetings</span>
                  <button className="btn btn-ghost btn-sm"
                    onClick={() => { if (atLogLimit) { setShowUpgrade(true); return } resetLog(); setLogModal(true) }}>
                    {atLogLimit ? <><Ico.Lock/>Limit reached</> : <>+ Log outfit</>}
                  </button>
                </div>
                <div className="card-b">
                  {todayAlerts.length > 0
                    ? todayAlerts.map((a, i) => (
                      <div key={i} className="alert a-warn">
                        <Ico.Warn/>
                        <div><strong>{a.contact?.name}</strong> saw your <strong>{a.outfit?.name}</strong> just {a.days}d ago</div>
                      </div>
                    ))
                    : <div className="alert a-ok"><Ico.Check/>No repeat risks today — all clear.</div>
                  }
                  <div className="meet-list">
                    {todayMeetings.map((m, i) => {
                      const c = getContact(m.contactId)
                      if (!c) return null
                      const l = lastOutfitFor(m.contactId)
                      let badge = <span className="rb rb-n">First</span>
                      if (l) {
                        const d = daysDiff(new Date(), new Date(l.log_date))
                        badge = d <= 21
                          ? <span className="rb rb-w">⚠ {d}d ago</span>
                          : <span className="rb rb-ok">✓ {d}d safe</span>
                      }
                      return (
                        <div key={i} className="meet-item">
                          <span className="meet-time">{m.time}</span>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize:13, fontWeight:500 }}>{c.name}</div>
                            <div style={{ fontSize:11, color:'#aaa' }}>{c.company} · {m.title}</div>
                          </div>
                          {badge}
                        </div>
                      )
                    })}
                    {contacts.length === 0 && <div className="empty-st">Add contacts to see meetings</div>}
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="card-h"><span className="card-t">Safe to wear today</span></div>
                <div className="card-b">
                  <div className="og">
                    {safeOutfits.slice(0, 6).map(o => (
                      <div key={o.id} className="ot" style={{ background: o.colour+'22' }}
                        onClick={() => { if (atLogLimit) { setShowUpgrade(true); return } resetLog(); setLogOutfitId(o.id); setLogModal(true) }}>
                        <div className="ot-icon">{o.emoji}</div>
                        <div className="ot-lbl">{o.name.length > 14 ? o.name.slice(0, 13)+'…' : o.name}</div>
                      </div>
                    ))}
                    {wardrobe.length === 0 && <div style={{ gridColumn:'1/-1', textAlign:'center', color:'#ccc', fontSize:12, padding:'20px 0' }}>Add outfits to your wardrobe</div>}
                  </div>
                  <button
                    className={`btn ${atLogLimit ? 'btn-upgrade' : 'btn-gold'}`}
                    style={{ width:'100%', marginTop:14 }}
                    onClick={() => { if (atLogLimit) { setShowUpgrade(true); return } resetLog(); setLogModal(true) }}>
                    {atLogLimit ? '↑ Upgrade to log more' : 'Log today\'s outfit'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* WARDROBE */}
          <div className={`pg ${page === 'wardrobe' ? 'act' : ''}`}>
            <div className="ph">
              <div>
                <div className="pt">Wardrobe</div>
                <div className="ps">{wardrobe.length}{plan.maxOutfits !== Infinity ? `/${plan.maxOutfits}` : ''} outfits</div>
              </div>
              <button className="btn btn-dark" onClick={() => { if (atWardrobeLimit) { setShowUpgrade(true); return } setAddOutfit(true) }}>
                {atWardrobeLimit ? <><Ico.Lock/>Limit reached</> : <><Ico.Plus/>Add outfit</>}
              </button>
            </div>
            {atWardrobeLimit && (
              <div className="alert a-lock" onClick={() => setShowUpgrade(true)} style={{ marginBottom:16 }}>
                <Ico.Lock/>Wardrobe limit for {plan.name} plan reached. <strong style={{ marginLeft:4 }}>Upgrade to add more →</strong>
              </div>
            )}
            <div className="wg">
              {wardrobe.map(o => (
                <div key={o.id} className="wi">
                  <div className="w-img" style={{ background: o.colour+'22' }}>{o.emoji}</div>
                  <div className="w-info">
                    <div className="w-name">{o.name}</div>
                    <div className="w-meta">{o.style}</div>
                    <div className="w-uses">{o.uses}× worn</div>
                    <button className="btn btn-del btn-sm" style={{ marginTop:8, width:'100%', justifyContent:'center' }} onClick={() => delOutfit(o.id)}>Remove</button>
                  </div>
                </div>
              ))}
              {!atWardrobeLimit
                ? <div className="add-tile" onClick={() => setAddOutfit(true)}><Ico.Plus/>Add outfit</div>
                : <div className="locked-tile" onClick={() => setShowUpgrade(true)}><Ico.Lock/><span>Upgrade to add more</span></div>
              }
            </div>
          </div>

          {/* CONTACTS */}
          <div className={`pg ${page === 'contacts' ? 'act' : ''}`}>
            <div className="ph">
              <div>
                <div className="pt">Contacts</div>
                <div className="ps">{contacts.length}{plan.maxContacts !== Infinity ? `/${plan.maxContacts}` : ''} contacts</div>
              </div>
              <button className="btn btn-dark" onClick={() => { if (atContactLimit) { setShowUpgrade(true); return } setAddContact(true) }}>
                {atContactLimit ? <><Ico.Lock/>Limit reached</> : <><Ico.Plus/>Add contact</>}
              </button>
            </div>
            {atContactLimit && (
              <div className="alert a-lock" onClick={() => setShowUpgrade(true)} style={{ marginBottom:16 }}>
                <Ico.Lock/>Contact limit reached. <strong style={{ marginLeft:4 }}>Upgrade to track more →</strong>
              </div>
            )}
            <div className="card">
              <div className="card-b" style={{ padding:'0 20px' }}>
                <table className="tbl">
                  <thead><tr>
                    <th>Contact</th><th>Company</th><th>Last met</th><th>Last outfit</th><th>Logs</th><th></th>
                  </tr></thead>
                  <tbody>
                    {contacts.map(c => {
                      const l = lastOutfitFor(c.id)
                      const o = l ? getOutfit(l.outfit_id) : null
                      const cnt = logs.filter(x => x.contact_ids?.includes(c.id)).length
                      return (
                        <tr key={c.id}>
                          <td>
                            <div className="c-row">
                              <div className="c-av" style={{ background:c.colour+'22', color:c.colour }}>{c.initials}</div>
                              <div>
                                <div style={{ fontWeight:500 }}>{c.name}</div>
                                <div style={{ fontSize:'10px', color:'#bbb' }}>{c.job_role}</div>
                              </div>
                            </div>
                          </td>
                          <td style={{ color:'#888' }}>{c.company || '—'}</td>
                          <td style={{ color:'#aaa' }}>{l ? fmtDate(l.log_date) : '—'}</td>
                          <td>{o ? <span className="o-chip">{o.emoji} {o.name.length > 15 ? o.name.slice(0, 14)+'…' : o.name}</span> : '—'}</td>
                          <td style={{ fontWeight:500 }}>{cnt}</td>
                          <td><button className="btn btn-del btn-sm" onClick={() => delContact(c.id)}>Remove</button></td>
                        </tr>
                      )
                    })}
                    {contacts.length === 0 && (
                      <tr><td colSpan={6}><div className="empty-st">No contacts yet — add your first one</div></td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* HISTORY */}
          <div className={`pg ${page === 'history' ? 'act' : ''}`}>
            <div className="ph">
              <div>
                <div className="pt">Outfit history</div>
                <div className="ps">{sortedLogs.length} entries</div>
              </div>
              <button className="btn btn-dark" onClick={() => { if (atLogLimit) { setShowUpgrade(true); return } resetLog(); setLogModal(true) }}>
                <Ico.Plus/>Log outfit
              </button>
            </div>

            <div className="retention-note">
              <Ico.Clock/>
              <span>
                Showing last <strong>{plan.historyDays} days</strong> of history ({plan.name} plan).
                {plan.id !== 'executive' && (
                  <span style={{ color:'#b8975a', cursor:'pointer', marginLeft:4 }} onClick={() => setShowUpgrade(true)}>
                    Upgrade for longer history →
                  </span>
                )}
              </span>
            </div>

            {logs.length > visibleLogs.length && (
              <div className="alert a-info" style={{ marginBottom:14 }}>
                <Ico.Clock/>
                {logs.length - visibleLogs.length} older entries hidden by your {plan.historyDays}-day window.
                <span style={{ color:'#5b7ff5', cursor:'pointer', marginLeft:6, fontWeight:500 }} onClick={() => setShowUpgrade(true)}>
                  Upgrade to see all →
                </span>
              </div>
            )}

            <div className="card">
              <div className="card-b">
                <div className="timeline">
                  {sortedLogs.length === 0 && <div className="empty-st">No outfit logs yet — start by logging today's outfit</div>}
                  {sortedLogs.map(log => {
                    const o = getOutfit(log.outfit_id)
                    if (!o) return null
                    const cs = (log.contact_ids || []).map(id => getContact(id)).filter(Boolean)
                    return (
                      <div key={log.id} className="tl-item">
                        <div className="tl-date">{fmtDate(log.log_date)}</div>
                        <div className="tl-icon" style={{ background: o.colour+'22' }}>{o.emoji}</div>
                        <div className="tl-body">
                          <div className="tl-name">{o.name}</div>
                          <div className="tl-pills">
                            {cs.map(c => <span key={c.id} className="c-pill">{c.initials} {c.name.split(' ')[0]}</span>)}
                            {cs.length === 0 && <span style={{ fontSize:'11px', color:'#ddd' }}>No contacts tagged</span>}
                          </div>
                          {log.note && <div style={{ fontSize:'11px', color:'#bbb', marginTop:3, fontStyle:'italic' }}>"{log.note}"</div>}
                        </div>
                        <button className="btn btn-del btn-sm" style={{ alignSelf:'center' }} onClick={() => delLog(log.id)}>Delete</button>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>

        </main>
      </div>

      {/* ── LOG MODAL ── */}
      {logModal && (
        <div className="modal-bg open" onClick={e => e.target === e.currentTarget && (setLogModal(false), resetLog())}>
          <div className="modal">
            <div className="modal-h">
              <span className="modal-ht">Log outfit</span>
              <button className="modal-x" onClick={() => { setLogModal(false); resetLog() }}>×</button>
            </div>
            <div className="modal-b">
              {plan.logsPerDay !== Infinity && (
                <div style={{ fontSize:'11px', color: logsRemaining <= 1 ? '#e05252' : '#aaa', marginBottom:12, background:'#f9f8f5', padding:'8px 12px', borderRadius:6 }}>
                  {logsRemaining} log{logsRemaining !== 1 ? 's' : ''} remaining today ({plan.name} plan)
                </div>
              )}
              <div className="fg">
                <label className="fl">Date</label>
                <input type="date" className="fi" value={logDate} max={todayStr()} onChange={e => setLogDate(e.target.value)}/>
              </div>
              <div className="fg">
                <label className="fl">Outfit worn</label>
                <div className="og">
                  {wardrobe.map(o => (
                    <div key={o.id} className={`ot ${logOutfitId === o.id ? 'sel' : ''}`} style={{ background: o.colour+'22' }} onClick={() => setLogOutfitId(o.id)}>
                      <div className="ot-icon">{o.emoji}</div>
                      <div className="ot-lbl">{o.name.length > 14 ? o.name.slice(0, 13)+'…' : o.name}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="fg">
                <label className="fl">Meeting with</label>
                <div className="tag-row">
                  {contacts.map(c => (
                    <span key={c.id} className={`tag-pill ${logContactIds.includes(c.id) ? 'act' : ''}`} onClick={() => toggleLC(c.id)}>
                      {c.name.split(' ')[0]}
                    </span>
                  ))}
                </div>
              </div>
              <div className="fg">
                <label className="fl">Note (optional)</label>
                <textarea className="fi" rows={2} placeholder="e.g. Board meeting at HQ…" value={logNote} onChange={e => setLogNote(e.target.value)}/>
              </div>
              {logWarnings.map((w, i) => (
                <div key={i} className="alert a-err">
                  <Ico.Alert/>
                  <div><strong>{w.contact?.name}</strong> saw this outfit {w.days}d ago ({fmtDate(w.date)})</div>
                </div>
              ))}
              {logOutfitId && logContactIds.length > 0 && logWarnings.length === 0 && (
                <div className="alert a-ok"><Ico.Check/>Safe — no repeat risk with selected contacts.</div>
              )}
            </div>
            <div className="modal-f">
              <button className="btn btn-ghost" onClick={() => { setLogModal(false); resetLog() }}>Cancel</button>
              <button className="btn btn-gold" style={{ minWidth:100 }} onClick={submitLog}>Log outfit</button>
            </div>
          </div>
        </div>
      )}

      {/* ── ADD OUTFIT MODAL ── */}
      {addOutfit && (
        <div className="modal-bg open" onClick={e => e.target === e.currentTarget && setAddOutfit(false)}>
          <div className="modal">
            <div className="modal-h"><span className="modal-ht">Add outfit</span><button className="modal-x" onClick={() => setAddOutfit(false)}>×</button></div>
            <div className="modal-b">
              <div className="fg"><label className="fl">Name</label><input className="fi" placeholder="e.g. Navy blazer combo" value={nName} onChange={e => setNName(e.target.value)}/></div>
              <div className="fg"><label className="fl">Style</label>
                <select className="fi" value={nStyle} onChange={e => setNStyle(e.target.value)}>
                  <option>Formal</option><option>Business casual</option><option>Smart casual</option>
                </select>
              </div>
              <div className="fg"><label className="fl">Emoji</label>
                <div className="tag-row">{EMOJIS.map(em => <span key={em} className={`tag-pill ${nEmoji === em ? 'act' : ''}`} onClick={() => setNEmoji(em)}>{em}</span>)}</div>
              </div>
              <div className="fg"><label className="fl">Colour</label>
                <div className="tag-row">{COLOURS.map(col => (
                  <span key={col.hex} className={`tag-pill ${nCol === col.hex ? 'act' : ''}`} onClick={() => setNCol(col.hex)}>
                    <span style={{ display:'inline-block', width:8, height:8, borderRadius:'50%', background:col.hex, marginRight:4, verticalAlign:'middle', border:'1px solid #ccc' }}/>
                    {col.label}
                  </span>
                ))}</div>
              </div>
              {/* Preview */}
              <div style={{ display:'flex', alignItems:'center', gap:12, padding:'11px 13px', background:'#f9f8f5', borderRadius:8, border:'1px solid #ece9e3' }}>
                <div style={{ width:50, height:50, borderRadius:8, background:nCol+'22', display:'flex', alignItems:'center', justifyContent:'center', fontSize:28 }}>{nEmoji}</div>
                <div><div style={{ fontWeight:500, fontSize:13 }}>{nName || 'Outfit name'}</div><div style={{ fontSize:11, color:'#aaa' }}>{nStyle}</div></div>
              </div>
            </div>
            <div className="modal-f">
              <button className="btn btn-ghost" onClick={() => setAddOutfit(false)}>Cancel</button>
              <button className="btn btn-dark" onClick={doAddOutfit}>Add to wardrobe</button>
            </div>
          </div>
        </div>
      )}

      {/* ── ADD CONTACT MODAL ── */}
      {addContact && (
        <div className="modal-bg open" onClick={e => e.target === e.currentTarget && setAddContact(false)}>
          <div className="modal">
            <div className="modal-h"><span className="modal-ht">Add contact</span><button className="modal-x" onClick={() => setAddContact(false)}>×</button></div>
            <div className="modal-b">
              <div className="fg"><label className="fl">Full name</label><input className="fi" placeholder="Full name" value={cName} onChange={e => setCName(e.target.value)}/></div>
              <div className="fg"><label className="fl">Company</label><input className="fi" placeholder="Company" value={cCo} onChange={e => setCCo(e.target.value)}/></div>
              <div className="fg"><label className="fl">Role</label><input className="fi" placeholder="e.g. Procurement Head" value={cRole} onChange={e => setCRole(e.target.value)}/></div>
            </div>
            <div className="modal-f">
              <button className="btn btn-ghost" onClick={() => setAddContact(false)}>Cancel</button>
              <button className="btn btn-dark" onClick={doAddContact}>Add contact</button>
            </div>
          </div>
        </div>
      )}

      {/* ── UPGRADE MODAL ── */}
      {showUpgrade && (
        <UpgradeModal
          user={user}
          currentPlan={plan.id}
          onUpgrade={planId => { onPlanChange(planId); showToast(`✓ Switched to ${PLANS[planId].name}`) }}
          onClose={() => setShowUpgrade(false)}
        />
      )}

      <div className={`toast ${toastOn ? 'show' : ''}`}>{toast}</div>
    </>
  )
}
