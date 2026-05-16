import './Callout.css';

interface CalloutProps {
  type: 'note' | 'warning' | 'tip';
  children: string;
}

const ICONS: Record<CalloutProps['type'], string> = {
  note: '记',
  warning: '慎',
  tip: '巧',
};

export default function Callout({ type, children }: CalloutProps) {
  return (
    <div className={`callout callout--${type}`}>
      <div className="callout__bar" />
      <div className="callout__body">
        <span className="callout__icon">{ICONS[type]}</span>
        <p className="callout__text">{children}</p>
      </div>
    </div>
  );
}
