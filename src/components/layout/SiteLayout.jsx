import SiteNavbar from "./SiteNavbar";
import SiteFooter from "./SiteFooter";

export default function SiteLayout({
  children,
  showNavbar = true,
  showFooter = true,
  className = "",
}) {
  return (
    <div className={`min-h-screen flex flex-col ${className}`}>
      {showNavbar && <SiteNavbar />}
      <div className={showNavbar ? "flex-1 pt-20" : "flex-1"}>{children}</div>
      {showFooter && <SiteFooter />}
    </div>
  );
}
