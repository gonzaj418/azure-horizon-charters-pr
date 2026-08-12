import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const reviews = sqliteTable("reviews", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  guestName: text("guest_name").notNull(),
  tripDate: text("trip_date").notNull(),
  bookingContact: text("booking_contact").notNull(),
  rating: integer("rating").notNull(),
  comment: text("comment").notNull(),
  language: text("language").notNull().default("es"),
  consentToPublish: integer("consent_to_publish", { mode: "boolean" }).notNull().default(false),
  status: text("status").notNull().default("pending"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});
