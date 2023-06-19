import Header from "./Header";
import SideNav from "./(side-nav)/SideNav";
import type { ReactElement } from "react";

function DashboardLayout({ children }: { children: ReactElement }) {
  return (
    <div className="text-white">
      <SideNav />
      <div className="pl-72">
        <Header />
        <main className="flex flex-col min-h-[calc(100vh_-_74px)] after:content-[''] after:absolute after:inset-0 after:opacity-60 after:blur-[200px] after:[background:theme(colors.main-bg)] after:pointer-events-none">{children}</main>
      </div>
    </div>
  );
}

export default DashboardLayout;
