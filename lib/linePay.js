const crypto = require('crypto-js')
const axios = require('axios')
const uuidv4 = require('uuid/v4')

class linePay {

  constructor (data) {
    this.channelId = data.channelId
    this.channelSecret = data.channelSecret
    this.URI = data.uri
  }

  // Method

  // Request API
  // Input:
  //  body (Objcet) ->  your order content
  //
  request (body) {
    return new Promise((reslove, reject) => {
      let api = '/v3/payments/request'
      let configs = {
        headers: this.__header('POST', api, body)
      }
      axios.post(this.URI + api, body, configs).then(response => {
        reslove(response.data)
      }).catch(error => {
        reject(error)
      })
    })
  }

  // Confirm API
  // Input:
  //  body (Objcet) -> { amount: [NUMBER], currency: [STRING] }
  //  transactionId (String) -> which one you get with ConfirmURL's query
  //
  confirm (body, transactionId) {
    return new Promise((reslove, reject) => {
      let api = `/v3/payments/${transactionId}/confirm`
      let configs = {
        headers: this.__header('POST', api, body)
      }
      axios.post(this.URI + api, body, configs).then(response => {
        reslove(response.data)
      }).catch(error => {
        reject(error)
      })
    })
  }

  // Capture API
  // Input:
  //  body (Objcet) -> { amount: [NUMBER], currency: [STRING] }
  //  transactionId (String) -> which one you get with ConfirmURL's query
  //
  capture (body, transactionId) {
    return new Promise((reslove, reject) => {
      let api = `/v3/payments/authorizations/${transactionId}/capture`
      let configs = {
        headers: this.__header('POST', api, body)
      }
      axios.post(this.URI + api, body, configs).then(response => {
        reslove(response.data)
      }).catch(error => {
        reject(error)
      })
    })
  }

  // Void API
  // Input:
  //  transactionId (String) -> which one you get with ConfirmURL's query
  //
  void (transactionId) {
    return new Promise((reslove, reject) => {
      let api = `/v3/payments/authorizations/${transactionId}/void`
      let configs = {
        headers: this.__header('POST', api, {})
      }
      axios.post(this.URI + api, {}, configs).then(response => {
        reslove(response.data)
      }).catch(error => {
        reject(error)
      })
    })
  }

  // Refund API
  // Input:
  //  body (Object) -> { refundAmount: [NUMBER] }
  //  transactionId (String) -> which one you get with ConfirmURL's query
  //
  refund (body, transactionId) {
    return new Promise((reslove, reject) => {
      let api = `/v3/payments/${transactionId}/refund`
      let configs = {
        headers: this.__header('POST', api, body)
      }
      axios.post(this.URI + api, body, configs).then(response => {
        reslove(response.data)
      }).catch(error => {
        reject(error)
      })
    })
  }

  // Payment Details API
  // Input:
  //  params (Object) -> { transactionId: [STRING], orderId: [STRING], fields: [STRING] } all params are optional
  //
  paymentDetails (params) {
    return new Promise((reslove, reject) => {
      let api = `/v3/payments`
      let configs = {
        params: params,
        headers: this.__header('GET', api, this.__json2url(params))
      }
      axios.get(this.URI + api, configs).then(response => {
        reslove(response.data)
      }).catch(error => {
        reject(error)
      })
    })
  }

  // Check Payment Status API
  // Input:
  //  transactionId (String)
  //
  checkPaymentStatus (transactionId) {
    return new Promise((reslove, reject) => {
      let api = `/v3/payments/requests/${transactionId}/check`
      let configs = {
        headers: this.__header('GET', api, '')
      }
      axios.get(this.URI + api, configs).then(response => {
        reslove(response.data)
      }).catch(error => {
        reject(error)
      })
    })
  }

  // Check RegKey API
  // Input:
  //  params (Object) -> { creditCardAuth: [BOOBLEAN] }
  //  regKey (String)
  //
  checkRegKey (params, regKey) {
    return new Promise((reslove, reject) => {
      let api = `/v3/payments/preapprovedPay/${regKey}/check`
      let configs = {
        params: params,
        headers: this.__header('GET', api, this.__json2url(params))
      }
      axios.get(this.URI + api, configs).then(response => {
        reslove(response.data)
      }).catch(error => {
        reject(error)
      })
    })
  }

  // Pay Preapproved API
  // Input:
  //  body (Object) -> { productName: [STRING], amount: [NUMBER], currency: [STRING], orderID: [STRING], capture: [BOOLEAN] }
  //  regKey (String)
  //
  preapprovedPay (body, regKey) {
    return new Promise((reslove, reject) => {
      let api = `/v3/payments/preapprovedPay/${regKey}/payment`
      let configs = {
        headers: this.__header('POST', api, body)
      }
      axios.post(this.URI + api, body, configs).then(response => {
        reslove(response.data)
      }).catch(error => {
        reject(error)
      })
    })
  }

  // Expire RegKey API
  // Input:
  //  regKey (String)
  //
  expireRegKey (regKey) {
    return new Promise((reslove, reject) => {
      let api = `/v3/payments/preapprovedPay/${regKey}/expire`
      let configs = {
        headers: this.__header('POST', api, {})
      }
      axios.post(this.URI + api, {}, configs).then(response => {
        reslove(response.data)
      }).catch(error => {
        reject(error)
      })
    })
  }

  // private method
  __json2url (json) {
    let url = Object.keys(json).map( idx => {
      return encodeURIComponent(idx) + '=' + encodeURIComponent(json[idx])
    }).join('&')
    return url
  }

  __header (method, uri, body) {
    let nonce = uuidv4()
    return {
      'Content-Type': 'application/json',
      'X-LINE-ChannelId': this.channelId,
      'X-LINE-Authorization-Nonce': nonce,
      'X-LINE-Authorization': this.__hash(method, uri, body, nonce)
    }
  }

  __hash (method, uri, body, nonce) {
    let encrypt = null
    if (method === 'GET') {
      encrypt = crypto.HmacSHA256(this.channelSecret + uri + body + nonce, this.channelSecret)
    }
    if (method === 'POST') {
      encrypt = crypto.HmacSHA256(this.channelSecret + uri + JSON.stringify(body) + nonce, this.channelSecret)
    }
    return crypto.enc.Base64.stringify(encrypt)
  }
}

module.exports = linePay