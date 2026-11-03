import { Link, NavLink } from 'react-router-dom'
import { LanguageSwitcher } from './LanguageSwitcher'
import logo from '../assets/logo.svg'
import { useLanguage } from '../hooks/useLanguage'

export function Header() {
  const { t } = useLanguage()

  return (
    <header className="border-b-4 border-brand bg-white">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <Link to="/" className="flex items-center gap-3 rounded-md">
          <img src={logo} alt={t('app.logoAlt')} width={40} height={40} className="h-10 w-10" />
          <span className="text-lg font-bold text-brand-800">{t('app.title')}</span>
        </Link>
        <div className="flex items-center gap-4">
          <nav aria-label={t('nav.main')}>
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `rounded-md px-3 py-1.5 text-sm font-semibold ${
                  isActive ? 'bg-brand-100 text-brand-900' : 'text-brand-700 hover:bg-brand-50'
                }`
              }
            >
              {t('nav.board')}
            </NavLink>
          </nav>
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  )
}
