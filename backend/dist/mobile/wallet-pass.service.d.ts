export declare class WalletPassService {
    get configured(): boolean;
    build(customer: {
        passSerial: string;
        cardNfcId: string;
        name: string | null;
        foundersNumber: number | null;
    }, balanceCents: number): Promise<Buffer<ArrayBufferLike>>;
}
