//@flow
import renderHome from '../templates/home'
import {renderPage as renderMake} from '../templates/make'
import {writeFile} from 'fs-promise'
import path from 'path'
import type {ProcessedInput,ByMake} from '../types'

const INDEX_FILE_NAME = 'index.html'

export const buildHomePage = (dirPath:string,input:ProcessedInput):Promise<any> => {
  const homeStr = renderHome(input,'medium')
  const filePath = path.join(dirPath, INDEX_FILE_NAME)
  return writeFile(filePath,homeStr)
}

export const buildMakeHomePage = (dirPath:string,byMake:ByMake,makeName:string):Promise<any> => {
  const filePath = path.join(dirPath,makeName,INDEX_FILE_NAME)
  const make = byMake[makeName]
  const homeStr = renderMake('medium', make, makeName)
  const res =  writeFile(filePath,homeStr)
  return res
}
