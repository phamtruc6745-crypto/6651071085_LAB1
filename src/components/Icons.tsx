interface IconProps {
  className?: string
}

const base = {
  width: 20,
  height: 20,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
  focusable: false,
}

export function ArrowLeftIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  )
}

export function ArrowRightIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  )
}

export function PlusIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  )
}

export function CloseIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  )
}

export function EyeIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}
