import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "pages/api/auth/[...nextauth]";
import { getLists } from "utils/get";

async function Lists() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/signin");

  const lists = await getLists(session?.user.id);
  if (lists[0]) redirect(`/lists/${lists[0].id}`);

  return (
    <div className="p-4">
      <p>
        You haven't created any lists yet. Get started by using the button in the lower left corner!
      </p>
    </div>
  );
}

export default Lists;
