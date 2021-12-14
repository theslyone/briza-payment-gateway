import { loadVGSCollect } from '@vgs/collect-js';

const vgsVersion = '2.11.0'


type Environment = 'test' | 'sandbox' | 'live'

type VgsData = {
  cardCvc?: string,
  cardNumber?: string,
  cardExpirationDate?: string
}

type VGSCollect = {
  init: (callback?: (state: unknown) => void) => VgsForm
}

type CSSFieldSelector = {
  'card-name': string
  'card-number': string
  'card-expiration-date': string
  'card-security-code': string
}

type SuccessCallback = (status: number, data: VgsData) => void
type ErrorCallback = (errors: Record<string, unknown>) => void

type VgsForm = {
  field: (selector: string, props: Record<string, unknown>) => { promise: Promise<unknown> }
  submit: (path: string, options: unknown, successCallback: SuccessCallback, errorCallback: ErrorCallback) => Promise<VgsForm>
}

type PaymentGatewayOptions = {
  environment: Environment
  fields?: CSSFieldSelector
  style?: Record<string, string>
}

const defaultOptions: PaymentGatewayOptions = {
  environment: 'sandbox',
  style: {},
}

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
}

const vaults: Record<Environment, string> = {
  test: 'tntnwaij64c',
  'sandbox': 'tntwdbsm7ec',
  'live': 'tntynnmpjnc'
}

async function brizaPaymentGateway(options: PaymentGatewayOptions = defaultOptions) {
  const { environment, fields, style: customStyle } = options
  const collect = (await loadVGSCollect({
    vaultId: vaults[environment],
    environment: environment === 'live' ? 'live' : 'sandbox',
    version: vgsVersion
  })) as VGSCollect

  const styles = {
    // ...defaultStyle,
    ...customStyle
  }

  const vgsForm = collect.init()

  const fieldStates: Promise<unknown>[] = []

  if (fields && Object.keys(fields).length > 0) {
    const cardName = vgsForm.field(fields['card-name'], {
      type: 'text',
      name: 'cardName',
      placeholder: 'Credit Card Name',
      validations: ['required'],
      autoComplete: "cc-name",
      css: styles
    })
    fieldStates.push(cardName.promise)

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
    })
    fieldStates.push(cardNumber.promise)

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
    })
    fieldStates.push(cardSecurityCode.promise)

    const cardExpirationDate = vgsForm.field(fields['card-expiration-date'], {
      type: 'card-expiration-date',
      name: 'cardExpirationDate',
      placeholder: 'MM/YY',
      validations: ['required', 'validCardExpirationDate'],
      autoComplete: "cc-exp",
      css: styles
    })
    fieldStates.push(cardExpirationDate.promise)
  }

  return {
    onReady: async () => Promise.all(fieldStates),
    submit: async () => {
      return new Promise<VgsData>((resolve, reject) => {
        vgsForm.submit(
          '/api/v2/echo/payment-card',
          {},
          (_, data) => resolve(data),
          reject
        )
      })
    }
  }
}

export { brizaPaymentGateway }