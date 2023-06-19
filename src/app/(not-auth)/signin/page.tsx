import { getServerSession } from "next-auth/next";
import { authOptions } from "server/auth";
import OAuthOptions from "./OAuthOptions";
import { redirect } from "next/navigation";

const SignIn = async () => {
  const session = await getServerSession(authOptions);
  if (session) redirect("/lists");

  return (
    <>
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-sky-100">
          Sign in to your account
        </h2>
      </div>
      <div className="sm:mx-auto sm:w-full sm:max-w-[480px]">
        <div className="rounded-lg bg-white px-6 py-12 shadow sm:px-12">
          <div className="relative">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm font-medium leading-6">
              <span className="bg-white px-6 text-gray-900">
                You can use the following to sign in
              </span>
            </div>
          </div>
          <OAuthOptions />
        </div>
      </div>
    </>
  );
};

export default SignIn;
