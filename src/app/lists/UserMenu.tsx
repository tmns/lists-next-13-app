"use client";
import { useState } from "react";
import { ArrowLeftOnRectangleIcon, PencilSquareIcon } from "@heroicons/react/20/solid";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import type { Session } from "next-auth/core/types";
import { signOut } from "next-auth/react";
import Image from "next/image";
import { Circles } from "react-loading-icons";
import Link from "next/link";

type UserProps = {
  user: Session["user"];
};

export default function UserMenu({ user }: UserProps) {
  const [isSigningOut, setIsSigningOut] = useState(false);

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger className="-m-1.5 mr-2 flex items-center p-1.5">
        <span className="sr-only">Open user menu</span>
        <Image
          className="h-8 w-8 rounded-full bg-gray-50"
          src={user.image as string}
          alt=""
          width={32}
          height={32}
        />
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          loop
          side="bottom"
          sideOffset={4}
          align="end"
          alignOffset={0}
          className="z-50 w-32 rounded-md bg-gray-900 p-2 text-sm text-white ring-1 ring-black ring-opacity-5 drop-shadow-xl focus:outline-none radix-state-open:animate-slide-up-fade"
        >
          <DropdownMenu.Item
            className="flex w-full items-center rounded-sm p-2 transition-colors duration-300 hover:bg-gray-800"
            asChild
          >
            <Link className="flex items-center gap-4" href="/notes">
              <PencilSquareIcon className="h-4 w-4" aria-hidden />
              Notes
            </Link>
          </DropdownMenu.Item>
          <DropdownMenu.Item
            className="flex w-full items-center rounded-sm p-2 transition-colors duration-300 hover:bg-gray-800"
            onSelect={async (e) => {
              e.preventDefault();
              setIsSigningOut(true);
              try {
                await signOut();
              } catch (e) {
                console.log({ e });
              } finally {
                setIsSigningOut(false);
              }
            }}
            asChild
          >
            <button type="button" className="flex items-center gap-4">
              {isSigningOut ? (
                <Circles height="1em" width="1.15em" />
              ) : (
                <ArrowLeftOnRectangleIcon className="h-4 w-4" aria-hidden />
              )}
              Logout
            </button>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
