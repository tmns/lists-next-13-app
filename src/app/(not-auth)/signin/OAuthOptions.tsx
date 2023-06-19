"use client";
import { signIn } from "next-auth/react";
import Image from "next/image";

export default function OAuthOptions() {
  return (
    <div className="mt-6 grid grid-cols-2 gap-4">
      <button
        className="flex w-full items-center justify-center gap-3 rounded-md border-2 border-gray-900 bg-cyan-100 px-3 py-1.5 text-gray-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D9BF0]"
        onClick={() => void signIn("google")}
      >
        <Image
          src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
          className="h-5 w-5"
          width={20}
          height={20}
          alt=""
          aria-hidden="true"
        />
        <span className="text-sm font-semibold leading-6">Google</span>
      </button>
      <button
        className="flex w-full items-center justify-center gap-3 rounded-md border-2 border-[#404eed] bg-slate-50 px-3 py-1.5 text-[#404eed] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#24292F]"
        onClick={() => void signIn("discord")}
      >
        <Image
          src="https://www.svgrepo.com/download/353655/discord-icon.svg"
          className="h-5 w-5"
          width={20}
          height={20}
          alt=""
          aria-hidden="true"
        />
        <span className="text-sm font-semibold leading-6">Discord</span>
      </button>
    </div>
  );
}
