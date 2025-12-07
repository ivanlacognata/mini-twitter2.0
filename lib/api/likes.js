import { fetchClient } from "@/lib/fetchClient";

/* GET Likes */
export async function getLikes(params = {}) {
  const query = new URLSearchParams();

  if (params.post_id) query.append("post_id", params.post_id);
  if (params.user_id) query.append("user_id", params.user_id);
  if (params.count !== undefined)
    query.append("count", params.count ? "true" : "false");

  const path = "/likes" + (query.toString() ? `?${query.toString()}` : "");

  try {
    const data = await fetchClient({
      path,
      method: "GET",
      auth: true,
    });

    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

/* CREA UN LIKE */
export async function createLike(post_id) {
  if (!post_id) {
    throw new Error("post_id è obbligatorio");
  }

  try {
    const data = await fetchClient({
      path: "/likes",
      method: "POST",
      body: { post_id },
      auth: true,
    });

    return data;

  } catch (err) {
    if (err.status === 400)
      throw new Error("post_id mancante o non valido");

    if (err.status === 401)
      throw new Error("Non autenticato");

    if (err.status === 500)
      throw new Error("Errore interno del server");

    throw new Error("Errore di rete o risposta non valida");
  }
}



/* RIMUOVE UN LIKE */
export async function deleteLike(post_id) {
  if (!post_id) {
    throw new Error("post_id è obbligatorio");
  }

  try {
    await fetchClient({
      path: "/likes",
      method: "DELETE",
      body: { post_id },
      auth: true,
    });

    return true;

  } catch (err) {
    if (err.status === 400)
      throw new Error("post_id mancante o non valido");

    if (err.status === 401)
      throw new Error("Non autenticato");

    if (err.status === 500)
      throw new Error("Errore interno del server");

    throw new Error("Errore di rete o risposta non valida");
  }
}
