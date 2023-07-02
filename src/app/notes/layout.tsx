import DashboardLayout from "app/(dashboard)/DashboardLayout";
import type { ReactElement } from "react";

function Layout({ children }: { children: ReactElement }) {
  return <DashboardLayout>{children}</DashboardLayout>;
}

export default Layout;
