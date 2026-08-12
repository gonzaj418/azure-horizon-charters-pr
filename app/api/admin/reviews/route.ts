import { desc, eq } from "drizzle-orm";
import { getChatGPTUser } from "../../../chatgpt-auth";
import { getDb } from "../../../../db";
import { reviews } from "../../../../db/schema";

const OWNER_EMAIL = process.env.REVIEW_ADMIN_EMAIL ?? "";

async function requireOwner() {
  const user = await getChatGPTUser();
  return user?.email.toLowerCase() === OWNER_EMAIL;
}

export async function GET() {
  if (!(await requireOwner())) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rows = await getDb()
    .select()
    .from(reviews)
    .orderBy(desc(reviews.createdAt), desc(reviews.id))
    .limit(200);
  return Response.json({ reviews: rows });
}

export async function PATCH(request: Request) {
  if (!(await requireOwner())) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = (await request.json()) as {
    id?: number;
    status?: string;
    comment?: string;
    guestName?: string;
  };
  const id = Number(payload.id);
  const status = payload.status;

  if (!Number.isInteger(id) || !["pending", "approved", "rejected"].includes(status ?? "")) {
    return Response.json({ error: "Invalid review update" }, { status: 400 });
  }

  const comment = payload.comment?.trim().slice(0, 900);
  const guestName = payload.guestName?.trim().slice(0, 80);
  await getDb()
    .update(reviews)
    .set({
      ...(comment ? { comment } : {}),
      ...(guestName ? { guestName } : {}),
      status,
      updatedAt: new Date().toISOString(),
    })
    .where(eq(reviews.id, id));

  return Response.json({ updated: true });
}

export async function DELETE(request: Request) {
  if (!(await requireOwner())) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const id = Number(url.searchParams.get("id"));
  if (!Number.isInteger(id)) {
    return Response.json({ error: "Invalid review id" }, { status: 400 });
  }

  await getDb().delete(reviews).where(eq(reviews.id, id));
  return Response.json({ deleted: true });
}
