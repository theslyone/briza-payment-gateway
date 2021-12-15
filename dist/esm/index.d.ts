declare type Environment = 'test' | 'sandbox' | 'live';
declare type FieldName = 'card-name' | 'card-number' | 'card-security-code' | 'card-expiration-date';
declare type CSSFieldSelector<F extends FieldName = FieldName> = {
    [f in F]: string;
};
declare type CreditCard = {
    cvc: string;
    name: string;
    number: string;
    expiry: string;
    cardType: string;
};
export declare enum InstallmentFrequency {
    Monthly = "monthly",
    Yearly = "yearly"
}
declare type Payload = {
    quoteId: string;
    installmentFrequency: InstallmentFrequency;
    creditCard: CreditCard & {
        method: 'vgs';
    };
};
declare type CollectOptions = {
    environment: Environment;
    apiKeyOrToken: string;
    fields: CSSFieldSelector;
    css?: Record<string, string>;
};
declare type CollectResponse = {
    onReady: () => Promise<unknown>;
    reset: () => void;
    pay: (quoteId: string, installmentFrequency: InstallmentFrequency) => Promise<Payload>;
};
declare function brizaCollect(options: CollectOptions): Promise<CollectResponse>;
export { brizaCollect };
