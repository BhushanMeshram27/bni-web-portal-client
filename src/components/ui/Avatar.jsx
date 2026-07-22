export default function Avatar({ name, size = "md", className = "" }) {
  const initial = name?.charAt(0)?.toUpperCase() || "?";

  const sizes = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-12 w-12 text-base",
  };

  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-600 ${sizes[size]} ${className}`}
    >
      {initial}
    </div>
  );
}
