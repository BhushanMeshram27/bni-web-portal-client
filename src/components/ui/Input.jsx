"use client";

export default function Input({
  label,
  error,
  icon,
  className = "",
  id,
  ...props
}) {
  const inputId = id || props.name;

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="mb-1.5 block text-sm font-medium text-slate-700"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">
            {icon}
          </div>
        )}
        <input
          id={inputId}
          className={`input-base ${icon ? "pl-10" : ""} ${error ? "border-red-400 focus:border-red-500 focus:ring-red-200" : ""} ${className}`}
          {...props}
        />
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}
