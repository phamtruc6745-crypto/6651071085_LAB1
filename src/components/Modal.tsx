import { useEffect, useId, useRef, type KeyboardEvent as ReactKeyboardEvent, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { CloseIcon } from './Icons'
import { useLanguage } from '../hooks/useLanguage'

interface ModalProps {
  title: string
  onClose: () => void
  children: ReactNode
  wide?: boolean
}

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'

export function Modal({ title, onClose, children, wide = false }: ModalProps) {
  const { t } = useLanguage()
  const titleId = useId()
  const dialogRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const opener = document.activeElement
    const dialog = dialogRef.current
    if (dialog !== null) {
      const first = dialog.querySelector<HTMLElement>(FOCUSABLE)
      if (first !== null) {
        first.focus()
      } else {
        dialog.focus()
      }
    }
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
      if (opener instanceof HTMLElement) {
        opener.focus()
      }
    }
  }, [])

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopPropagation()
        onClose()
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [onClose])

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'Tab') {
      return
    }
    const dialog = dialogRef.current
    if (dialog === null) {
      return
    }
    const items = Array.from(dialog.querySelectorAll<HTMLElement>(FOCUSABLE))
    if (items.length === 0) {
      event.preventDefault()
      dialog.focus()
      return
    }
    const first = items[0]
    const last = items[items.length - 1]
    const active = document.activeElement
    if (event.shiftKey && (active === first || active === dialog)) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && active === last) {
      event.preventDefault()
      first.focus()
    } else if (!dialog.contains(active)) {
      event.preventDefault()
      first.focus()
    }
  }

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/60 p-0 sm:items-center sm:p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose()
        }
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        onKeyDown={handleKeyDown}
        className={`max-h-[92vh] w-full overflow-y-auto rounded-t-xl bg-white shadow-xl sm:rounded-xl ${
          wide ? 'sm:max-w-4xl' : 'sm:max-w-xl'
        }`}
      >
        <div className="flex items-start justify-between gap-4 border-b-4 border-brand px-5 py-4">
          <h2 id={titleId} className="text-lg font-bold text-slate-900">
            {title}
          </h2>
          <button type="button" className="btn-icon shrink-0" aria-label={t('modal.close')} onClick={onClose}>
            <CloseIcon />
          </button>
        </div>
        <div className="px-5 py-4">{children}</div>
      </div>
    </div>,
    document.body,
  )
}
