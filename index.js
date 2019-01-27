const fetch = require('isomorphic-fetch')

class IsoRpc{
  constructor(provider = "http://localhost:8545", fetchOptions = {}){
    this.provider = provider
  }
  static get(obj,prop){
    if(prop in obj){
      return obj[prop]
    }else{
      return async(...params) => {
        let connection = await fetch(obj.provider, Object.assign({
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({
            method:prop,
            params:params,
            id:obj.id++
          })
        },obj.fetchOptions)).catch()

        let response = await connection.json()

        if (response.error) {
          throw new Error(response.error.message)
        }else{
          return response.result
        }
      }
    }
  }
}

module.exports = function Rpc(provider, fetchOptions){
  return new Proxy(new IsoRpc(provider, fetchOptions),IsoRpc)
}
