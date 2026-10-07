import { cn } from '@/lib/cn'

type Props = {
  title: string
  body?: string
  eyebrow?: string
  id?: string
  as?: 'h1' | 'h2'
  className?: string
}

export function SectionHeading({ title, body, eyebrow, id, as: Tag = 'h2', className }: Props) {
  return (
    <div className={cn('mb-8 flex max-w-2xl flex-col gap-3', className)}>
      {eyebrow && (
        <p className="text-sm font-bold tracking-widest text-accent-text uppercase">{eyebrow}</p>
      )}
      <Tag
        id={id}
        className={cn(
          'font-extrabold',
          Tag === 'h1' ? 'text-4xl sm:text-5xl' : 'text-3xl sm:text-4xl',
        )}
      >
        {title}
      </Tag>
      {body && <p className="text-lg text-muted">{body}</p>}
    </div>
  )
}
