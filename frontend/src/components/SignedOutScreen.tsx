import { SignInButton } from '@clerk/clerk-react'
import { ArrowRight } from 'lucide-react'

export function SignedOutScreen() {
  return (
    <main className="gate">
      <h1 className="sr-only">Summify</h1>
      <img className="welcome-mark" src="/logo-mark.png" alt="" />
      <img className="signed-out-wordmark" src="/logo-wordmark.png" alt="Summify" />
      <p>Summarize any YouTube video, ask it questions, and quiz yourself.</p>
      <SignInButton mode="modal">
        <button type="button" className="btn">
          Sign in
          <ArrowRight size={13} aria-hidden="true" />
        </button>
      </SignInButton>
    </main>
  )
}
