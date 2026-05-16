import { SITE_CONFIG } from '../../config/site';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__ink-wash" />
      <div className="footer__inner">
        <div className="footer__col">
          <h3 className="footer__title">{SITE_CONFIG.logo.text}</h3>
          <p className="footer__desc">{SITE_CONFIG.footer.description}</p>
        </div>
        {SITE_CONFIG.footer.sections.map((section) => (
          <div className="footer__col" key={section.title}>
            <h4 className="footer__heading">{section.title}</h4>
            <ul className="footer__links">
              {section.links.map((link) => (
                <li key={link.label}><a href={link.href}>{link.label}</a></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="footer__bottom">
        <p>{SITE_CONFIG.footer.copyright}</p>
        <div className="footer__seal">{SITE_CONFIG.footer.seal}</div>
      </div>
    </footer>
  );
}
