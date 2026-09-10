/* eslint-disable react-refresh/only-export-components */
import { ClerkProvider } from '@clerk/clerk-react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { InkWashBackground } from './components/InkWashBackground'
import './styles.css'

const key = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
function SetupScreen() {
  return <main className="signed-out"><div><img className="welcome-mark" src="/logo-yt-sum.png" alt="" /><img className="signed-out-wordmark" src="/logo-txt.png" alt="Summify" /><p>Add your Clerk key in <code>frontend/.env.local</code> to open the workspace.</p><pre>VITE_CLERK_PUBLISHABLE_KEY=pk_test_...{`\n`}VITE_API_BASE_URL=http://localhost:3000</pre></div></main>
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <InkWashBackground />
    {key ? (
      <ClerkProvider publishableKey={key}>
        <App />
      </ClerkProvider>
    ) : (
      <SetupScreen />
    )}
  </StrictMode>,
)
