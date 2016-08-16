import * as validations from './validations'
import program from 'commander'
import path from 'path'

export function initializeCommander (defaults) {
  program
    .version('0.0.1')
    .usage('redbubble-demo')
    .option('-u', '--url [url]', validations.isValidUrl, defaults.url)
    .option('-o', '--output-dir [path]', validations.hasValidParentDirectory, path.resolve(defaults.path))
    .option('-s', '--size [size]', validations.isValidSize, defaults.size)
  return program
}
