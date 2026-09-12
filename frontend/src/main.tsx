/* eslint-disable react-refresh/only-export-components */
import { ClerkLoaded, ClerkLoading, ClerkProvider } from '@clerk/clerk-react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './styles.css'

const key = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

/* Clerk's default surfaces (violet avatar, blue focus) are the only guaranteed
   off-palette elements in the app, so they are themed to the same ink. */
const clerkAppearance = {
  variables: {
    colorPrimary: '#1a1815',
    colorText: '#1a1815',
    colorTextSecondary: '#5c5851',
    colorBackground: '#fdfbf8',
    colorInputBackground: '#fdfbf8',
    colorInputText: '#1a1815',
    borderRadius: '4px',
    fontFamily: '"Inter Variable", Inter, ui-sans-serif, system-ui, sans-serif',
  },
  elements: {
    avatarBox: { width: '33px', height: '33px' },
    userButtonAvatarBox: { width: '33px', height: '33px' },
    userButtonPopoverCard: { borderRadius: '4px' },
  },
}

function SetupScreen() {
  return (
    <main className="gate">
      <div>
        <img className="welcome-mark" src="/logo-mark.png" alt="" />
        <img className="signed-out-wordmark" src="/logo-wordmark.png" alt="Summify" />
        <p>Add your Clerk key in <code>frontend/.env.local</code> to open the app.</p>
        <pre>VITE_CLERK_PUBLISHABLE_KEY=pk_test_...{`\n`}VITE_API_BASE_URL=http://localhost:3000</pre>
      </div>
    </main>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {key ? (
      <ClerkProvider publishableKey={key} appearance={clerkAppearance}>
        <ClerkLoading>
          <main className="gate-load" role="status">Loading Summify</main>
        </ClerkLoading>
        <ClerkLoaded>
          <App />
        </ClerkLoaded>
      </ClerkProvider>
    ) : (
      <SetupScreen />
    )}
  </StrictMode>,
)
