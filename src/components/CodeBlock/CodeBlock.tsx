import './CodeBlock.css';

interface CodeBlockProps {
  code: string;
  language?: string;
}

export default function CodeBlock({ code, language = 'text' }: CodeBlockProps) {
  return (
    <div className="code-block">
      <div className="code-block__brush" />
      <div className="code-block__header">
        <span className="code-block__lang">{language}</span>
      </div>
      <pre className="code-block__pre">
        <code className={`code-block__code language-${language}`}>{code}</code>
      </pre>
    </div>
  );
}
