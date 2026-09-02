import Grain from './components/Grain'
import Primitives from './routes/Primitives'

/**
 * There are no other pages (BRIEF.md Part 1.6), so there is no router — only
 * the one document, plus the benches that prove the primitives.
 *
 * Session 3 replaces this placeholder with the real fourteen-section
 * skeleton; until then the bench is what there is to look at.
 */
export default function App() {
  return (
    <>
      <main>
        <Primitives />
      </main>
      <Grain />
    </>
  )
}
