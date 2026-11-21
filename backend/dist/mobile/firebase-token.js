import { createRemoteJWKSet, jwtVerify } from 'jose';
const JWKS = createRemoteJWKSet(new URL('https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com'));
export async function verifyFirebasePhoneToken(idToken) {
    const projectId = process.env.FIREBASE_PROJECT_ID;
    if (!projectId)
        throw new Error('FIREBASE_PROJECT_ID não configurado');
    const { payload } = await jwtVerify(idToken, JWKS, {
        issuer: `https://securetoken.google.com/${projectId}`,
        audience: projectId,
    });
    const phone = payload.phone_number;
    if (typeof phone !== 'string' || !payload.sub)
        throw new Error('token sem celular verificado');
    return { phone, firebaseUid: payload.sub };
}
//# sourceMappingURL=firebase-token.js.map