import { useState, useEffect } from 'react'
import { supabase } from './supabase.js'
import { CSS } from './styles.js'
import { SignIn, SignUp } from './Auth.jsx'
import { PlanSelect } from './PlanSelect.jsx'
import { Dashboard } from './Dashboard.jsx'

export default function App() {
  const [screen, setScreen]   = useState('loading')
  const [user, setUser]       = useState(null)
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    // Check existing session on mount
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        await loadProfile(session.user)
      } else {
        setScreen('signin')
      }
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') { setUser(null); setProfile(null); setScreen('signin') }
    })
    return () => subscription.unsubscribe()
  }, [])

  async function loadProfile(authUser) {
    setUser(authUser)
    const { data: p } = await supabase.from('profiles').select('*').eq('id', authUser.id).single()
    setProfile(p)
    setScreen(p?.plan ? 'app' : 'plan')
  }

  function handleAuth(authUser) { loadProfile(authUser) }
  function handlePlanSelect(planId) { setProfile(p => ({ ...p, plan: planId })); setScreen('app') }
  function handlePlanChange(planId) { setProfile(p => ({ ...p, plan: planId })) }
  function handleLogout()           { setUser(null); setProfile(null); setScreen('signin') }

  return (
    <>
      <style>{CSS}</style>
      {screen === 'loading'  && <div className="loading-screen"><div className="loading-logo">Répète</div><div className="loading-sub">Just a moment…</div></div>}
      {screen === 'signin'   && <SignIn   onDone={handleAuth}       onGoUp={() => setScreen('signup')} />}
      {screen === 'signup'   && <SignUp   onDone={handleAuth}       onGoIn={() => setScreen('signin')} />}
      {screen === 'plan'     && <PlanSelect user={user} onSelect={handlePlanSelect} />}
      {screen === 'app'      && <Dashboard user={user} profile={profile} onLogout={handleLogout} onPlanChange={handlePlanChange} />}
    </>
  )
}
