import './InkTable.css';

interface InkTableProps {
  headers: string[];
  rows: string[][];
}

export default function InkTable({ headers, rows }: InkTableProps) {
  return (
    <div className="ink-table-wrapper">
      <table className="ink-table">
        <thead>
          <tr>
            {headers.map((h) => (
              <th key={h} className="ink-table__th">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="ink-table__row">
              {row.map((cell, j) => (
                <td key={j} className="ink-table__td">{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
