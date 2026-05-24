import Sidebar from "@/components/layout/Sidebar";
import TopNav from "@/components/layout/TopNav";

export default function DashboardLayout({
  children,
  lockViewport = false,
}: {
  children: React.ReactNode;
  lockViewport?: boolean;
}) {
  return (
    <div
      className={`flex bg-background bg-hero-gradient bg-grid ${
        lockViewport ? "h-screen overflow-hidden" : "min-h-screen"
      }`}
    >
      <Sidebar />
      <div
        className={`relative flex flex-1 flex-col ${
          lockViewport ? "h-screen min-h-0 overflow-hidden" : "min-h-0"
        }`}
      >
        <div className="pointer-events-none absolute inset-0 bg-dashboard-glow" aria-hidden />
        <TopNav />
        <main
          className={`relative flex-1 ${lockViewport ? "min-h-0 overflow-hidden" : ""}`}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
