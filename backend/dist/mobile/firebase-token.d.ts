export declare function verifyFirebasePhoneToken(idToken: string): Promise<{
    phone: string;
    firebaseUid: string;
}>;
