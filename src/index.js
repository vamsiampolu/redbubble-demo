// @flow
import 'babel-polyfill'
import handleWorksResponse from './api/index.js'
import getWorks from './api/connect'
import getStaticSiteGenerator from './file'
import initializeCommander from './cli'
import co from 'co'

function useResponse (data) {
  return handleWorksResponse(data)
}

const defaultValues = {
  url: 'http://take-home-test.herokuapp.com/api/v1/works.xml',
  size: 'medium',
  outputDir: './www'
}

const program = initializeCommander(defaultValues)

function * handleBatchProcessing () {
  const {url, outputDir} = program
  try {
    const rawInput = yield getWorks(url)
    if (rawInput != null) {
      const input = yield useResponse(rawInput)
      if (input != null) {
        const appStatus = yield getStaticSiteGenerator(program, outputDir, input)
        return appStatus
      }
    }
  } catch (e) {
    console.error(e)
  }
}

const batchProcessor = () => {
  return co(handleBatchProcessing)
}

batchProcessor()
