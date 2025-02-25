import { getServerSession } from "next-auth/next";
import { Suspense } from "react";
import { authOptions } from "server/auth";
import UserMenu from "../lists/UserMenu";

async function Header() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return null;
  }

  return (
    <header className="mx-2 flex items-center justify-end p-4 shadow-subtle-b">
      <Suspense>
        <UserMenu user={session.user} />
      </Suspense>
    </header>
  );
}

export default Header;
