"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.brizaPaymentGateway = void 0;
const collect_js_1 = require("@vgs/collect-js");
const vgsVersion = '2.11.0';
const defaultOptions = {
    environment: 'sandbox',
    style: {},
};
const defaultStyle = {
    background: '#FFFFFF',
    boxSizing: 'border-box',
    height: '3.375rem',
    fontSize: '1.25rem',
    lineHeight: '1.688rem',
    borderWidth: '1px',
    borderRadius: '4px',
    padding: '0px 16px',
    '&:focus': {
        border: '2px solid #222222',
        padding: '0 15px'
    },
    '&:hover': {
        border: '2px solid #222222',
        padding: '0 15px'
    },
    '&::placeholder': {
        color: '#454F5B'
    },
    border: '1px solid #222222'
};
const vaults = {
    test: 'tntnwaij64c',
    'sandbox': 'tntwdbsm7ec',
    'live': 'tntynnmpjnc'
};
async function brizaPaymentGateway(options = defaultOptions) {
    const { environment, fields, style: customStyle } = options;
    const collect = (await (0, collect_js_1.loadVGSCollect)({
        vaultId: vaults[environment],
        environment: environment === 'live' ? 'live' : 'sandbox',
        version: vgsVersion
    }));
    const styles = {
        // ...defaultStyle,
        ...customStyle
    };
    const vgsForm = collect.init();
    const fieldStates = [];
    if (fields && Object.keys(fields).length > 0) {
        const cardName = vgsForm.field(fields['card-name'], {
            type: 'text',
            name: 'cardName',
            placeholder: 'Credit Card Name',
            validations: ['required'],
            autoComplete: "cc-name",
            css: styles
        });
        fieldStates.push(cardName.promise);
        const cardNumber = vgsForm.field(fields['card-number'], {
            type: 'card-number',
            name: 'cardNumber',
            placeholder: 'Credit Card Number',
            validations: ['required', 'validCardNumber'],
            autoComplete: "cc-number",
            showCardIcon: {
                width: "35px",
                height: "22px",
            },
            css: styles
        });
        fieldStates.push(cardNumber.promise);
        const cardSecurityCode = vgsForm.field(fields['card-security-code'], {
            type: 'card-security-code',
            name: 'cardCvc',
            placeholder: 'CVC',
            validations: ['required', 'validCardSecurityCode'],
            autoComplete: "cc-csc",
            showCardIcon: {
                width: "35px",
                height: "22px",
            },
            css: styles
        });
        fieldStates.push(cardSecurityCode.promise);
        const cardExpirationDate = vgsForm.field(fields['card-expiration-date'], {
            type: 'card-expiration-date',
            name: 'cardExpirationDate',
            placeholder: 'MM/YY',
            validations: ['required', 'validCardExpirationDate'],
            autoComplete: "cc-exp",
            css: styles
        });
        fieldStates.push(cardExpirationDate.promise);
    }
    return {
        onReady: async () => Promise.all(fieldStates),
        submit: async () => {
            return new Promise((resolve, reject) => {
                vgsForm.submit('/api/v2/echo/payment-card', {}, (_, data) => resolve(data), reject);
            });
        }
    };
}
exports.brizaPaymentGateway = brizaPaymentGateway;
