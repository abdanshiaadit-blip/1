import Grain from './components/Grain'
import Header from './components/Header'
import MobileBar from './components/MobileBar'
import Telemetry from './components/Telemetry'
import AppSection from './sections/AppSection'
import Close from './sections/Close'
import DontKnow from './sections/DontKnow'
import DontSell from './sections/DontSell'
import Footer from './sections/Footer'
import Hero from './sections/Hero'
import Includes from './sections/Includes'
import Ledger from './sections/Ledger'
import Loop from './sections/Loop'
import Panel from './sections/Panel'
import Questions from './sections/Questions'
import Retest from './sections/Retest'
import SilentBuild from './sections/SilentBuild'
import YourOwnPast from './sections/YourOwnPast'
import Lab from './routes/Lab'
import Primitives from './routes/Primitives'

/**
 * One document. There are no other pages (BRIEF.md Part 1.6) — no blog, no
 * careers link, no about page, no login, no pricing page — so there is no
 * router, only the bench routes that prove the primitives and the session-2
 * gate screen.
 *
 * Section order and scroll budgets are Part 6. The narrative spine runs
 * unease -> clarity -> desire -> trust -> decision, and the motion intensity
 * follows the same arc and then drops: 7.9 through 7.12 have the least
 * animation on the page, because decisions get made in stillness.
 */
export default function App() {
  const route = typeof window === 'undefined' ? '/' : window.location.pathname
  if (route === '/primitives') return <Bench><Primitives /></Bench>
  if (route === '/lab') return <Bench><Lab /></Bench>

  return (
    <>
      <Header />
      <main id="top">
        <Hero />
        <SilentBuild />
        <Ledger />
        <Loop />
        <AppSection />
        <Retest />
        <Panel />
        <YourOwnPast />
        <DontSell />
        <DontKnow />
        <Includes />
        <Questions />
        <Close />
        <Footer />
      </main>
      <Telemetry />
      <MobileBar />
      <Grain />
    </>
  )
}

function Bench({ children }: { children: React.ReactNode }) {
  return (
    <>
      <main>{children}</main>
      <Grain />
    </>
  )
}
