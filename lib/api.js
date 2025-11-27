
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.twitter.server.jetop.com/api';



export async function apiFetch(path, options = {}) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    }
  });

  if (res.status === 204 || res.status === 205) {
    return {};
  }

  const data = await res.json();
  if (!res.ok) {
    const err = new Error(data.error || 'Errore API');
    err.status = res.status;
    throw err;
  }

  return data;
}


  export async function getPost(id) {
  const post = await apiFetch(`/posts/${id}`);
  return {
    id: post.id,
    content: post.content,
    createdAt: post.created_at,
    author: post.users ? { username: post.users.username } : undefined,
    user_id: post.user_id
  };
}


 export function createPost(postData, token) {
  return apiFetch('/posts', {
    method: 'POST',
    body: JSON.stringify({
      user_id: postData.user_id,
      content: postData.content
    }),
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}


export function authRegister(username, email, password) {
  return apiFetch('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ username, email, password }),
  });
}


export function authLogin(username, password) {
  return apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
}

