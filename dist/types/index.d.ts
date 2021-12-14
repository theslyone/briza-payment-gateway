declare type Environment = 'test' | 'sandbox' | 'live';
declare type VgsData = {
    cardCvc?: string;
    cardNumber?: string;
    cardExpirationDate?: string;
};
declare type CSSFieldSelector = {
    'card-name': string;
    'card-number': string;
    'card-expiration-date': string;
    'card-security-code': string;
};
declare type PaymentGatewayOptions = {
    environment: Environment;
    fields?: CSSFieldSelector;
    style?: Record<string, string>;
};
declare function brizaPaymentGateway(options?: PaymentGatewayOptions): Promise<{
    onReady: () => Promise<unknown[]>;
    submit: () => Promise<VgsData>;
}>;
export { brizaPaymentGateway };
