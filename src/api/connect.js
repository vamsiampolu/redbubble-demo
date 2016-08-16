// @flow

import 'babel-polyfill'
import fetch from 'isomorphic-fetch'
import parser from 'xml2json-light'
import co from 'co'

const corsBaseUrl = 'https://cors-anywhere.herokuapp.com/'

function getWorksReq (url) {
  const worksReq = function * () {
    const response = yield fetch(`${corsBaseUrl}${url}`)
    let xml
    if (response != null && response.ok) {
      xml = yield response.text()
    }

    const json = parser.xml2json(xml)
    console.log(json)
    return Promise.resolve(json)
  }
  return worksReq
}

function getWorks (url:string) {
  const ret = co(getWorksReq(url))
  return ret
}

export default getWorks
