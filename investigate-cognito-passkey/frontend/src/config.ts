export const COGNITO_CLIENT_ID = import.meta.env.VITE_COGNITO_CLIENT_ID;
export const COGNITO_REDIRECT_URI = import.meta.env.VITE_COGNITO_REDIRECT_URI;
export const COGNITO_LOGOUT_URI = import.meta.env.VITE_COGNITO_LOGOUT_URI;
export const COGNITO_USER_POOL_ID = import.meta.env.VITE_COGNITO_USER_POOL_ID;
export const COGNITO_AUTHORITY = `https://cognito-idp.ap-northeast-1.amazonaws.com/${COGNITO_USER_POOL_ID}`;
export const COGNITO_DOMAIN = import.meta.env.VITE_COGNITO_DOMAIN;
