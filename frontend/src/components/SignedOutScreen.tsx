import { SignInButton } from '@clerk/clerk-react'
import { ChevronRight } from 'lucide-react'

export function SignedOutScreen() {
  return (
    <main className="signed-out">
      <img className="welcome-mark" src="/logo-yt-sum.png" alt="" />
      <img className="signed-out-wordmark" src="/logo-txt.png" alt="Summify" />
      <p>A quieter way to learn from video.</p>
      <SignInButton mode="modal">
        <button className="primary-button">
          Sign in to continue <ChevronRight size={16} />
        </button>
      </SignInButton>
    </main>
  )
}
