//@flow
import type {ByMake,ProcessedInput,CliOptions} from '../types'
import map from 'lodash/fp/map'
import {buildHomePage} from './home'
import getGenerateMakeOutput from './make'
import path from 'path'
import {mkdirp} from 'fs-promise'
import co from 'co'

export const generateMakes = (dirPath:string,{byMake,allMakes} : {byMake:ByMake,allMakes:Array<string>}):Promise<any>  => {
  const generateMakeOutput = getGenerateMakeOutput(dirPath,byMake)
  const promiseByMake:Array<Promise<any>> = map(generateMakeOutput,allMakes)
  return Promise.all(promiseByMake)
}

export const createRootDirectory = (dirPath:string):Promise<any> => mkdirp(dirPath)

function generateApp(options:CliOptions,input:ProcessedInput):Promise<any> {
  const {byMake,allMakes} : {byMake:ByMake,allMakes:Array<string>} = input
  const makeDirPath = path.join(options.outputDir,'makes')
  console.log(`
Creating the home page
Take a look at a sample page here #
`)
  const status = Promise.all([
    buildHomePage(options.outputDir, input),
    generateMakes(makeDirPath,{byMake,allMakes})
  ])
  return status
}

export default generateApp
