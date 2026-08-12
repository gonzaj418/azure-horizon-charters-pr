import { requireChatGPTUser } from "../../chatgpt-auth";
import ReviewAdmin from "./review-admin";

export const dynamic = "force-dynamic";

const OWNER_EMAIL = process.env.REVIEW_ADMIN_EMAIL ?? "";

export default async function ReviewsAdminPage() {
  const user = await requireChatGPTUser("/admin/reviews");

  if (user.email.toLowerCase() !== OWNER_EMAIL) {
    return (
      <main style={{ margin: "4rem auto", maxWidth: 720, padding: "1.5rem" }}>
        <h1>Acceso privado</h1>
        <p>Esta cuenta no tiene permiso para moderar los comentarios.</p>
      </main>
    );
  }

  return <ReviewAdmin ownerName={user.displayName} />;
}
