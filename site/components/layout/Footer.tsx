import Link from 'next/link'
import { SCOPE_TEXT } from '@/lib/content'

const COLUMNS = [
  {
    heading: 'Product',
    links: [
      { href: '/how-it-works', label: 'How it works' },
      { href: '/what-we-test', label: 'What we test' },
      { href: '/why-preventive', label: 'Why preventive health' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { href: '/about', label: 'About' },
      { href: '/about#contact', label: 'Contact' },
    ],
  },
  {
    heading: 'Legal',
    links: [
      { href: '/privacy', label: 'Privacy' },
      { href: '/terms', label: 'Terms' },
      { href: '/medical-disclaimer', label: 'Medical disclaimer' },
    ],
  },
]

/** §12 footer — --forest-deep. The footer does not animate. */
export function Footer() {
  return (
    <footer className="footer on-dark">
      <div className="container-h">
        <div className="footer__top grid-h">
          <div className="footer__brand">
            <span className="nav__wordmark footer__wordmark">HUMAN</span>
            <p className="t-small footer__tagline">Know earlier. Act sooner.</p>
          </div>
          {COLUMNS.map((column) => (
            <div key={column.heading} className="footer__column">
              <h2 className="t-caption footer__heading">{column.heading}</h2>
              <ul className="footer__list">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link className="footer__link t-small" href={link.href}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className="t-caption footer__scope">
          {SCOPE_TEXT.replace('nothing here', 'nothing on this site')} Blood tests are carried out by
          accredited partner laboratories. If you have symptoms that concern you, please see a doctor.
        </p>

        <p className="t-caption footer__legal">© 2026 HUMAN. Made in India.</p>
      </div>
    </footer>
  )
}
