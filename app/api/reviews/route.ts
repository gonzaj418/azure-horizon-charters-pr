import { desc, eq } from "drizzle-orm";
import { getDb } from "../../../db";
import { reviews } from "../../../db/schema";

const MAX_COMMENT_LENGTH = 900;

function clean(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function publicName(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length < 2) return parts[0] || "Guest";
  return `${parts[0]} ${parts.at(-1)?.charAt(0).toUpperCase()}.`;
}

export async function GET() {
  try {
    const db = getDb();
    const rows = await db
      .select({
        id: reviews.id,
        guestName: reviews.guestName,
        rating: reviews.rating,
        comment: reviews.comment,
        language: reviews.language,
      })
      .from(reviews)
      .where(eq(reviews.status, "approved"))
      .orderBy(desc(reviews.updatedAt), desc(reviews.id))
      .limit(30);

    return Response.json({
      reviews: rows.map((review) => ({
        ...review,
        guestName: publicName(review.guestName),
      })),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to load reviews";
    return Response.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as Record<string, unknown>;
    const guestName = clean(payload.guestName, 80);
    const tripDate = clean(payload.tripDate, 10);
    const bookingContact = clean(payload.bookingContact, 140);
    const comment = clean(payload.comment, MAX_COMMENT_LENGTH);
    const language = payload.language === "en" ? "en" : "es";
    const rating = Number(payload.rating);
    const consentToPublish = payload.consentToPublish === true;
    const website = clean(payload.website, 200);

    if (website) return Response.json({ received: true }, { status: 201 });
    if (!guestName || !tripDate || !bookingContact || comment.length < 12) {
      return Response.json({ error: "Complete all required fields." }, { status: 400 });
    }
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return Response.json({ error: "Choose a rating from 1 to 5." }, { status: 400 });
    }
    if (!consentToPublish) {
      return Response.json({ error: "Publication consent is required." }, { status: 400 });
    }

    const parsedDate = new Date(`${tripDate}T12:00:00Z`);
    if (Number.isNaN(parsedDate.getTime()) || parsedDate.getTime() > Date.now() + 86400000) {
      return Response.json({ error: "Enter a valid past trip date." }, { status: 400 });
    }

    const now = new Date().toISOString();
    const db = getDb();
    await db.insert(reviews).values({
      bookingContact,
      comment,
      consentToPublish,
      createdAt: now,
      guestName,
      language,
      rating,
      status: "pending",
      tripDate,
      updatedAt: now,
    });

    return Response.json({ received: true }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to submit review";
    return Response.json({ error: message }, { status: 500 });
  }
}
