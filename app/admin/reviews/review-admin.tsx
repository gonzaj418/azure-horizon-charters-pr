"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";

type Review = {
  id: number;
  guestName: string;
  tripDate: string;
  bookingContact: string;
  rating: number;
  comment: string;
  language: string;
  status: string;
  createdAt: string;
};

export default function ReviewAdmin({ ownerName }: { ownerName: string }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filter, setFilter] = useState("pending");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const loadReviews = useCallback(async () => {
    setLoading(true);
    const response = await fetch("/api/admin/reviews", { cache: "no-store" });
    const data = (await response.json()) as { reviews?: Review[]; error?: string };
    setReviews(data.reviews ?? []);
    setMessage(data.error ?? "");
    setLoading(false);
  }, []);

  useEffect(() => {
    let active = true;
    fetch("/api/admin/reviews", { cache: "no-store" })
      .then((response) => response.json())
      .then((data: { reviews?: Review[]; error?: string }) => {
        if (!active) return;
        setReviews(data.reviews ?? []);
        setMessage(data.error ?? "");
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const updateReview = async (review: Review, status: string) => {
    setMessage("Guardando...");
    const response = await fetch("/api/admin/reviews", {
      body: JSON.stringify({
        comment: review.comment,
        guestName: review.guestName,
        id: review.id,
        status,
      }),
      headers: { "content-type": "application/json" },
      method: "PATCH",
    });
    setMessage(response.ok ? "Cambio guardado." : "No se pudo guardar.");
    if (response.ok) await loadReviews();
  };

  const deleteReview = async (id: number) => {
    if (!window.confirm("¿Eliminar este comentario permanentemente?")) return;
    const response = await fetch(`/api/admin/reviews?id=${id}`, { method: "DELETE" });
    setMessage(response.ok ? "Comentario eliminado." : "No se pudo eliminar.");
    if (response.ok) await loadReviews();
  };

  const visible = reviews.filter((review) => filter === "all" || review.status === filter);

  return (
    <main className="review-admin-page">
      <header className="review-admin-header">
        <div>
          <p>AZURE HORIZON CHARTERS</p>
          <h1>Moderación de comentarios</h1>
          <span>Sesión de {ownerName}</span>
        </div>
        <Link href="/">Volver a la página</Link>
      </header>

      <nav className="review-admin-filters" aria-label="Filtrar comentarios">
        {["pending", "approved", "rejected", "all"].map((status) => (
          <button className={filter === status ? "active" : ""} key={status} onClick={() => setFilter(status)} type="button">
            {status === "pending" ? "Pendientes" : status === "approved" ? "Publicados" : status === "rejected" ? "Rechazados" : "Todos"}
          </button>
        ))}
      </nav>

      {message && <p className="review-admin-message">{message}</p>}
      {loading ? <p>Cargando comentarios...</p> : null}
      {!loading && visible.length === 0 ? <p>No hay comentarios en esta categoría.</p> : null}

      <div className="review-admin-list">
        {visible.map((review) => (
          <article key={review.id}>
            <div className="review-admin-meta">
              <strong>{review.rating}/5</strong>
              <span>{review.tripDate}</span>
              <span className={`status-${review.status}`}>{review.status}</span>
            </div>
            <label>
              Nombre público
              <input
                onChange={(event) => setReviews((items) => items.map((item) => item.id === review.id ? { ...item, guestName: event.target.value } : item))}
                value={review.guestName}
              />
            </label>
            <label>
              Comentario
              <textarea
                onChange={(event) => setReviews((items) => items.map((item) => item.id === review.id ? { ...item, comment: event.target.value } : item))}
                rows={4}
                value={review.comment}
              />
            </label>
            <p className="review-private-contact"><strong>Para verificar:</strong> {review.bookingContact}</p>
            <div className="review-admin-actions">
              <button onClick={() => updateReview(review, "approved")} type="button">Aprobar y publicar</button>
              <button className="secondary" onClick={() => updateReview(review, "rejected")} type="button">Rechazar</button>
              <button className="danger" onClick={() => deleteReview(review.id)} type="button">Eliminar</button>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
