import { Container, Grid } from './Container'

/**
 * The one `<h1>` on every page other than the home page, where the hero
 * carries it (§14.7). Left-aligned, like the rest of the site.
 */
export function PageHeader({ title, lede }: { title: string; lede: string }) {
  return (
    <header className="page-header">
      <Container>
        <Grid>
          <div className="place-text">
            <h1 className="t-h1 measure-head">{title}</h1>
            <p className="t-lead measure-lead page-header__lede">{lede}</p>
          </div>
        </Grid>
      </Container>
    </header>
  )
}
