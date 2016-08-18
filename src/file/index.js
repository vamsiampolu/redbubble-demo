//@flow
import co from 'co'
import { stat,mkdir } from 'fs-promise'
import trash from 'trash'
import generateApp, {createRootDirectory} from './app'
import type {CliOptions,ProcessedInput} from '../types'
import prompt from 'co-prompt'
import open from 'open'
import {error,progress} from '../colors'

const ENOENT = 'ENOENT'

export const cleanDirectory = (path:string) => {
  const glob = `${path}/**`
  return trash(glob)
}

const isENOENT = (e):boolean => e.code === ENOENT

export default function getStaticSiteGenerator(cliOptions:CliOptions,path:string,input:ProcessedInput):Promise<any> {
  function * staticSiteGenerator() {
    try {
      let removalStatus
      const statObj = yield stat(path)
      if(statObj != null && statObj.isDirectory != null && typeof statObj.isDirectory === 'function') {
        const shouldRemove = yield prompt.confirm(progress(`The directory ${path} is not empty. Would you like to remove it's contents?`))
        if(statObj.isDirectory() && shouldRemove) {
          removalStatus = yield cleanDirectory(path)
        }
        else if(shouldRemove) {
          removalStatus = yield trash(path)
        } else {
          console.log(error(`
           😥 Aborting process. Bye

           x------THE END --------x
          `))
          process.exit(0)
        }
      }
    } catch(e) {
      if(isENOENT(e)) {
        const shouldCreateDir = yield prompt.confirm(progress(`The directory ${path} does not exist. Would you like to create it now?`))
        if(shouldCreateDir) {
          console.log(progress(`Creating root directory`))
          const dirCreateStatus = yield createRootDirectory(path)
        } else {
          console.log(error(`
           😥 Aborting process. Bye

           x------THE END --------x
          `))
          process.exit(0)
        }
      }
    } finally {
      const createAppStatus = yield generateApp(cliOptions,input)
      console.log(progress(`
Opening in browser...

      x------THE END --------x

      `))
      open(`${path}/index.html`)
      process.exit(0)
    }
  }
  return co(staticSiteGenerator)
}
