import { fetchClient } from "@/lib/fetchClient";

/* GET Comments */
export async function getComments(params = {}) {
  const query = new URLSearchParams();

  if (params.post_id) query.append("post_id", params.post_id);
  if (params.user_id) query.append("user_id", params.user_id);
  if (params.limit !== undefined) query.append("limit", String(params.limit));
  if (params.offset !== undefined) query.append("offset", String(params.offset));
  if (params.count !== undefined) query.append("count", params.count ? "true" : "false");

  const path = "/comments" + (query.toString() ? `?${query.toString()}` : "");

  try {
    const data = await fetchClient({
      path,
      method: "GET",
      auth: false,
    });

    return data; 
  } catch (err) {
    if (err.status === 500)
      throw new Error("Errore interno del server");

    throw new Error(err.body?.error || "Errore di rete o risposta non valida");
  }
}

/* POST Comments */
export async function createComment(post_id, content) {
  if (!post_id || !content)
    throw new Error("post_id e contenuto sono obbligatori");

  try {
    const data = await fetchClient({
      path: "/comments",
      method: "POST",
      body: { post_id, content },
      auth: true,
    });

    return data;
  } catch (err) {
    if (err.status === 400)
      throw new Error("Dati mancanti o non validi");
    if (err.status === 401)
      throw new Error("Non autenticato");
    if (err.status === 404)
      throw new Error("Post non trovato");
    if (err.status === 500)
      throw new Error("Errore interno del server");

    throw new Error("Errore durante la creazione del commento");
  }
}

/* GET Comment by ID */
export async function getCommentById(id) {
  if (!id) throw new Error("ID commento richiesto");

  try {
    const data = await fetchClient({
      path: `/comments/${id}`,
      method: "GET",
      auth: false,
    });

    return data;

  } catch (err) {
    if (err.status === 404) throw new Error("Commento non trovato");
    if (err.status === 500) throw new Error("Errore interno del server");
    throw new Error("Errore di rete o risposta non valida");
  }
}

/* PATCH Comment */
export async function updateComment(id, updateData) {
  if (!id) throw new Error("ID commento richiesto");
  if (!updateData || typeof updateData !== "object")
    throw new Error("Dati aggiornamento mancanti o invalidi");

  try {
    const data = await fetchClient({
      path: `/comments/${id}`,
      method: "PATCH",
      body: updateData,
      auth: true,
    });

    return data;

  } catch (err) {
    if (err.status === 400)
      throw new Error("Nessun campo da aggiornare / payload non valido");
    if (err.status === 401) throw new Error("Non autenticato");
    if (err.status === 403) throw new Error("Proibito: non sei il proprietario");
    if (err.status === 404) throw new Error("Commento non trovato");
    if (err.status === 500) throw new Error("Errore interno del server");
    throw new Error("Errore di rete o risposta non valida");
  }
}

/* DELETE Comment */
export async function deleteComment(comment_id) {
  if (!comment_id) throw new Error("comment_id è obbligatorio");

  try {
    await fetchClient({
      path: `/comments/${comment_id}`,
      method: "DELETE",
      auth: true,
    });

    return true;
  } catch (err) {
    if (err.status === 401)
      throw new Error("Non autenticato");
    if (err.status === 403)
      throw new Error("Non puoi eliminare questo commento");
    if (err.status === 404)
      throw new Error("Commento non trovato");
    if (err.status === 500)
      throw new Error("Errore interno del server");

    throw new Error("Errore di rete o risposta non valida");
  }
}