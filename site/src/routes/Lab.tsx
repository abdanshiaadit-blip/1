/**
 * BRIEF.md Part 5.9 step 4 and Part 11 session 2.
 *
 * A dark page, the frame, the glow, and one static app screen inside it.
 * Nothing else. The gate is not a test:
 *
 * > If this one screen doesn't look expensive, stop. Nothing else will save it.
 */

import DeviceFrame from '../components/DeviceFrame'
import FrameCell from '../components/FrameCell'
import SectionWash from '../components/SectionWash'

export default function Lab() {
  return (
    <section className="lab">
      <SectionWash />
      <div className="page grid12 lab__grid">
        <FrameCell name="lab-type" cols={[1, 5]} className="lab__type">
          <p className="t-telemetry">04 / 05</p>
          <h1 className="t-display-m lab__h">Start your day</h1>
          <p className="t-body lab__p">
            Today&rsquo;s actions on one screen. One tap to confirm. Your watch and cycle
            sync on their own.
          </p>
        </FrameCell>

        <FrameCell name="lab-device" cols={[7, 12]} className="lab__device">
          <DeviceFrame>
            <img
              src="/app/screen-plan.webp"
              alt="The HUMAN app showing today's actions, each with a control to confirm it."
              width={390}
              height={844}
            />
          </DeviceFrame>
        </FrameCell>
      </div>
    </section>
  )
}
