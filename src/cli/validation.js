import path from 'path'
import {isWebUri} from 'is-valid-url'
import isValidPath from 'is-valid-path'
import type {Size} from '../types'

export function hasValidParentDirectory(pathStr:string):boolean {
  if(isValidPath(pathStr)) {

    if(pathStr.includes(path.sep)) {
      const lastIndex = pathStr.lastIndexOf(path.sep)
      const parent = pathStr.slice(0,lastIndex)
    }

    const stats = fs.statSync(parent)
    return stats.isDirectory()
  }
}

export function isValidSize(size:Size):boolean{
  const sizes = [
    'small',
    'medium',
    'large'
  ]
  return sizes.include(size)
}

export function isValidUrl(url:string):boolean {
  if(isWebUri(url)) {
    return true
  }
  return false
}
