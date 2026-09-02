import Image from 'next/image'
import { SCREENS, type ScreenId } from '@/lib/screens'

/**
 * §9.3 — the one device component, used everywhere a screen appears.
 *
 * The bezel holds the aspect ratio and reserves the space before the image
 * loads. `overflow: hidden` lives on the viewport only, never on an
 * ancestor that also holds the caption. Screens use `object-fit: contain`;
 * `cover` is banned on app screens (§8.3) because cropping a UI screenshot
 * destroys it.
 */
export function Phone({
  screen,
  caption,
  priority = false,
  className,
}: {
  screen: ScreenId
  caption?: string
  priority?: boolean
  className?: string
}) {
  const { src, alt } = SCREENS[screen]
  return (
    <figure className={['phone', className].filter(Boolean).join(' ')}>
      <div className="phone__bezel">
        <div className="phone__viewport">
          <Image
            className="phone__screen"
            src={src}
            alt={alt}
            width={1170}
            height={2532}
            priority={priority}
            sizes="(max-width: 1023px) 280px, 390px"
          />
        </div>
      </div>
      {caption && <figcaption className="phone__caption t-caption">{caption}</figcaption>}
    </figure>
  )
}

/**
 * §9.4 — the rail's phone. Every screen it will ever show is stacked in the
 * viewport from first paint, so a crossfade is an opacity change and
 * nothing is ever loaded, mounted or measured mid-scroll. The first screen
 * rests at opacity 1, which is also the correct no-JS state.
 */
export function PhoneStack({
  screens,
  className,
}: {
  screens: readonly ScreenId[]
  className?: string
}) {
  return (
    <figure className={['phone', className].filter(Boolean).join(' ')} data-phone-stack>
      <div className="phone__bezel">
        <div className="phone__viewport">
          {screens.map((id, index) => (
            <Image
              key={id + index}
              className="phone__screen phone__screen--layer"
              data-screen-index={index}
              src={SCREENS[id].src}
              alt={index === 0 ? SCREENS[id].alt : ''}
              aria-hidden={index === 0 ? undefined : true}
              width={1170}
              height={2532}
              sizes="(max-width: 1023px) 280px, 390px"
              style={{ opacity: index === 0 ? 1 : 0 }}
            />
          ))}
        </div>
      </div>
    </figure>
  )
}
