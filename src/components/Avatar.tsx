function getInitials(name: string): string {
  const words = name.trim().split(/\s+/).filter((word) => word !== '')
  if (words.length === 0) {
    return '?'
  }
  const first = words[0].charAt(0)
  const last = words.length > 1 ? words[words.length - 1].charAt(0) : ''
  return (first + last).toUpperCase()
}

export function Avatar({ name }: { name: string }) {
  return (
    <span
      aria-hidden="true"
      className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-700 text-xs font-bold text-white"
    >
      {getInitials(name)}
    </span>
  )
}
