// @flow

// import 'babel-polyfill'
import fetch from 'isomorphic-fetch'
import parser from 'xml2json-light'
import co from 'co'

const corsBaseUrl = 'https://cors-anywhere.herokuapp.com/'

function getWorksReq (url) {
  const worksReq = function * () {
    const response = yield fetch(`${corsBaseUrl}${url}`,{
      headers:{
        'X-Requested-With':'co-fetch-commander'
      }
    })
    if (response != null && response.ok) {
      let xml = yield response.text()
      const json = parser.xml2json(xml)
      return json
    } else {
      throw new Error(`could not fetch xml from ${url}`)
    }
  }
  return worksReq
}

function getWorks (url:string):Promise<Object> {
  const ret = co(getWorksReq(url))
  return ret
}

export default getWorks
