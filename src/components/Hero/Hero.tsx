import { SITE_CONFIG } from '../../config/site';
import './Hero.css';

export default function Hero() {
  const handlePrimary = (e: React.MouseEvent) => {
    e.preventDefault();
    const action = SITE_CONFIG.hero.primaryAction;
    if (action === 'scroll') {
      setTimeout(() => {
        document.querySelector('.section--featured')?.scrollIntoView({ behavior: 'smooth' });
      }, 50);
    } else {
      window.location.hash = action;
    }
  };

  return (
    <section className="hero">
      <div className="hero__brush-top" />
      <div className="hero__content">
        <div className="hero__seal">{SITE_CONFIG.hero.seal}</div>
        <h1 className="hero__title">
          {SITE_CONFIG.hero.title}
          <span className="hero__title-sub"> {SITE_CONFIG.hero.titleSub}</span>
        </h1>
        <p className="hero__subtitle">{SITE_CONFIG.hero.subtitle}</p>
        <div className="hero__actions">
          <button className="hero__btn hero__btn--primary" onClick={handlePrimary}>
            {SITE_CONFIG.hero.primaryBtn}
          </button>
          <a href="#/about" className="hero__btn hero__btn--outline">
            {SITE_CONFIG.hero.secondaryBtn}
          </a>
        </div>
      </div>
      <div className="hero__brush-bottom" />
      <div className="hero__ink-wash hero__ink-wash--1" />
      <div className="hero__ink-wash hero__ink-wash--2" />
    </section>
  );
}
