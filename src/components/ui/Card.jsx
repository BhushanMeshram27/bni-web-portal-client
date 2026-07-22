export default function Card({ children, className = "", padding = true }) {
  return (
    <div className={`card overflow-hidden ${padding ? "p-6" : ""} ${className}`}>
      {children}
    </div>
  );
}

export function CardHeader({ title, subtitle, action, className = "" }) {
  return (
    <div className={`flex items-start justify-between gap-4 ${className}`}>
      <div>
        {title && (
          <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
        )}
        {subtitle && (
          <p className="mt-0.5 text-sm text-slate-500">{subtitle}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
