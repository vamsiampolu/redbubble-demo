//@flow
import getGenerateModelPage from './model'
import curry from 'lodash/fp/curry'
import map from 'lodash/fp/map'
import path from 'path'
import {mkdirp} from 'fs-promise'
import {buildMakeHomePage} from './home'
import type {ByMake,Make} from '../types'
import co from 'co'

//we map over allModels, each model will return a Promise. so we have Array<Promise>

export const generateModelPagesByMake = curry(
    (parentDir:string,byMake:ByMake,makeName:string):Promise<Array<any>> => {
    const makePath = path.join(parentDir,makeName)
    const make:Make = byMake[makeName]
    const { allModels, byModel } = make
    const generateModelPage = getGenerateModelPage(makePath,byModel)
    const modelPromises = map(generateModelPage,allModels)
    const res = Promise.all(modelPromises)
    return res
  }
)

//here we assume that the directory does not already exist

export const createDirectoryForMake = curry(
  (parentDir:string,makeName:string):Promise <any> => {
    const dirPath = path.join(parentDir,makeName)
    const promise =  mkdirp(dirPath)
    return promise
  }
)

//if dir status is ok, create all the files, wrap it in co when you invoke the generator
//how do I let flowtype know that I am returning a generator function from a function

const getGenerateMakeOutput = curry(
  function(parentDir:string,byMake:ByMake,makeName:string):Promise<any> {
    function * generateMakeOutput() {
      try {
        const dirStatusPromise = createDirectoryForMake(parentDir,makeName)
        const dirMade = yield dirStatusPromise
        const status = yield Promise.all([
          buildMakeHomePage(parentDir,byMake,makeName),
          generateModelPagesByMake(parentDir,byMake,makeName)
        ])
        return status
      } catch(e) {
        console.error(e)
      }
    }
    return co(generateMakeOutput)
  }
)

export default getGenerateMakeOutput
