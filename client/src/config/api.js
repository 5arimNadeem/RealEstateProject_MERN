// Central place for API endpoint paths and URL building.
//
// In development Vite proxies "/api" to the backend (see vite.config.js), and
// in production the API is served from the same origin as the frontend, so a
// relative path works in both cases. An optional VITE_API_BASE_URL env var can
// override this (e.g. to point at a separately-hosted backend).
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export const buildApiUrl = (path) => `${API_BASE_URL}${path}`;

export const API_ENDPOINTS = {
  // Listings
  GET_LISTING: '/api/listing/get',
  CREATE_LISTING: '/api/listing/create',

  // Auth
  SIGN_IN: '/api/auth/signin',
  SIGN_UP: '/api/auth/signup',
  GOOGLE: '/api/auth/google',
  SIGN_OUT: '/api/auth/signout',

  // User
  UPDATE_USER: '/api/user/update',
  DELETE_USER: '/api/user/delete',

  // Uploads
  UPLOAD_SIGNATURE: '/api/upload/signature',
};
