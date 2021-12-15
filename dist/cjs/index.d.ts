declare type Environment = 'test' | 'sandbox' | 'live';
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
    payment: CreditCard & {
        method: 'vgs';
    };
};
declare type FieldName = 'card-name' | 'card-number' | 'card-security-code' | 'card-expiration-date';
declare type CSSFieldSelector<F extends FieldName = FieldName> = {
    [f in F]: string;
};
declare type GatewayOptions = {
    environment: Environment;
    token: string;
    fields: CSSFieldSelector;
    css?: Record<string, string>;
};
declare function brizaPaymentGateway(options: GatewayOptions): Promise<{
    onReady: () => Promise<unknown[]>;
    reset: () => void;
    pay: (quoteId: string, installmentFrequency: InstallmentFrequency) => Promise<Payload>;
}>;
export { brizaPaymentGateway };
