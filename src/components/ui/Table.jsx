export default function Table({ children, className = "" }) {
  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="min-w-full divide-y divide-slate-200">{children}</table>
    </div>
  );
}

export function TableHead({ children }) {
  return (
    <thead className="bg-slate-50">
      <tr>{children}</tr>
    </thead>
  );
}

export function TableHeader({ children, className = "" }) {
  return (
    <th
      className={`px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 ${className}`}
    >
      {children}
    </th>
  );
}

export function TableBody({ children }) {
  return <tbody className="divide-y divide-slate-100 bg-white">{children}</tbody>;
}

export function TableRow({ children, className = "" }) {
  return (
    <tr className={`transition hover:bg-slate-50/80 ${className}`}>
      {children}
    </tr>
  );
}

export function TableCell({ children, className = "" }) {
  return (
    <td className={`px-6 py-4 text-sm text-slate-600 ${className}`}>
      {children}
    </td>
  );
}
