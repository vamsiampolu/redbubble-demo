//@flow

import curry from 'lodash/fp/curry'
import map from 'lodash/fp/map'
import type { Model, Thumbnail,Page,Size,Gallery,Id } from '../types'
import buildPage from './page'

export const getMenuForModel = (name:string) => ({
  title:name,
  menuItems:[
    {
      url:'./index.html',
      link:'Make'
    },
    {
      url:'../../index.html',
      link:'Home'
    }
  ]
})

const getConvertIdToThumbnail = curry(
  ({model,size='medium'}:{model:Model,size:Size},id:string) => ({
      alt:id,
      src:model.byId[id].urls[size]
    })
)

export function convertModelToGallery(model:Model,size:Size = 'medium'):Gallery {
  const convertIdToThumbnail = getConvertIdToThumbnail({ model, size })
  const res = {
    thumbnails: map(convertIdToThumbnail,model.allIds)
  }
  return res
}

export function convertModelToPage(model:Model,size:Size = 'medium',modelName:string):Page {
  return {
    menu: getMenuForModel(modelName),
    gallery: convertModelToGallery(model, size),
    title: modelName
  }
}

export default function renderModel(size:Size = 'medium',model:Model,modelName:string):string {
  const pageObj = convertModelToPage(model, size,modelName)
  const pageStr = buildPage(pageObj)
  return pageStr
}
