export default function Spinner({ size = "md", className = "" }) {
  const sizes = {
    sm: "h-5 w-5 border-2",
    md: "h-8 w-8 border-2",
    lg: "h-12 w-12 border-3",
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div
        className={`animate-spin rounded-full border-blue-600 border-t-transparent ${sizes[size]}`}
      />
    </div>
  );
}

export function PageLoader({ message = "Loading..." }) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
      <Spinner size="lg" />
      <p className="text-sm font-medium text-slate-500">{message}</p>
    </div>
  );
}
