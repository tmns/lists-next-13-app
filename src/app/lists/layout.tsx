import Header from "./Header";
import SideNav from "./(side-nav)/SideNav";
import type { ReactElement } from "react";
import MobileSideNav from "./(side-nav)/MobileSideNav";

function DashboardLayout({ children }: { children: ReactElement }) {
  return (
    <div className="text-white">
      <MobileSideNav>
        <SideNav isMobile />
      </MobileSideNav>
      <SideNav />
      <div className="lg:pl-72">
        <Header />
        <main className="flex min-h-[calc(100vh_-_74px)] flex-col after:pointer-events-none after:absolute after:inset-0 after:opacity-60 after:blur-[200px] after:content-[''] after:[background:theme(colors.main-bg)]">
          {children}
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
