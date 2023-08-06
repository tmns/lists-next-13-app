import type { List } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { type NextRequest, NextResponse } from "next/server";
import { authOptions } from "pages/api/auth/[...nextauth]";
import { prisma } from "server/db";
import { getLists } from "utils/get";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response("Not logged in", { status: 401 });
  }

  const lists = await getLists(session.user.id);

  const sortedLists = lists.sort((a: List, b: List) => a.createdAt?.localeCompare(b.createdAt));

  return NextResponse.json(sortedLists);
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response("Not logged in", { status: 401 });
  }

  const data = (await request.json()) as { name: string };

  const time = String(Date.now());

  const newList = await prisma.list.create({
    data: {
      name: data.name,
      userId: session.user.id,
      createdAt: time,
      updatedAt: time,
    },
    select: { id: true, name: true },
  });

  return NextResponse.json(newList);
}

export async function PATCH(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response("Not logged in", { status: 401 });
  }

  const data = (await request.json()) as { name: string; id: string };

  const listToUpdate = await prisma.list.findUnique({
    where: { id: data.id, userId: session.user.id },
  });

  if (!listToUpdate) return new Response("List not found", { status: 404 });

  const updatedList = await prisma.list.update({
    data: { name: data.name, updatedAt: String(Date.now()) },
    where: { id: data.id },
    select: { id: true, name: true },
  });

  return NextResponse.json(updatedList);
}

export async function DELETE(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response("Not logged in", { status: 401 });
  }

  const data = (await request.json()) as { id: string };

  const listToDelete = await prisma.list.findUnique({
    where: { id: data.id, userId: session.user.id },
  });

  if (!listToDelete) return new Response("List not found", { status: 404 });

  const deletedList = await prisma.list.delete({
    where: { id: data.id },
    select: { id: true, name: true },
  });

  return NextResponse.json(deletedList);
}
