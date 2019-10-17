const LinePay = require('../lib/linePay')
const uuidv4 = require('uuid/v4')
const expect = require('chai').expect

let linePay = new LinePay({
  channelId: 1613614792,
  channelSecret: 'bf3f9cbd014aa87a049f1b49699fca0d',
  uri: 'https://sandbox-api-pay.line.me'
})

let order = {
  amount: 4000,
  currency: 'TWD',
  orderId: 'order' + uuidv4(),
  packages: [
    {
      id: '20191011I001',
      amount: 4000,
      name: 'testName',
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

describe('API TESTING', function () {
  it('Request API', function () {
    return linePay.request(order).then(res => {
      expect(res.returnCode).to.be.equal('0000')
    })
  })
  it('paymentDetails API', function () {
    return linePay.paymentDetails({ transactionId: '2019101500070248810'}).then(res => {
      expect(res.returnCode).to.be.equal('0000')
    })
  })
})