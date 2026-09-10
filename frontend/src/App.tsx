import { SignedIn, SignedOut, useAuth } from '@clerk/clerk-react'
import { SignedOutScreen } from './components/SignedOutScreen'
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
      <SignedOut>
        <SignedOutScreen />
      </SignedOut>
    </>
  )
}
