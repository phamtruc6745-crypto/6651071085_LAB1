export function formatCurrency(amount: number, currency: string = 'VND'): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency,
  }).format(amount)
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text
  }
  return text.slice(0, maxLength) + '...'
}

export function validateEmail(email: string): boolean {
  const pattern = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)*\.[A-Za-z]{2,}$/
  return pattern.test(email)
}

export function debounce<T extends (...args: never[]) => void>(fn: T, delay: number): T {
  let timer: ReturnType<typeof setTimeout> | undefined
  const wrapped = (...args: Parameters<T>): void => {
    if (timer !== undefined) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      fn(...args)
    }, delay)
  }
  return wrapped as T
}
