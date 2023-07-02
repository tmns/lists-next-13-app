import type { ReactElement } from "react";
import Header from "./Header";
import MobileSideNav from "./MobileSideNav";
import SideNav from "./SideNav";

function DashboardLayout({ children }: { children: ReactElement }) {
  return (
    <div className="text-white">
      <MobileSideNav>
        <SideNav isMobile />
      </MobileSideNav>
      <SideNav />
      <div className="lg:pl-72">
        <Header />
        <main className="flex min-h-[calc(100vh_-_74px)] flex-col after:pointer-events-none after:absolute after:inset-0 after:content-[''] after:[background:theme(colors.main-bg)]">
          {children}
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
