import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const BASE_URL = 'https://api-contatos-auth-04-09-25.onrender.com';
const TOKEN_KEY = 'token';

export const api = axios.create({ baseURL: BASE_URL });

export async function setAuthToken(token: string) {
  await SecureStore.setItemAsync(TOKEN_KEY, token, {
    keychainAccessible: SecureStore.AFTER_FIRST_UNLOCK
  });
  api.defaults.headers.common.Authorization = `Bearer ${token}`;
}

export async function loadAuthToken() {
  const token = await SecureStore.getItemAsync(TOKEN_KEY);
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  }
  return token;
}

export async function clearAuthToken() {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
  delete api.defaults.headers.common.Authorization;
}

export function getImageUrl(fileId?: string) {
  return fileId ? `${BASE_URL}/upload/${fileId}` : undefined;
}