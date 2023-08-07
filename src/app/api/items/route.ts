import type { Item } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { type NextRequest, NextResponse } from "next/server";
import { authOptions } from "pages/api/auth/[...nextauth]";
import { prisma } from "server/db";
import { getItems } from "utils/get";

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response("Not logged in", { status: 401 });
  }

  const { searchParams } = new URL(request.url);

  const listId = searchParams.get("listId") as string;

  if (!listId) {
    return new Response("No list id provided", { status: 400 });
  }

  const list = await prisma.list.findUnique({ where: { id: listId, userId: session.user.id } });

  if (!list) return new Response("List not found", { status: 404 });

  const items = await getItems(listId);

  const sortedItems = items.sort((a: Item, b: Item) =>
    String(a.createdAt).localeCompare(String(b.createdAt)),
  );

  return NextResponse.json(sortedItems);
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response("Not logged in", { status: 401 });
  }

  const data = (await request.json()) as { title: string; listId: string };

  if (!data.listId) {
    return new Response("No list id provided", { status: 400 });
  }

  const list = await prisma.list.findUnique({
    where: { id: data.listId, userId: session.user.id },
  });

  if (!list) return new Response("List not found", { status: 404 });

  const time = new Date();

  const newItem = await prisma.item.create({
    data: {
      title: data.title,
      listId: data.listId,
      createdAt: time,
      updatedAt: time,
    },
    select: { id: true, title: true },
  });

  return NextResponse.json(newItem);
}

export async function PATCH(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response("Not logged in", { status: 401 });
  }

  const data = (await request.json()) as {
    title?: string;
    isChecked?: boolean;
    id: string;
  };

  const item = await prisma.item.findUnique({ where: { id: data.id } });

  if (!item) return new Response("No item found", { status: 404 });

  const list = await prisma.list.findUnique({
    where: { id: item.listId, userId: session.user.id },
  });

  if (!list) return new Response("List not found", { status: 404 });

  const updatedItem = await prisma.item.update({
    data: {
      ...(data.title ? { title: data.title } : {}),
      ...(data.isChecked != null ? { isChecked: data.isChecked } : {}),
      updatedAt: new Date(),
    },
    where: { id: data.id },
    select: { id: true, title: true, isChecked: true },
  });

  return NextResponse.json(updatedItem);
}

export async function DELETE(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response("Not logged in", { status: 401 });
  }

  const data = (await request.json()) as { id: string };

  const item = await prisma.item.findUnique({ where: { id: data.id } });

  if (!item) return new Response("No item found", { status: 404 });

  const list = await prisma.list.findUnique({
    where: { id: item.listId, userId: session.user.id },
  });

  if (!list) return new Response("List not found", { status: 404 });

  const deletedItem = await prisma.item.delete({
    where: { id: data.id },
    select: { id: true, title: true },
  });

  return NextResponse.json(deletedItem);
}
