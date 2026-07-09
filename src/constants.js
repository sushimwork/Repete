// ── PLANS ─────────────────────────────────────────────────────────────────────
export const PLANS = {
  starter: {
    id: 'starter', name: 'Starter', price: 'Free', badge: '🪡',
    logsPerDay: 2, historyDays: 30, maxOutfits: 10, maxContacts: 20,
    features: ['2 outfit log per day','30-day history','Up to 10 outfits','Up to 20 contacts','Repeat alerts'],
    missing:  ['Multiple logs per day','90-day+ history','Unlimited wardrobe','Advanced analytics'],
  },
  professional: {
    id: 'professional', name: 'Professional', price: '₹499/mo', badge: '🧵',
    logsPerDay: 5, historyDays: 90, maxOutfits: 50, maxContacts: 999,
    features: ['5 outfit logs per day','90-day history','Up to 50 outfits','Unlimited contacts','Repeat alerts','History export'],
    missing:  ['Unlimited daily logs','365-day history','Unlimited wardrobe'],
  },
  executive: {
    id: 'executive', name: 'Executive', price: '₹999/mo', badge: '👑',
    logsPerDay: Infinity, historyDays: 365, maxOutfits: Infinity, maxContacts: Infinity,
    features: ['Unlimited daily logs','365-day history','Unlimited outfits','Unlimited contacts','Priority repeat alerts','Advanced analytics','History export','Dedicated support'],
    missing:  [],
  },
}

// ── SEED DATA (for new users) ─────────────────────────────────────────────────
export const SEED_WARDROBE = [
  { name:'Navy blazer set',   emoji:'👔', colour:'#1a1a2e', style:'Formal',          uses:0 },
  { name:'Charcoal suit',     emoji:'🧥', colour:'#3a3a3a', style:'Formal',          uses:0 },
  { name:'Tan blazer',        emoji:'🧥', colour:'#8b7355', style:'Business casual', uses:0 },
  { name:'White shirt smart', emoji:'👕', colour:'#c0bdb8', style:'Smart casual',    uses:0 },
]

export const SEED_CONTACTS = [
  { name:'Priya Sharma', company:'Infosys',    job_role:'Procurement Head', colour:'#7c3aed', initials:'PS' },
  { name:'Rahul Mehta',  company:'HDFC Bank',  job_role:'CFO',              colour:'#0369a1', initials:'RM' },
  { name:'Anil Gupta',   company:'Tata Group', job_role:'VP Operations',    colour:'#b45309', initials:'AG' },
]

// ── MISC ──────────────────────────────────────────────────────────────────────
export const EMOJIS  = ['👔','🧥','👗','👕','🥻','🎽','👘','🩱']
export const COLOURS = [
  { label:'Navy',    hex:'#1a1a2e' }, { label:'Charcoal', hex:'#3a3a3a' },
  { label:'Tan',     hex:'#8b7355' }, { label:'Brown',    hex:'#6b4c3b' },
  { label:'Olive',   hex:'#4a5e3a' }, { label:'Grey',     hex:'#888888' },
  { label:'Blue',    hex:'#1a3a5c' }, { label:'White',    hex:'#d0cdc8' },
  { label:'Maroon',  hex:'#7f1d1d' }, { label:'Green',    hex:'#14532d' },
]
export const AV_COLS = ['#7c3aed','#0369a1','#b45309','#065f46','#9f1239','#0f766e','#1d4ed8','#92400e']

// ── UTILS ─────────────────────────────────────────────────────────────────────
export const todayStr  = () => new Date().toISOString().split('T')[0]
export const fmtDate   = d  => new Date(d).toLocaleDateString('en-IN',{ day:'numeric', month:'short', year:'numeric' })
export const daysDiff  = (d1,d2) => Math.round((new Date(d1)-new Date(d2))/86400000)
export const mkInitials = n => n.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase()

export const pwStrength = pw => {
  if (!pw) return { score:0, label:'', color:'#eee' }
  let s = 0
  if (pw.length >= 8) s++
  if (/[A-Z]/.test(pw)) s++
  if (/[0-9]/.test(pw)) s++
  if (/[^A-Za-z0-9]/.test(pw)) s++
  return [
    { score:0, label:'',       color:'#eee'     },
    { score:1, label:'Weak',   color:'#e05252'  },
    { score:2, label:'Fair',   color:'#f0a500'  },
    { score:3, label:'Good',   color:'#3a9e5f'  },
    { score:4, label:'Strong', color:'#1a7a40'  },
  ][s]
}
