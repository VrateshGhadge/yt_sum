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
    <main className="grid min-h-[100dvh] place-content-center justify-items-center p-6 text-center">
      <div>
        <img className="mx-auto mb-2 w-14 invert" src="/logo-mark.png" alt="" />
        <img className="mx-auto mb-1.5 h-[30px] w-auto object-contain" src="/logo-wordmark.png" alt="Summify" />
        <p className="max-w-[42ch] text-[13.5px] leading-[1.55] text-ink-3">
          Add your Clerk key in <code className="font-mono text-[12.5px]">frontend/.env.local</code> to open the app.
        </p>
        <pre className="mt-3.5 rounded border border-line bg-sunken px-3 py-[11px] text-left font-mono text-[11px] leading-[1.7] text-ink-3">
          VITE_CLERK_PUBLISHABLE_KEY=pk_test_...{`\n`}VITE_API_BASE_URL=http://localhost:3000
        </pre>
      </div>
    </main>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {key ? (
      <ClerkProvider publishableKey={key} appearance={clerkAppearance}>
        <ClerkLoading>
          <main className="grid min-h-[100dvh] place-items-center text-[13px] text-ink-4" role="status">
            Loading Summify
          </main>
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
