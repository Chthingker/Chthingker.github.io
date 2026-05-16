import { SITE_CONFIG } from '../../config/site';
import './Header.css';

interface HeaderProps {
  currentPage: string;
}

export default function Header({ currentPage }: HeaderProps) {
  const isActive = (page: string) => currentPage === page ? 'active' : '';

  return (
    <header className="header">
      <div className="header__inner">
        <div className="header__brand">
          <a href="#/" className="header__logo">
            <span className="header__logo-icon">{SITE_CONFIG.logo.icon}</span>
            <span className="header__logo-text">{SITE_CONFIG.logo.text}</span>
          </a>
        </div>
        <nav className="header__nav">
          {SITE_CONFIG.nav.map((link) => {
            const pageName = link.href.replace('#/', '') || 'home';
            return (
              <a
                key={link.href}
                href={link.href}
                className={`header__nav-link ${isActive(pageName)}`}
              >
                {link.label}
              </a>
            );
          })}
        </nav>
        <button className="header__menu-btn" aria-label="菜单">
          <span className="header__menu-line" />
          <span className="header__menu-line" />
          <span className="header__menu-line" />
        </button>
      </div>
    </header>
  );
}
