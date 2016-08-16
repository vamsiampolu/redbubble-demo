//@flow

import map from 'lodash/fp/map'
import type {Urls,Url,Size,WorkUrl,Work,Id,ById} from '../types'

const getSize = (url:WorkUrl):Size => url.type


const reshapeUrl = (url:WorkUrl):Url => {
  const size:Size = url['type']
  const type:string = url['_@ttribute']
  return {
    [size]:type
  }
}

const getAllSizes = map(getSize)
const reshapeUrls = map(reshapeUrl)

const transformUrls = (url:Array<WorkUrl>):Urls => {
   const allSizes = getAllSizes(url)
   const byUrl =    Object.assign.apply({}, reshapeUrls(url))
   return {
    allSizes,
    ...byUrl
   }
}

const mapIds = ({
    id,
    urls:{
      url
    },
    exif,
    ...rest
  }) => ({

  [id]:{
    exif:exif,
    urls: transformUrls(url),
    ...rest
  }
})

const getById = map(mapIds)

const extractByIds = (works:Array<Work>) => Object.assign.apply({},getById(works))

export const extractByIdsForFirstTenWorks = (works:Array<Work>):ById => {
  const firstTenWorks:Array<Work> = works.slice(0,10)
  return extractByIds(firstTenWorks)
}

export default extractByIds
