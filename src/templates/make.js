//@flow
import buildPage from './page'
import type {Make,Menu,MenuItem,Thumbnail,Id,Size,Gallery,Page} from '../types'
import {convertModelToGallery} from './model'
import map from 'lodash/fp/map'
import flatten from 'lodash/fp/flatten'
import compose from 'lodash/fp/compose'
import curry from 'lodash/fp/curry'


function buildMenuItem(modelName:string):MenuItem {
  console.log(modelName)
  return {
    link:modelName,
    url:`./${modelName}.html`
  }
}

const buildMenuItems = map(buildMenuItem)

export function buildMenuForMake(name:string,make:Make):Menu {
  const {allModels}:{allModels:Array<string>} = make
  return {
    menuItems: buildMenuItems(allModels),
    title:name
  }
}


const getPluckThumbnailFromModel = curry(({make,size = 'medium'}:{make:Make,size:Size},modelName:string):Array<Thumbnail> => {
  console.log(modelName)
  const model = make.byModel[modelName]
  const { thumbnails } = convertModelToGallery(model,size)
  return thumbnails
})


export function convertMakeToGallery(make:Make,size:Size = 'medium'):Gallery {
  const allModels = make.allModels
  const pluckThumbnailFromModel = getPluckThumbnailFromModel({make,size})
  const getFlattenedThumbnails = compose(flatten,map(pluckThumbnailFromModel))
  return {
    thumbnails:getFlattenedThumbnails(allModels)
  }
}

export function buildPageFromMake(size:Size = 'medium',make:Make,name:string):Page {
  const res = {
    menu:buildMenuForMake(name, make),
    gallery:convertMakeToGallery(make,size),
    title:name
  }
  return res
}

export function renderPage(size:Size = 'medium',make:Make,name:string):string {
  const pageObj = buildPageFromMake(size, make, name)
  const pageStr = buildPage(pageObj)
  return pageStr
}
