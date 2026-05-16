import { SITE_CONFIG } from '../../config/site';
import './About.css';

interface AboutProps {
  onBack: () => void;
}

export default function About({ onBack }: AboutProps) {
  const cfg = SITE_CONFIG.about;

  return (
    <div className="about">
      <div className="about__inner">
        <button className="about__back" onClick={onBack}>
          <span className="about__back-arrow">←</span>
          返回首页
        </button>

        <div className="about__seal">{cfg.seal}</div>
        <h1 className="about__title">{cfg.title}</h1>
        <p className="about__subtitle">{cfg.subtitle}</p>

        <div className="about__ink-bar" />

        <div className="about__content">
          {cfg.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}

          {cfg.sections.map((section) => (
            <div key={section.title}>
              <h3 className="about__section-title">{section.title}</h3>
              {section.content && <p>{section.content}</p>}
              {section.list && (
                <ul className="about__tech-list">
                  {section.list.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}

          <div className="about__seal-small">{cfg.sealSmall}</div>
        </div>
      </div>
    </div>
  );
}
