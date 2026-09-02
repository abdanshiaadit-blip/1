import { Header } from './components/Header'
import { MobileBar } from './components/MobileBar'
import { Close } from './sections/Close'
import { DontSell } from './sections/DontSell'
import { Honest } from './sections/Honest'
import { Ledger } from './sections/Ledger'
import { Loop } from './sections/Loop'
import { Opening } from './sections/Opening'
import { OwnPast } from './sections/OwnPast'
import { Panel } from './sections/Panel'
import { Price } from './sections/Price'
import { Questions } from './sections/Questions'
import { Retest } from './sections/Retest'
import { SilentBuild } from './sections/SilentBuild'
import { SiteFooter } from './sections/SiteFooter'
import { AppStage } from './sections/AppStage'

/* The single argument, in thirteen beats plus a footer. spec 4.
   Order is the design: each beat earns the next. */

export default function App() {
  return (
    <>
      <a className="skip-link t-body" href="#close">
        Skip to the waitlist
      </a>

      <Header />

      <main id="main">
        <Opening />
        <SilentBuild />
        <Ledger />
        <Loop />
        <AppStage />
        <Retest />
        <Panel />
        <OwnPast />
        <DontSell />
        <Honest />
        <Price />
        <Questions />
        <Close />
        <SiteFooter />
      </main>

      <MobileBar />
    </>
  )
}
