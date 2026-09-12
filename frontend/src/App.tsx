import { SignedIn, SignedOut, useAuth } from '@clerk/clerk-react'
import { LandingPage } from './components/landing/LandingPage'
import { Workspace } from './components/Workspace'

function AuthenticatedWorkspace() {
  const { getToken } = useAuth()
  return <Workspace getToken={getToken} />
}

export default function App() {
  return (
    <>
      <SignedIn>
        <AuthenticatedWorkspace />
      </SignedIn>
      {/* Someone without a session gets the page that explains the product and
          offers one way in, rather than a locked door. */}
      <SignedOut>
        <LandingPage />
      </SignedOut>
    </>
  )
}
