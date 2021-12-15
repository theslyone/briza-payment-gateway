# briza-collect

A VGS wrapper for Briza payment processing.

## Overview

This project provides an easy way to integrate Briza's payment processing without the need to worry about PCI compliance. Briza enforces a high level of data security by ensuring all sensitive payment information are redacted and securely proxied to third party payment processors.

## Demo

![briza-vgs](https://user-images.githubusercontent.com/15334332/146257386-75b38782-9bde-404e-8f63-b0070e1cfb9d.gif)

## Getting Started

#### Installing the dependency

- via NPM

```shell
$ npm i --save @briza/collect
```

- via CDN

```shell
$ <script src="..."></script>
```

## Usage

```js
let apiKeyOrToken = 'sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxx'
const environment = 'sandbox'

brizaCollect({
  apiKeyOrToken,
  environment,
  fields: {
    'card-name': '#cc-name',
    'card-number': '#cc-number',
    'card-expiration-date': '#cc-expiration-date',
    'card-security-code': '#cc-cvc',
  },
}).then(async (gateway) => {
  // wait for gateway ready state, consider using this to activate your submit button.
  await gateway.onReady()

  // post to make payment and bind a quote
  const result = await gateway.pay('quote-id', 'yearly')
})
```

## Available Methods

- onReady: Returns a promise that gets resolved as soon as the gateway is setup completely. This method can be used to enable the button that triggers your payment flow.
- pay(`quote-id`, `installment-frequency`)

The pay method makes a secure `POST` request proxied through our PCI compliant provider to `.../api/v2/policy`.

`quote-id`: id of the quote to collect and process payment for.

`installment-frequency` : can be either `yearly` or `monthly`.


### Keywords

[briza-api](https://briza-api.redoc.ly/), [bind](https://briza-api.redoc.ly/#operation/patchPolicyhttps://briza-api.redoc.ly/)
