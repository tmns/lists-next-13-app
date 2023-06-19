import { getServerSession } from "next-auth/next";
import { createSafeActionClient } from "next-safe-action";
import { authOptions } from "server/auth";

export const action = createSafeActionClient({
  getAuthData: async () => {
    const session = await getServerSession(authOptions);

    if (!session) {
      throw new Error("User is not authenticated!");
    }

    return session;
  },
});
