import PageContainer from "./PageContainer";

export function MemberPageHero({ eyebrow, title, description, action }) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-blue-700 via-indigo-700 to-purple-700 p-6 shadow-lg sm:p-8 md:p-10">
      <div className="absolute right-0 top-0 h-56 w-56 rounded-full bg-white/10 blur-3xl" aria-hidden="true" />

      <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl">
          {eyebrow && (
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-100">
              {eyebrow}
            </p>
          )}
          <h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl">{title}</h1>
          {description && (
            <p className="mt-3 text-base leading-relaxed text-blue-100 sm:text-lg">
              {description}
            </p>
          )}
        </div>
        {action}
      </div>
    </div>
  );
}

export function MemberStatCard({ title, value, icon, accent = "text-blue-600" }) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:shadow-md sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className={`mt-2 text-3xl font-bold tracking-tight sm:text-4xl ${accent}`}>
            {value}
          </p>
        </div>
        {icon && (
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-2xl">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}

export function MemberPageSection({ title, description, children, className = "" }) {
  return (
    <section className={`rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6 md:p-8 ${className}`}>
      {(title || description) && (
        <div className="mb-6">
          {title && <h2 className="text-xl font-semibold text-slate-900 sm:text-2xl">{title}</h2>}
          {description && <p className="mt-1 text-sm text-slate-500 sm:text-base">{description}</p>}
        </div>
      )}
      {children}
    </section>
  );
}

export function MemberPageLoading({ label = "Loading..." }) {
  return (
    <PageContainer className="flex min-h-[50vh] items-center justify-center">
      <div className="text-center">
        <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
        <p className="mt-4 text-base font-medium text-slate-600">{label}</p>
      </div>
    </PageContainer>
  );
}

export default function MemberPageShell({ children, className = "" }) {
  return (
    <PageContainer className={`space-y-6 sm:space-y-8 ${className}`}>
      {children}
    </PageContainer>
  );
}
