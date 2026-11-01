import { getAuth } from "firebase/auth";

/** Sends Firebase credentials when available and always includes the session cookie. */
export async function authenticatedFetch(
  input: RequestInfo | URL,
  init: RequestInit = {},
): Promise<Response> {
  const headers = new Headers(init.headers);
  const firebaseUser = getAuth().currentUser;
  if (firebaseUser) {
    const token = await firebaseUser.getIdToken();
    headers.set("Authorization", `Bearer ${token}`);
  }

  return fetch(input, {
    ...init,
    headers,
    credentials: init.credentials ?? "include",
  });
}
