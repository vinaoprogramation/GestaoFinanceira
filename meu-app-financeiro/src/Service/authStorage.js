const TOKEN_KEY = 'auth_token';

export async function storeToken(token) {

  localStorage.setItem(TOKEN_KEY, token);
  return true;

}

export async function getToken() {

  return localStorage.getItem(TOKEN_KEY);

}

export async function removeToken() {

  localStorage.removeItem(TOKEN_KEY);


}