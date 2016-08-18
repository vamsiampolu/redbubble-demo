// @flow
import 'babel-polyfill'
import handleWorksResponse from './api/index.js'
import getWorks from './api/connect'
import getStaticSiteGenerator from './file'
import initializeCommander from './cli'
import co from 'co'
import { handleUncaughtExceptions, handleUnhandledRejection } from './error-handling'
import { info, error, progress } from './colors'

handleUncaughtExceptions()
handleUnhandledRejection()

function useResponse (data) {
  return handleWorksResponse(data)
}

const defaultValues = {
  url: 'http://take-home-test.herokuapp.com/api/v1/works.xml',
  size: 'medium',
  outputDir: './www'
}

const program = initializeCommander(defaultValues)

console.log(info(`

  Welcome to the redbubble static generator

  Author: Vamsi Deepak Ampolu

  StackOverflow: http://stackoverflow.com/users/2309862/vamsiampolu

  Blog: https://medium.com/@deeepakampolu

  This is based on  http://take-home-test.herokuapp.com/full-stack-engineer

`))

function * handleBatchProcessing () {
  const {url, outputDir} = program
  try {
    console.log(`Fetching works from ${url}`)
    const rawInput = yield getWorks(url)
    if (rawInput != null) {
      const input = yield useResponse(rawInput)
      if (input != null) {
        const appStatus = yield getStaticSiteGenerator(program, outputDir, input)
        return appStatus
      }
    }
  } catch (e) {
    let code
    if (e.code) {
      code = e.code
    }
    const printCode = `CODE: ${code}`
    console.error(error(`Failed with error
      ${code ? printCode : ''}
      MESSAGE: ${e.message}
      😥 Aborting process. Bye

      x------THE END --------x
    `))
    process.exit(1)
  }
}

const batchProcessor = () => {
  return co(handleBatchProcessing)
}

batchProcessor()
