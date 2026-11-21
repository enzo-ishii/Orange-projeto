import { createRemoteJWKSet, jwtVerify } from 'jose';

// Chaves públicas do Firebase Auth (Google Secure Token)
const JWKS = createRemoteJWKSet(
  new URL('https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com'),
);

/**
 * Confere o ID token que o app recebe do Firebase depois do login por SMS
 * e devolve o celular verificado (E.164). Projeto: FIREBASE_PROJECT_ID (ex.: orange-646fd).
 */
export async function verifyFirebasePhoneToken(idToken: string) {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  if (!projectId) throw new Error('FIREBASE_PROJECT_ID não configurado');
  const { payload } = await jwtVerify(idToken, JWKS, {
    issuer: `https://securetoken.google.com/${projectId}`,
    audience: projectId,
  });
  const phone = payload.phone_number;
  if (typeof phone !== 'string' || !payload.sub) throw new Error('token sem celular verificado');
  return { phone, firebaseUid: payload.sub };
}
