import * as validations from './validation'
import program from 'commander'
import path from 'path'

export default function initializeCommander (defaults) {
  console.log('inside initialize commander')
  program
    .version('0.0.1')
    .usage('redbubble-demo')
    .option('-u, --url <url>', 'provide a url', validations.isValidUrl, defaults.url)
    .option('-o, --output-dir <pathStr>', 'provide directory to save to', validations.hasValidParentDirectory, path.resolve(defaults.outputDir))
    .option('-s, --size <size>', 'provide default size, argument not on use', validations.isValidSize, defaults.size)
    .parse(process.argv)
  return program
}
