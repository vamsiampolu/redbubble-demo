//@flow
import path from 'path'
import {isWebUri} from 'valid-url'
import isValidPath from 'is-valid-path'
import type {Size} from '../types'
import fs from 'fs'

export function hasValidParentDirectory(pathStr:string):boolean {
  console.log('has valid parent directory')
  console.log(isValidPath,pathStr)
  if(isValidPath(pathStr)) {

    if(pathStr.includes(path.sep)) {
      const lastIndex = pathStr.lastIndexOf(path.sep)
      const parent = pathStr.slice(0,lastIndex)
      const stats = fs.statSync(parent)
      if(stats.isDirectory()) {
        return pathStr
      }
      return false
    }
  }
  return pathStr
}

export function isValidSize(size:Size):boolean{
  const sizes = [
    'small',
    'medium',
    'large'
  ]
  return sizes.includes(size)
}

export function isValidUrl(url:string):boolean {
  if(isWebUri(url)) {
    return url
  }
  return false
}
