export default function PageHeader({ title, subtitle, action, backLink }) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        {backLink && <div className="mb-2">{backLink}</div>}
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 lg:text-3xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
