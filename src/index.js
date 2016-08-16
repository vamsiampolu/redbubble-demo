const mockData = require('../mock-data.json')
import handleWorksResponse from './api/index.js'
import getWorks from './api/connect'

function useResponse(data) {
  return handleWorksResponse(data)
}

const batchProcessor = (url:string,dest:string) => {
  getWorks(url)
    .then(useResponse)
    .catch(err => {
      console.error(err)
    })
}

batchProcessor('http://take-home-test.herokuapp.com/api/v1/works.xml')

