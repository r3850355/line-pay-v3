# line-pay-v3
SDK for LINE Pay API `v3`


# Installation

```
npm install --save line-pay-v3
```

# Usage

example config for Sandbox environment

set uri to `https://api-pay.line.me` for Production

``` javascript
const LinePay = require('line-pay-v3')

let linePay = new LinePay({
  channelId: YOUR_CHANNEL_ID,
  channelSecret: YOUR_CHANNEL_SECRET,
  uri: 'https://sandbox-api-pay.line.me'
})

```

# API

#### linePay.request(body)

An API to request payment information to LINE Pay


- body (Object) : order info just checkout [API Document](https://pay.line.me/tw/developers/apis/onlineApis?locale=en_US)

#### linePay.confrim(body, transactionId)
- body (Objcet) : { amount: [NUMBER], currency: [STRING] }
- transactionId (String) 

#### linePay.capture(body, transactionId)
- body (Objcet) : { amount: [NUMBER], currency: [STRING] }
- transactionId (String) 

#### linePay.void(transactionId)
- transactionId (String)

#### linePay.refund(body, transactionId)
- body (Object) : { refundAmount: [NUMBER] }
- transactionId (String)

#### linePay.paymentDetails(params)
all params are optional

- params (Object) : { transactionId: [STRING], orderId: [STRING], fields: [STRING] } 

#### linePay.checkPaymentStatus(transactionId)
- transactionId (String)

#### linePay.checkRegKey(params, regKey)
- params (Object) : { creditCardAuth: [BOOBLEAN] }
- regKey (String)

#### linePay.checkRegKey(params, regKey)
- params (Object) : { creditCardAuth: [BOOBLEAN] }
- regKey (String)

#### linePay.preapprovedPay(body, regKey)
- body (Object) -> { productName: [STRING], amount: [NUMBER], currency: [STRING], orderID: [STRING], capture: [BOOLEAN] }
- regKey (String)

#### linePay.expireRegKey(regKey)
- regKey (String)

# Example
A request API example

``` javascript
const order = {
  amount: 4000,
  currency: 'TWD',
  orderId: 'Order2019101500001',
  packages: [
    {
      id: 'Item20191015001',
      amount: 4000,
      name: 'testPackageName',
      products: [
        {
          name: 'testProductName',
          quantity: 2,
          price: 2000
        }
      ]
    }
  ],
  redirectUrls: {
    confirmUrl: 'https://example.com/confirmUrl',
    cancelUrl: 'https://example.com/cancelUrl'
  }
}


linePay.request(order).then(res => {
  console.log(res)
})

// response JSON
{
  returnCode: '0000',
  returnMessage: 'Success.',
  info: {
    paymentUrl: {
      web: 'https://sandbox-web-pay.line.me/web/payment/wait?transactionReserveId=WDk1N2x2ankzck9JUEJDS3NETmwzV05Zckw0bHE4R25PSWZ5N0xDR25RaRLdE5YMU1yUlpxqQU8wGF4V2llUQx',
      app: 'line://pay/payment/WDk1N2x2ankzck9JUEJDS3NETmwzV05Zck0bHE4R25PSWZ5N0xDR25RnRLdE5YMU1xyUlpqQU8waGF4Vx2llUQ'
    },
    transactionId: 2019101500070266000,
    paymentAccessToken: '040316708383'
  }
}

```

# API Documentation

[LINE Pay OnliceAPI](https://pay.line.me/tw/developers/apis/onlineApis?locale=en_US)