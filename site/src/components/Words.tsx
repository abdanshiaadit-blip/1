import { Fragment, type ElementType } from 'react'
import { splitWords } from '../lib/hooks'

/**
 * A heading that arrives a word at a time.
 *
 * The stagger is a CSS expression of each word's index, so there is no
 * per-word timer and no per-frame work — the whole line costs one class
 * toggle.
 *
 * The space between words is a text node BETWEEN the masks, never inside
 * one: a word's mask clips its overflow, and an inline-block collapses a
 * trailing space, so a space kept inside would simply vanish.
 */
export default function Words({
  text,
  shown,
  as: Tag = 'h2',
  className = '',
  id,
}: {
  text: string
  shown: boolean
  as?: ElementType
  className?: string
  id?: string
}) {
  const words = splitWords(text)
  return (
    <Tag id={id} className={`words ${shown ? 'in' : ''} ${className}`}>
      {words.map(({ word, i }) => (
        <Fragment key={`${word}-${i}`}>
          <span className="words__w" style={{ '--i': i } as React.CSSProperties}>
            <span className="words__i">{word}</span>
          </span>
          {i < words.length - 1 ? ' ' : null}
        </Fragment>
      ))}
    </Tag>
  )
}
