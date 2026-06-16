import { Navigate, NavLink, useNavigate } from 'react-router-dom'
import { Button } from '../ui/button'
import { useAuth } from '@/features/auth/AuthProvider'
import { supabase } from '@/lib/supabase'

export default function TopNavigation() {
  const { isLoggedIn } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut()

    if (error) {
      console.error('Error signing out:', error.message)
      return
    }

    navigate('/login', { replace: true })
  }
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />
  }

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `relative transition-colors duration-200 ${
      isActive
        ? 'text-primary font-semibold after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-full after:rounded-full after:bg-primary'
        : 'text-muted-foreground hover:text-foreground'
    }`

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/85">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <NavLink
          to="/reflection"
          className="text-lg font-semibold tracking-tight text-primary transition-colors hover:text-primary/90"
        >
          Duality
        </NavLink>

        <nav className="flex items-center gap-6 text-sm">
          <NavLink to="/dashboard" className={navLinkClass}>
            Dashboard
          </NavLink>
          <NavLink to="/reflection" className={navLinkClass}>
            Reflect
          </NavLink>
          <NavLink to="/history" className={navLinkClass}>
            History
          </NavLink>
          <NavLink to="/weekly-review" className={navLinkClass}>
            Weekly Review
          </NavLink>

          <Button
            variant="outline"
            size="sm"
            onClick={handleSignOut}
            className="border-border bg-card text-muted-foreground shadow-sm hover:border-primary hover:bg-primary hover:text-primary-foreground"
          >
            Sign out
          </Button>
        </nav>
      </div>
    </header>
  )
}
